const commands: {
  name: string;
  handler: (chatId: string) => void;
}[] = [];

const addCommand = (name: string, handler: (chatId: string) => void) => {
  commands.push({
    name,
    handler,
  });
};

const removeCommand = (name: string) => {
  commands.filter((cmd) => cmd.name !== name);
};

const executeCommand = (name: string, chatId: string) => {
  commands.forEach((cmd) => {
    if (cmd.name === name) {
      cmd.handler(chatId);
    }
  });
};

export { addCommand, commands, removeCommand, executeCommand };
