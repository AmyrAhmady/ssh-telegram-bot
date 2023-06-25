export interface UserTempSettingsInput {
  maxConnections: number;
  days: number;
  name: string;
}

class UserTempStates {
  private State: UserTempSettingsInput;
  InitialValue: UserTempSettingsInput;

  constructor(initialValue: UserTempSettingsInput) {
    this.State = initialValue;
    this.InitialValue = initialValue;
  }

  getState = () => {
    return { ...this.State };
  };

  setState = <
    K extends keyof UserTempSettingsInput,
    V extends UserTempSettingsInput[K]
  >(
    key: K,
    value: V
  ) => {
    this.State[key] = value;
  };

  setAllStates = (state: UserTempSettingsInput) => {
    this.State = { ...state };
  };
}

const UserTempState = new UserTempStates({
  maxConnections: 1,
  days: 30,
  name: "default_name",
});

export default UserTempState;
