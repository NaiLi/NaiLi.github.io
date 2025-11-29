
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