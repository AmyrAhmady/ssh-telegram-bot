import fs from "fs";

interface UserLimitInfo {
  name: string;
  maxConnections: number;
}

const userLimits: UserLimitInfo[] = [];
const LIMIT_CONF_FILE_PATH = "/etc/security/limits.conf";

const writeToConfig = () => {
  const fileBuffer = fs.readFileSync(LIMIT_CONF_FILE_PATH);
  let fileContent = fileBuffer.toString();

  const regex =
    /#---START-THIS-SECTION-IS-FOR-SSH-TG-BOT---\n([\S\s]*)\n#---END-THIS-SECTION-IS-FOR-SSH-TG-BOT---/gm;
  fileContent = fileContent.replace(regex, "");

  fileContent += "#---START-THIS-SECTION-IS-FOR-SSH-TG-BOT---\n";

  fileContent += userLimits
    .map((user) => {
      return `${user.name} hard maxlogins ${user.maxConnections}`;
    })
    .join("\n");

  fileContent += "\n#---END-THIS-SECTION-IS-FOR-SSH-TG-BOT---";

  fs.writeFileSync(LIMIT_CONF_FILE_PATH, fileContent);
};

const readFromConfig = () => {
  const fileBuffer = fs.readFileSync(LIMIT_CONF_FILE_PATH);
  const fileContent = fileBuffer.toString();

  const regex =
    /#---START-THIS-SECTION-IS-FOR-SSH-TG-BOT---\n([\S\s]*)\n#---END-THIS-SECTION-IS-FOR-SSH-TG-BOT---/gm;

  const m = regex.exec(fileContent);

  userLimits.splice(0, userLimits.length);
  if (m && m[1]) {
    const lines = m[1];
    lines.split("\n").forEach((line) => {
      const data = line.split(" ");
      userLimits.push({
        name: data[0],
        maxConnections: parseInt(data[3]),
      });
    });
  }
};

export namespace LimitConf {
  export const setUser = (name: string, maxConnections: number) => {
    const findIndex = userLimits.findIndex((user) => user.name === name);
    if (findIndex !== -1) {
      userLimits[findIndex].maxConnections = maxConnections;
    } else {
      userLimits.push({
        name,
        maxConnections,
      });
    }

    writeToConfig();
    readFromConfig();
  };

  export const removeUser = (name: string) => {
    const findIndex = userLimits.findIndex((user) => user.name === name);
    if (findIndex !== -1) {
      userLimits.splice(findIndex, 1);
    }

    writeToConfig();
    readFromConfig();
  };

  export const getUserLimit = (name: string) => {
    const user = userLimits.find((user) => user.name === name);
    return user;
  };
}
