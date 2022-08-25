
const Config = {
  filesPath: '/i18n', // Lookup => /i18n/{language}.json
  dataAttrName: 'data-i18n-key',
  localStorageKeyName: 'language', // i.e. 'es', 'en'
  sessionCacheKeyPrefix: 'i18n', // i18n-{language}
  documentLanguage: document.documentElement.lang.split('-')[0],
  defaultLanguage: navigator.language?.split('-')[0],
}

const getLocalLanguage = () => localStorage.getItem(Config.localStorageKeyName);
const setLocalLanguage = (lang) => localStorage.setItem(Config.localStorageKeyName, lang);

export function useI18n(configOverride) {
  Object.assign(Config, configOverride);

  cacheLocalTranslationsInSession(Config.documentLanguage);

  if (!getLocalLanguage()) setLocalLanguage(Config.defaultLanguage);

  if (Config.documentLanguage !== getLocalLanguage()) translateUI();

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

function getSessionCache(language) {
  return JSON.parse(sessionStorage.getItem(`${Config.sessionCacheKeyPrefix}-${language}`));
}

function setSessionCache(language, data) {
  sessionStorage.setItem(`${Config.sessionCacheKeyPrefix}-${language}`, JSON.stringify(data));
}

function cacheLocalTranslationsInSession(language) {
  let data = {};
  for (const element of document.querySelectorAll(`[${Config.dataAttrName}]`)) {
    data[element.getAttribute(Config.dataAttrName)] = element.innerText.trim();
  }
  setSessionCache(language, data);
}


async function translateUI() {
  const language = getLocalLanguage();
  let data = getSessionCache(language);

  console.info(`Translating ui into "${language}".`)

  if (data) {
    console.info(`Using cached language for "${language}".`);
  } else {
    const url = `${Config.filesPath}/${language}.json`;
    data = await (await fetch(url)).json();
    setSessionCache(language, data);
  }

  for (const [key, value] of Object.entries(data)) {
    const element = document.querySelector(`[${Config.dataAttrName}="${key}"]`);
    if (element) element.innerText = value;
  }
}
