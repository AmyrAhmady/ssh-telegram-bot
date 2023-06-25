import TelegramBotHelper from "../services/telegram";
import { createUser } from "../helpers/user";
import { t } from "../localization";
import { ActionStates, ActionType, CreateProcessStep } from "../states/actions";
import UserTempState from "../states/users";
import { LimitConf } from "../helpers/limitConf";

export const processCreateSteps = async (chatId: string, data?: string) => {
  const step = ActionStates.CreateProcess.getState();

  // Start
  if (step === CreateProcessStep.None) {
    askForUserName(chatId);
    UserTempState.setAllStates(UserTempState.InitialValue);
  }
  // Handling creation menu
  else if (step === CreateProcessStep.Menu) {
    if (data) {
      if (data === "edit_name") {
        askForUserName(chatId);
      } else if (data === "edit_days") {
        askForDays(chatId);
      } else if (data === "edit_max_connections") {
        askForMaxConnections(chatId);
      }
      // Finish creation
      else if (data === "create_user") {
        finishCreation(chatId);
      }
    } else {
      TelegramBotHelper.sendMessage(chatId, t("something_went_wrong"));
      askForUserName(chatId);
    }
  }
  // Entering user's name
  else if (step === CreateProcessStep.EnterName) {
    if (data) {
      await createUserAfterNameInput(chatId, data);
    } else {
      TelegramBotHelper.sendMessage(chatId, t("something_went_wrong"));
      askForUserName(chatId);
    }
  }
  // Entering max connection count
  else if (step === CreateProcessStep.EnterMaxConnections) {
    if (data) {
      const maxConns = parseInt(data);
      if (!Number.isNaN(maxConns) && maxConns != undefined) {
        UserTempState.setState("maxConnections", maxConns);
        sendOptions(chatId, t("max_connections_changed_to"));
      } else {
        sendOptions(chatId, t("something_went_wrong"));
      }
    } else {
      sendOptions(chatId, t("something_went_wrong"));
    }
  }
  // Entering day count
  else if (step === CreateProcessStep.EnterDays) {
    if (data) {
      const days = parseInt(data);
      if (!Number.isNaN(days) && days != undefined) {
        UserTempState.setState("days", days);
        sendOptions(chatId, t("days_changed_to"));
      } else {
        sendOptions(chatId, t("something_went_wrong"));
      }
    } else {
      sendOptions(chatId, t("something_went_wrong"));
    }
  }
};

const askForUserName = (chatId: string) => {
  TelegramBotHelper.sendMessage(chatId, t("enter_usename"));
  ActionStates.CreateProcess.setState(CreateProcessStep.EnterName);
};

const askForDays = (chatId: string) => {
  TelegramBotHelper.sendMessage(chatId, t("enter_days"));
  ActionStates.CreateProcess.setState(CreateProcessStep.EnterDays);
};

const askForMaxConnections = (chatId: string) => {
  TelegramBotHelper.sendMessage(chatId, t("enter_max_connections"));
  ActionStates.CreateProcess.setState(CreateProcessStep.EnterMaxConnections);
};

const createUserAfterNameInput = async (chatId: string, name: string) => {
  UserTempState.setAllStates(UserTempState.InitialValue);
  UserTempState.setState("name", name);
  const userInfo = UserTempState.getState();
  sendOptions(chatId, t("name_changed_to") + userInfo.name);
};

const finishCreation = (chatId: string) => {
  const userInfo = UserTempState.getState();
  const expireDate = new Date(Date.now() + userInfo.days * 24 * 60 * 60 * 1000);
  createUser(userInfo.name, expireDate, userInfo.maxConnections)
    .then((user) => {
      TelegramBotHelper.sendMessage(
        chatId,
        t("user_created_with_info") + JSON.stringify(user, undefined, 2)
      );
      LimitConf.setUser(userInfo.name, userInfo.maxConnections);
      ActionStates.CreateProcess.setState(CreateProcessStep.None);
      ActionStates.CurrentAction.setState(ActionType.None);
    })
    .catch((error) => {
      console.log(error);
      sendOptions(chatId, t("something_went_wrong"));
    });
};

const sendOptions = (chatId: string, message: string) => {
  const userInfo = UserTempState.getState();
  TelegramBotHelper.sendMessage(chatId, message, [
    [
      {
        name: "Name: " + userInfo.name,
        data: "edit_name",
      },
    ],
    [
      {
        name: "Days to expire from now: " + userInfo.days,
        data: "edit_days",
      },
    ],
    [
      {
        name: "Max connections: " + userInfo.maxConnections,
        data: "edit_max_connections",
      },
    ],
    [
      {
        name: "Finish creation",
        data: "create_user",
      },
    ],
  ]);
  ActionStates.CreateProcess.setState(CreateProcessStep.Menu);
};
