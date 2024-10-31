export function loadLanguage(lang) {
  console.log("the lang is: ", lang);
  fetch(`/assets/lang/${lang}.json`)
      .then((response) => response.json())
      .then((translations) => {
          applyTranslations(translations);
      })
      .catch((error) => {
        loadLanguage('en');
    });
}

export function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
          element.textContent = translations[key];
      }
  });
}

export function changeLanguage(lang) {
  loadLanguage(lang);
  localStorage.setItem('preferredLanguage', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferredLanguage') || 'en';
  changeLanguage(savedLang);
});