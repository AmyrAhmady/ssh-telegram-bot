import LanguageState from "../states/language";

const locales = {
  en: require("./en.json"),
};

export const setLanguage = (language: string) => {
  LanguageState.setState(language);
};

export const t = (textKey: string) => {
  let language = LanguageState.getState();
  if (!Object.keys(locales).includes(language)) {
    language = "en";
  }

  if (locales.en[textKey]) {
    return locales.en[textKey];
  } else {
    return textKey;
  }
};
