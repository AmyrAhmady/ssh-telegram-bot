import { addCommand } from ".";
import { processCreateSteps } from "../actions/create";
import { processDeleteSteps } from "../actions/delete";
import { processListSteps } from "../actions/list";
import {
  ActionStates,
  ActionType,
  CreateProcessStep,
  DeleteProcessStep,
  ListProcessStep,
} from "../states/actions";

addCommand("create", (chatId) => {
  ActionStates.CurrentAction.setState(ActionType.Create);
  ActionStates.CreateProcess.setState(CreateProcessStep.None);
  processCreateSteps(chatId);
});

addCommand("delete", (chatId) => {
  ActionStates.CurrentAction.setState(ActionType.Delete);
  ActionStates.DeleteProcess.setState(DeleteProcessStep.None);
  processDeleteSteps(chatId);
});

addCommand("list", (chatId) => {
  ActionStates.CurrentAction.setState(ActionType.List);
  ActionStates.ListProcess.setState(ListProcessStep.None);
  processListSteps(chatId);
});
