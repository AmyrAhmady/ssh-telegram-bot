import "dotenv/config";
import TelegramBotHelper from "./services/telegram";
import "./commands/handlers";

let token = "";
let ids: string[] = [];

if (process.env.TELEGRAM_BOT_TOKEN) {
  token = process.env.TELEGRAM_BOT_TOKEN;
}

if (process.env.TELEGRAM_ADMIN_CHAT_ID) {
  const hasMultipleIds = process.env.TELEGRAM_ADMIN_CHAT_ID.includes("|");
  if (hasMultipleIds) {
    ids = process.env.TELEGRAM_ADMIN_CHAT_ID.split("|");
  } else {
    ids = [process.env.TELEGRAM_ADMIN_CHAT_ID];
  }
}

TelegramBotHelper.initialize(token, ids);
TelegramBotHelper.setActions([
  ["create", "Create User"],
  ["delete", "Delete User"],
  ["list", "Get a list of users"],
]);
