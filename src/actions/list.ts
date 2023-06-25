import { t } from "../localization";
import TelegramBotHelper, { InlineButton } from "../services/telegram";
import { ActionStates, ActionType, ListProcessStep } from "../states/actions";
import { deleteUser, getUserExpirationInfo, getUsers } from "../helpers/user";
import { LimitConf } from "../helpers/limitConf";

export const processListSteps = async (chatId: string, data?: string) => {
  const step = ActionStates.ListProcess.getState();

  if (step === ListProcessStep.None) {
    getUsers()
      .then((users) => {
        const newList = users.filter((user) => user.uid > 999);
        const buttons: InlineButton[][] = [];
        const rows = Math.ceil(newList.length / 5);
        for (let i = 0; i < rows; i++) {
          buttons.push([]);
        }

        newList.forEach((user, index) => {
          buttons[Math.floor(index / 5)].push({
            name: user.username,
            data: "list_" + user.username,
          });
        });

        TelegramBotHelper.sendMessage(chatId, t("choose_user"), buttons);
        ActionStates.ListProcess.setState(ListProcessStep.ChooseUser);
      })
      .catch((error) => {
        console.log(error);
        TelegramBotHelper.sendMessage(chatId, t("something_went_wrong"));
      });
  } else if (step === ListProcessStep.ChooseUser) {
    if (data && typeof data === "string") {
      const userName = data.replace("list_", "");
      getUserExpirationInfo(userName).then((info) => {
        if (info.accountExpires) {
          const userLimitInfo = LimitConf.getUserLimit(userName);
          TelegramBotHelper.sendMessage(
            chatId,
            `Name: ${userName}\nExpire Date: ${info.accountExpires.toDateString()}\nMax Connections: ${
              userLimitInfo ? userLimitInfo.maxConnections : 0
            }`
          );
        }
        ActionStates.ListProcess.setState(ListProcessStep.None);
        ActionStates.CurrentAction.setState(ActionType.None);
      });
    }
  }
};
