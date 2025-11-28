
    // Blink-animation på hover
    const img = document.getElementById('portrait');
    img.addEventListener('mouseover', () => img.src = 'img/clown-blink.png');
    img.addEventListener('mouseout', () => img.src = 'img/clown.png');

    const b = document.querySelector('.scroll-bubble');

    function animateBubble() {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const t = window.scrollY / scrollMax; // 0 → 1 beroende på scroll

      // Parabel: y = -(x-1)^2 + 1 (normaliserad 0→1)
      const px = t;                   // x-progress
      const parabola = -((px - 1)**2) + 1;

      // Position på skärmen (du kan justera dessa)
      const xPos = 110 - px * 70;     // 90% → 20% på X-axeln
      const yPos = 10 + parabola * 40; // 10% → 50% höjd

      // Fade ut mot slutet
      const opacity = Math.max(0, 1 - t * 1.2);

      b.style.transform = `translate(${xPos}vw, ${yPos}vh)`;
      b.style.opacity = opacity;
    }

    window.addEventListener('scroll', animateBubble);
    animateBubble();

//   const targetDate = "2026-03-07";
  const targetDate = "2025-11-29";

  /* Skapa 40 ljus */
  const total = 40;
  candleContainerWidth = 300; // px
  candleContainerHeight = 500; // px
  const container = document.getElementById('candlesContainer');

  drawCandle(total, candleContainerWidth/2, 50, dateTargetDateToday()); // sista ljuset, alltid uppe i hörnet

  for(let i=1;i<total;i++){
    let randomPositionX = candleContainerWidth * Math.random();
    let randomPositionY = 100 + candleContainerHeight * Math.random();
    drawCandle(i, randomPositionX, randomPositionY, true);
  }

  /* Hitta dagens lokaldatum i Europe/Stockholm - men vi kan jämföra bara datum-delen i användarens lokala tid (webbläsarens). */
  function localDateString(dateObj){
    // returnerar YYYY-MM-DD i lokal tid
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth()+1).padStart(2,'0');
    const d = String(dateObj.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  }

  function drawCandle(i, positionX, positionY, lit){
    const cand = document.createElement('div');
    cand.className = 'candle';
    cand.setAttribute('data-index', i);
    cand.style.right = positionX + 'px';
    cand.style.top = positionY + 'px';
    cand.style.position = 'absolute';

    const wax = document.createElement('div');
    wax.className = 'wax';

    const wick = document.createElement('div');
    wick.className = 'wick';

    wax.appendChild(wick);
    
    if(lit){
        const flame = document.createElement('div');
        flame.className = 'flame';
      wick.style.opacity = '';
      wax.appendChild(flame);
    }

    cand.appendChild(wax);
    container.appendChild(cand);
  }


  function updateState(){
    const today = new Date();
    const todayStr = localDateString(today);

    const daysLeftEl = document.getElementById('daysLeft');

    const target = new Date(targetDate + "T00:00:00"); // tolka som midnatt lokal tid
    // räkna dagar (UTC-ignorant men bra för vanlig nedräkning)
    const msPerDay = 24*60*60*1000;
    // räkna skillnad i lokal datum: nollställ tid
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const t1 = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const diffDays = Math.round((t1 - t0) / msPerDay);

    if (diffDays > 0){
      daysLeftEl.textContent = diffDays + " dag" + (diffDays===1 ? "" : "ar");
      // Fram till födelsedagen: 39 tända, sista släckt
    //   setLitCandles(39, false);
    } else if (diffDays === 0) {
      daysLeftEl.textContent = "GRATTIS! Idag är din födelsedag 🎉";
      // På födelsedagen: tänd sista ljuset
      setLitCandles(40, true);
    } else {
      // efter födelsedag (passerat) — visa alla tända
      daysLeftEl.textContent = "Passerat — alla ljus tända";
    //   setLitCandles(40, true);
    }
  }

  /* Funktion som sätter X ljus tända (sätter/unsetar klass 'unlit' på sista) */
  function setLitCandles(countLit, animate){
    const candles = Array.from(document.querySelectorAll('.candle'));
    // Vi vill 1..countLit vara tända
    candles.forEach((c, idx) => {
      const i = idx+1;
      if (i <= countLit) {
        c.classList.remove('unlit');
        // se till att lågan syns (i händelse vi senare togglar)
        const fl = c.querySelector('.flame');
        const wk = c.querySelector('.wick');
        if (fl) fl.style.opacity = '';
        if (wk) wk.style.opacity = '';
      } else {
        c.classList.add('unlit');
      }
    });

    // Extra: om sista tänds kan vi göra en snabb "pop" animation
    if (animate && countLit === candles.length) {
      const last = candles[candles.length-1];
      if (last) {
        last.style.transition = 'transform .18s ease';
        last.style.transform = 'scale(1.18)';
        setTimeout(()=> last.style.transform='', 220);
      }
    }
  }

  function dateTargetDateToday(){
    const today = new Date();
    const todayStr = localDateString(today);
    return targetDate === todayStr;
  }

  /* Init */
  updateState();

  /* valfritt: uppdatera vid midnatt lokal tid så att sidan automatiskt uppdateras om den är öppen */
  (function scheduleDailyRefresh(){
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0,0,5);
    const ms = nextMidnight - now;
    setTimeout(()=> { updateState(); scheduleDailyRefresh(); }, ms);
  })();