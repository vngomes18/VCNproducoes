const scrollLinks = document.querySelectorAll('a[href^="#"]');
scrollLinks.forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href').slice(1);
    const el = document.getElementById(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const forms = [document.getElementById('lead-form'), document.getElementById('lead-form-final')].filter(Boolean);

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateTelefone(t) {
  return /\d{8,}/.test((t || '').replace(/\D/g, ''));
}

forms.forEach(formEl => {
  const feedbackEl = formEl.querySelector('.form-feedback');
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formEl).entries());

    if (!data.nome || !data.telefone || (formEl.id === 'lead-form' && !data.email)) {
      feedbackEl.textContent = formEl.id === 'lead-form' ? 'Preencha nome, e-mail e telefone.' : 'Preencha nome e telefone.';
      feedbackEl.className = 'form-feedback error';
      return;
    }
    if (formEl.id === 'lead-form' && !validateEmail(data.email)) {
      feedbackEl.textContent = 'E-mail inválido.';
      feedbackEl.className = 'form-feedback error';
      return;
    }
    if (!validateTelefone(data.telefone)) {
      feedbackEl.textContent = 'Telefone inválido.';
      feedbackEl.className = 'form-feedback error';
      return;
    }

    try {
      const lead = { ...data, createdAt: new Date().toISOString() };
      const existing = JSON.parse(localStorage.getItem('vcn_leads') || '[]');
      existing.push(lead);
      localStorage.setItem('vcn_leads', JSON.stringify(existing));
      feedbackEl.textContent = 'Recebido! Vamos retornar em até 1h útil.';
      feedbackEl.className = 'form-feedback success';
      formEl.reset();
    } catch (err) {
      feedbackEl.textContent = 'Erro ao enviar. Tente novamente.';
      feedbackEl.className = 'form-feedback error';
    }
  });
});

// Atraso do conteúdo do Hero: aparece 5s após o vídeo iniciar
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-delayed');
  const video = document.querySelector('.bg-video');

  if (!hero) return;

  const showHero = () => {
    hero.classList.add('show');
  };

  let started = false;
  const startTimer = () => {
    if (started) return;
    started = true;
    setTimeout(showHero, 5000);
  };

  if (video) {
    video.addEventListener('playing', startTimer, { once: true });
    video.addEventListener('canplay', startTimer, { once: true });
    // Fallback: garante início do timer mesmo se o evento demorar
    setTimeout(() => { if (!started) startTimer(); }, 2000);
  } else {
    // Sem vídeo, revela rapidamente para não bloquear o conteúdo
    setTimeout(showHero, 500);
  }

  const viewport = document.querySelector('.portfolio-viewport');
  const track = document.querySelector('.portfolio-track');
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  if (viewport && track && prev && next) {
    const cards = Array.from(track.querySelectorAll('.portfolio-card'));
    const GAP = 8;
    let index = 0;
    const maxIndex = Math.max(0, cards.length - 3);

    const setWidths = () => {
      const w = viewport.clientWidth;
      const cardW = Math.max(160, Math.floor((w - GAP * 2) / 3));
      cards.forEach(c => { c.style.width = cardW + 'px'; });
    };
    const step = () => (cards[0]?.offsetWidth || 220) + GAP;
    const update = () => {
      track.style.transform = `translateX(${-index * step()}px)`;
      if (index === 0) prev.classList.add('disabled'); else prev.classList.remove('disabled');
      if (index >= maxIndex) next.classList.add('disabled'); else next.classList.remove('disabled');
    };
    setWidths();
    update();
    window.addEventListener('resize', () => { setWidths(); update(); });
    prev.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
    next.addEventListener('click', () => { index = Math.min(maxIndex, index + 1); update(); });
  }
});