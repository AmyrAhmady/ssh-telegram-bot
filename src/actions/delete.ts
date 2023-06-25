import { t } from "../localization";
import TelegramBotHelper, { InlineButton } from "../services/telegram";
import { ActionStates, ActionType, DeleteProcessStep } from "../states/actions";
import { deleteUser, getUsers } from "../helpers/user";
import { LimitConf } from "../helpers/limitConf";

export const processDeleteSteps = async (chatId: string, data?: string) => {
  const step = ActionStates.DeleteProcess.getState();

  if (step === DeleteProcessStep.None) {
    getUsers()
      .then((users) => {
        if (users) {
          const newList = users.filter((user) => user.uid > 999);
          const buttons: InlineButton[][] = [];
          const rows = Math.ceil(newList.length / 5);
          for (let i = 0; i < rows; i++) {
            buttons.push([]);
          }

          newList.forEach((user, index) => {
            buttons[Math.floor(index / 5)].push({
              name: user.username,
              data: "delete_" + user.username,
            });
          });

          TelegramBotHelper.sendMessage(chatId, t("choose_user"), buttons);
          ActionStates.DeleteProcess.setState(DeleteProcessStep.ChooseUser);
        } else {
        }
      })
      .catch((error) => {
        TelegramBotHelper.sendMessage(chatId, t("something_went_wrong"));
      });
  } else if (step === DeleteProcessStep.ChooseUser) {
    if (data && typeof data === "string") {
      const userName = data.replace("delete_", "");
      deleteUser(userName)
        .then((result) => {
          if (result) {
            LimitConf.removeUser(userName);
            TelegramBotHelper.sendMessage(chatId, t("deleted_successfully"));
            ActionStates.DeleteProcess.setState(DeleteProcessStep.None);
            ActionStates.CurrentAction.setState(ActionType.None);
          }
        })
        .catch((error) => {
          TelegramBotHelper.sendMessage(chatId, t("something_went_wrong"));
        });
    }
  }
};
