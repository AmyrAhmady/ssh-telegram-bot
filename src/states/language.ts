class LanguageStateManager {
  private State: string;
  InitialValue: string;

  constructor(initialValue: string) {
    this.State = initialValue;
    this.InitialValue = initialValue;
  }

  getState = () => {
    return this.State;
  };

  setState = (value: string) => {
    this.State = value;
  };
}

const LanguageState = new LanguageStateManager("en");

export default LanguageState;
