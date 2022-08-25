const pressInfoButton = document.querySelector('#press-info');
const dialog = document.querySelector('dialog');

pressInfoButton.addEventListener('click', () => dialog.showModal());


// i18n
const { useI18n } = await import('./utils/useI18n.js');
const [getLanguage, updateLangauge] = useI18n();

const langSwitcher = document.querySelector("#lang-switcher");
langSwitcher.value = getLanguage();

const songkickWidget = document.querySelector(".songkick-widget");
if (getLanguage() == 'es') {
  songkickWidget.dataset.locale = 'es';
}
const script = songkickWidget.nextElementSibling;
script.src = script.dataset.src;

langSwitcher.addEventListener('change', (e) => updateLangauge(e.target.value));
