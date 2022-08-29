
const Defaultconfig = {
  filesPath: '/i18n', // Lookup => /i18n/{language}.json
  dataAttrName: 'data-i18n-key',
  localStorageKeyName: 'language', // i.e. 'es', 'en'
  sessionCacheKeyPrefix: 'i18n', // i18n-{language}
  defaultLanguage: navigator.language?.split('-')[0],
  rootElement: document.documentElement,
};

export function useI18n(configOverride) {
  const config = { ...Defaultconfig, ...configOverride }
  config._rootElementDefaulLanguage = config.rootElement.lang?.split('-')[0] || 'default';

  const { getLocalLanguage, setLocalLanguage, cacheLocalLanguageInSession, translateUI } = setupWith(config);

  cacheLocalLanguageInSession(config._rootElementDefaulLanguage);

  if (!getLocalLanguage()) setLocalLanguage(config.defaultLanguage);

  if (config._rootElementDefaulLanguage !== getLocalLanguage()) translateUI();

  async function translateInto(newLanguage) {
    if (newLanguage === getLocalLanguage()) {
      console.info(`Omitting translating same langauage "${newLanguage}".`);
      return;
    }

    setLocalLanguage(newLanguage);
    return await translateUI();
  }

  return [getLocalLanguage, translateInto];
}


function setupWith(config) {
  const getLocalLanguage = () => localStorage.getItem(config.localStorageKeyName);
  const setLocalLanguage = (lang) => localStorage.setItem(config.localStorageKeyName, lang);

  function getSessionCache(language) {
    return JSON.parse(sessionStorage.getItem(`${config.sessionCacheKeyPrefix}-${language}`));
  }

  function setSessionCache(language, data) {
    sessionStorage.setItem(`${config.sessionCacheKeyPrefix}-${language}`, JSON.stringify(data));
  }

  function cacheLocalLanguageInSession(language) {
    let data = {};
    for (const element of config.rootElement.querySelectorAll(`[${config.dataAttrName}]`)) {
      data[element.getAttribute(config.dataAttrName)] = element.innerText.trim();
    }
    setSessionCache(language, data);
  }

  async function translateUI() {
    const language = getLocalLanguage();
    let data = getSessionCache(language);
    const fallbackTranslations = getSessionCache(config._rootElementDefaulLanguage);

    console.info(`Translating ui into "${language}".`)

    if (data) {
      console.info(`Using cached language for "${language}".`);
    } else {
      const url = `${config.filesPath}/${language}.json`;
      data = await (await fetch(url)).json();
      setSessionCache(language, data);
    }

    for (const element of config.rootElement.querySelectorAll(`[${config.dataAttrName}]`)) {
      const key = element.getAttribute(config.dataAttrName);
      const translation = data[key];
      if (translation) {
        element.innerText = translation;
      } else {
        element.innerText = fallbackTranslations[key];
      }
    }

    config.rootElement.setAttribute('lang', language);

  }

  return {
    getLocalLanguage,
    setLocalLanguage,
    cacheLocalLanguageInSession,
    translateUI,
  }
}
