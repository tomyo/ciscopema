function setUpPressInfoModal() {
  const pressInfoButton = document.querySelector("#press-info");
  const dialog = document.querySelector("dialog");

  pressInfoButton.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.showModal();
  });
}

async function localize() {
  const { useL10n } = await import("./lib/i18n/use-l10n.js");
  const [getUILanguage, getPreferredLanguage, translateInto] = useL10n({
    filesPath: "./l10n/",
  });
  const langSwitcher = document.querySelector("#lang-switcher");

  langSwitcher.addEventListener("change", (e) => translateInto(e.target.value));

  if (getUILanguage() !== getPreferredLanguage()) {
    await translateInto(getPreferredLanguage());
  }

  langSwitcher.value = getUILanguage();
}

setUpPressInfoModal();
localize();
