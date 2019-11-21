import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'


import translationEN from './assets/translations/en.json';
import translationES from './assets/translations/es.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  }
};

i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    nsSeparator: '.',
    keySeparator: '.',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });


export default i18n
