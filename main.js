const glow = document.getElementById('glow');
  window.addEventListener('mousemove', (e) => {
    glow.style.setProperty('--gx', e.clientX + 'px');
    glow.style.setProperty('--gy', e.clientY + 'px');
  });

  // Scroll-triggered "peak avoided" moment in the demo section
  const demoSection = document.getElementById('demo');
  const peakBar = document.getElementById('peakBar');
  const peakVal = document.getElementById('peakVal');
  const costVal = document.getElementById('costVal');
  const pill = document.getElementById('resolvedPill');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateNumber(el, from, to, prefix, suffix, duration){
    const start = performance.now();
    function step(now){
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = (from + (to - from) * eased).toFixed(1);
      el.textContent = prefix + current + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  let triggered = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        if (reduceMotion) {
          peakBar.style.width = '58%';
          peakBar.classList.add('safe');
          peakVal.textContent = '4.9 kW';
          peakVal.classList.add('safe');
          costVal.innerHTML = '₹842 <span style="font-size:16px; color:#9a9c8b;">/ ₹1,010</span>';
          pill.classList.add('show');
          return;
        }
        setTimeout(() => {
          peakBar.style.width = '58%';
          peakBar.classList.add('safe');
          animateNumber(peakVal, 6.2, 4.9, '', ' kW', 4000);
          setTimeout(() => peakVal.classList.add('safe'), 3200);
          costVal.innerHTML = '₹842 <span style="font-size:16px; color:#9a9c8b;">/ ₹1,010</span>';
          pill.classList.add('show');
        }, 700);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(demoSection);

  // forecast chart: draw the line in once, on scroll
  const forecastWrap = document.getElementById('forecastWrap');
  const forecastObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        forecastWrap.classList.add('in-view');
        forecastObserver.disconnect();
      }
    });
  }, { threshold: 0.35 });
  forecastObserver.observe(forecastWrap);
