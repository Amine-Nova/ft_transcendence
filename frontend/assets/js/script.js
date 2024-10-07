function loadLanguage(lang) {
  fetch(`/assets/lang/${lang}.json`)
      .then((response) => response.json())
      .then((translations) => {
          applyTranslations(translations);
      })
      .catch((error) => console.error('Error loading language file:', error));
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







//  // Function to fetch language data
//  async function fetchLanguageData(lang) {
//     const response = await fetch(`languages/${lang}.json`);
//     return response.json();
//   }
  
//   // Function to set the language preference
//   function setLanguagePreference(lang) {
//     localStorage.setItem('language', lang);
//     location.reload();
//   }
  
//   // Function to update content based on selected language
//   function updateContent(langData) {
//     document.querySelectorAll('[data-i18n]').forEach(element => {
//       const key = element.getAttribute('data-i18n');
//       element.textContent = langData[key];
//     });
//   }
  
//   // Function to change language
//   async function changeLanguage(lang) {
//     await setLanguagePreference(lang);
    
//     const langData = await fetchLanguageData(lang);
//     updateContent(langData);

//     //
//     toggleArabicStylesheet(lang);// Toggle Arabic stylesheet
//   }

// // Function to toggle Arabic stylesheet based on language selection
// function toggleArabicStylesheet(lang) {
//     const head = document.querySelector('head');
//     const link = document.querySelector('#styles-link');
  
//     if (link) {
//       head.removeChild(link); // Remove the old stylesheet link
//     }
//     else if (lang === 'ar') {
//         const newLink = document.createElement('link');
//         newLink.id = 'styles-link';
//         newLink.rel = 'stylesheet';
//         newLink.href = './assets/css/style-ar.css'; // Path to Arabic stylesheet
//         head.appendChild(newLink);
//       }
//   }
  
  
//   // Call updateContent() on page load
//   window.addEventListener('DOMContentLoaded', async () => {
//     console.log("holanda")
//     const userPreferredLanguage = localStorage.getItem('language') || 'en';
//     const langData = await fetchLanguageData(userPreferredLanguage);
//     updateContent(langData);
//     toggleArabicStylesheet(userPreferredLanguage);
//   });