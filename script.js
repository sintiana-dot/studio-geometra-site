(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
    });
  }

  const yearTarget = document.querySelector('#current-year');
  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  const form = document.querySelector('#contact-form');
  const feedback = document.querySelector('#form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const nome = document.querySelector('#nome');
      const email = document.querySelector('#email');
      const telefono = document.querySelector('#telefono');
      const messaggio = document.querySelector('#messaggio');

      const fields = [nome, email, telefono, messaggio];
      const hasEmpty = fields.some((field) => !field || !field.value.trim());
      const emailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

      if (hasEmpty) {
        feedback.textContent = 'Compila tutti i campi obbligatori prima di inviare.';
        feedback.style.color = '#b42318';
        return;
      }

      if (!emailValid) {
        feedback.textContent = 'Inserisci un indirizzo email valido.';
        feedback.style.color = '#b42318';
        return;
      }

      feedback.textContent = 'Modulo dimostrativo. Collegare successivamente a un servizio email o backend.';
      feedback.style.color = '#155b35';
      form.reset();
    });
  }
})();
