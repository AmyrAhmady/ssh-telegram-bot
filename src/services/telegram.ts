import TelegramBot from "node-telegram-bot-api";
import { executeCommand } from "../commands";
import { ActionStates, ActionType } from "../states/actions";
import { processCreateSteps } from "../actions/create";
import { processDeleteSteps } from "../actions/delete";
import { processListSteps } from "../actions/list";

export interface InlineButton {
  name: string;
  data: string;
}

export default class TelegramBotHelper {
  private static botInfo: { token: string; chatIds: string[] } = {
    token: "",
    chatIds: [],
  };

  private static botInstance: TelegramBot | undefined;

  static initialize(token: string, chatIds: string[]) {
    this.botInfo = { token, chatIds };
    // Create a bot that uses 'polling' to fetch new updates
    this.botInstance = new TelegramBot(token, { polling: true });

    this.initializeEvents();
  }

  static sendMessage(
    chatId: string | number,
    message: string,
    buttons?: InlineButton[][]
  ) {
    if (this.botInstance) {
      let options: TelegramBot.SendMessageOptions | undefined = undefined;
      if (buttons) {
        const inlineKeyboardButtons = buttons.map((row) => {
          return row.map((button) => {
            return {
              text: button.name,
              callback_data: button.data,
            };
          });
        });

        options = {
          reply_markup: {
            force_reply: true,
            inline_keyboard: inlineKeyboardButtons,
          },
        };
      }

      this.botInstance.sendMessage(chatId, message, options);
    } else {
      throw "TelegramBotHelper: Telegram bot is not initialized";
    }
  }

  static setActions(actions: string[][]) {
    if (this.botInstance) {
      // Create commands for our bot
      const commands: {
        command: string;
        description: string;
      }[] = [];

      actions.forEach((action) => {
        commands.push({
          command: action[0],
          description: action[1],
        });
      });

      this.botInstance.setMyCommands(commands);
    } else {
      throw "TelegramBotHelper: Telegram bot is not initialized";
    }
  }

  static initializeEvents() {
    if (this.botInstance) {
      this.botInstance.on("message", (msg) => {
        const chatId = msg.chat.id;
        if (!this.botInfo.chatIds.includes(chatId.toString())) {
          this.sendMessage(
            chatId,
            "You can not use this bot, your chat ID is: " + chatId
          );
          return;
        }

        if (ActionStates.CurrentAction.getState() === ActionType.Create) {
          processCreateSteps(chatId.toString(), msg.text);
        } else if (
          ActionStates.CurrentAction.getState() === ActionType.Delete
        ) {
          processDeleteSteps(chatId.toString(), msg.text);
        } else if (ActionStates.CurrentAction.getState() === ActionType.List) {
          processListSteps(chatId.toString(), msg.text);
        }

        if (msg.entities && msg.entities[0].type === "bot_command") {
          const cmd = msg.text;
          if (cmd) {
            executeCommand(cmd.replace("/", ""), chatId.toString());
          }
        }
      });

      this.botInstance.on("callback_query", (query) => {
        if (query.message) {
          const chatId = query.message.chat.id;

          if (ActionStates.CurrentAction.getState() === ActionType.Create) {
            processCreateSteps(chatId.toString(), query.data);
          } else if (
            ActionStates.CurrentAction.getState() === ActionType.Delete
          ) {
            processDeleteSteps(chatId.toString(), query.data);
          } else if (
            ActionStates.CurrentAction.getState() === ActionType.List
          ) {
            processListSteps(chatId.toString(), query.data);
          }
        }
      });
    } else {
      throw "TelegramBotHelper: Telegram bot is not initialized";
    }
  }
}
