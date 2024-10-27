function loadLanguage(lang) {
  fetch(`/assets/lang/${lang}.json`)
      .then((response) => response.json())
      .then((translations) => {
          applyTranslations(translations);
      })
<<<<<<< HEAD
      .catch((error) => {
        loadLanguage('en');
    });
=======
      .catch((error) => console.error('Error loading language file:', error));
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd
}

function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
          element.textContent = translations[key];
      }
  });
}

function changeLanguage(lang) {
  loadLanguage(lang);
  localStorage.setItem('preferredLanguage', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferredLanguage') || 'en';
  changeLanguage(savedLang);
});