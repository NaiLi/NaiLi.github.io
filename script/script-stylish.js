
//   const targetDate = "2026-03-07";
  const targetDate = "2026-12-03";

  /* Hitta dagens lokaldatum i Europe/Stockholm - men vi kan jämföra bara datum-delen i användarens lokala tid (webbläsarens). */
  function localDateString(dateObj){
    // returnerar YYYY-MM-DD i lokal tid
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth()+1).padStart(2,'0');
    const d = String(dateObj.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
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
      daysLeftEl.textContent = diffDays + " dag" + (diffDays===1 ? "" : "ar") + " kvar! 🎂";
    } else if (diffDays === 0) {
      daysLeftEl.textContent = "GRATTIS! Idag är din födelsedag 🎉";
    } else {
      daysLeftEl.textContent = "Tack för att du firade med mig! 🎈";
    }
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

  (function() {
  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createStars(containerId, count, sizeRange, twinkleChance) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'star';
      // slumpmässig position i procent för responsivitet
      const left = rand(0, 100);
      const top = rand(0, 100);
      // storlek i px
      const size = Math.round(rand(sizeRange[0], sizeRange[1]));
      el.style.left = left + '%';
      el.style.top  = top + '%';
      el.style.width  = size + 'px';
      el.style.height = size + 'px';
      // slumpmässig opacitet och blur för variation
      el.style.opacity = (rand(0.45, 0.98)).toFixed(2);
      if (Math.random() < twinkleChance) {
        el.classList.add('twinkle');
        // ge varje twinkle unik delay och duration
        el.style.animationDelay = (rand(0, 4)).toFixed(2) + 's';
        el.style.animationDuration = (rand(3.2, 5.5)).toFixed(2) + 's';
      } else {
        // små pulseringar för icke-twinkle, ge tiny flicker via transition
        el.style.transition = 'opacity 8s linear';
      }

      // ge små variabler för transform jitter (kan användas senare för mer effekt)
      frag.appendChild(el);
    }
    container.appendChild(frag);
  }

  // Anpassa antal/storlek här:
  createStars('stars-back', 140, [1, 2.5], 0.06);   // många små
  createStars('stars-front', 36, [2.2, 4.6], 0.28); // färre, större, fler blinkande

  // valfri: lägg in en nedtonad gradient-overlay för att ge djup (om du vill)
  // notera: läggs ovanpå .sky men under innehåll om du justerar z-index
})();