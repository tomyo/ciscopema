const pressInfoButton = document.querySelector('#press-info');
const dialog = document.querySelector('dialog');

pressInfoButton.addEventListener('click', () => dialog.showModal());


// i18n
const { useL10n } = await import('./lib/i18n/use-l10n.js');
const [getUILanguage, getPreferredLanguage, translateInto] = useL10n({ filesPath: 'l10n/' });

const langSwitcher = document.querySelector("#lang-switcher");
const availableLanguages = [...langSwitcher.options].map(o => o.value);

if (availableLanguages.includes(getPreferredLanguage())) {
  await translateInto(getPreferredLanguage());
}

langSwitcher.value = getUILanguage();

langSwitcher.addEventListener('change', (e) => translateInto(e.target.value));
