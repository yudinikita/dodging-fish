import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import locales from '@/locales'

export default i18next
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources: {
      ...locales,
    },
  })
