export enum ActionType {
  None,
  Create,
  Delete,
  List,
}

export enum CreateProcessStep {
  None,
  Menu,
  EnterName,
  EnterMaxConnections,
  EnterDays,
}

export enum DeleteProcessStep {
  None,
  ChooseUser,
}

export enum ListProcessStep {
  None,
  ChooseUser,
}

class ActionStateManager<T> {
  private State: T;

  constructor() {
    this.State = 0 as T;
  }

  getState = () => {
    return this.State;
  };

  setState = (value: T) => {
    this.State = value;
  };
}

export namespace ActionStates {
  export const CurrentAction = new ActionStateManager<ActionType>();
  export const CreateProcess = new ActionStateManager<CreateProcessStep>();
  export const DeleteProcess = new ActionStateManager<DeleteProcessStep>();
  export const ListProcess = new ActionStateManager<ListProcessStep>();
}
