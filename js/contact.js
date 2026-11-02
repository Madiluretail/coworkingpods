(function () {
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const status = document.getElementById('status');
  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
    phone: v => { const d = v.replace(/[\s\-()+]/g, ''); return (/^\d{10,13}$/.test(d)) || 'Please enter a valid phone number (10 to 13 digits).'; },
    company: () => true,
    requirement: v => !!v || 'Please choose a workspace requirement.',
    message: v => v.trim().length >= 10 || 'Please add a short message (at least 10 characters).'
  };
  const check = el => {
    const r = rules[el.id](el.value), wrap = el.closest('.field');
    wrap.classList.toggle('bad', r !== true);
    wrap.querySelector('.err').textContent = r === true ? '' : r;
    el.setAttribute('aria-invalid', r !== true);
    return r === true;
  };
  const fields = [...form.querySelectorAll('input,select,textarea')];
  fields.forEach(el => { el.addEventListener('blur', () => check(el)); el.addEventListener('input', () => el.closest('.field').classList.contains('bad') && check(el)); });

  const q = new URLSearchParams(location.search).get('space');
  if (q) { const s = form.requirement; [...s.options].forEach(o => { if (o.value === q) s.value = q; }); }

  const say = (cls, html) => { status.className = 'form-status on ' + cls; status.innerHTML = html; };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const bad = fields.filter(el => !check(el));
    if (bad.length) { bad[0].focus(); say('fail', 'Please correct the highlighted fields and try again.'); return; }
    const data = Object.fromEntries(new FormData(form).entries());
    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(res.status);
        say('ok', 'Thank you. Your enquiry has been received.');
        form.reset();
      } catch (err) {
        say('fail', 'We could not send your enquiry. Please call <a href="tel:9845010100">9845010100</a> or email <a href="mailto:vasants.vlf@gmail.com">vasants.vlf@gmail.com</a>.');
      }
      return;
    }
    const body = `Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nCompany: ${data.company || '-'}\nRequirement: ${data.requirement}\n\n${data.message}`;
    const href = 'mailto:vasants.vlf@gmail.com?subject=' + encodeURIComponent('Workspace enquiry: ' + data.requirement) + '&body=' + encodeURIComponent(body);
    say('info', '<strong>Your details look good, but nothing has been sent yet.</strong> This website is not connected to a server, so the form cannot deliver messages on its own. <a href="' + href + '">Open this enquiry in your email app</a>, or call <a href="tel:9845010100">9845010100</a>.');
  });
})();
