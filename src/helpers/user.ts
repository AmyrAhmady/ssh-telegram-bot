import LinuxUser, { UserExpirationInfo, UserInfo } from "linux-sys-user";
import { LimitConf } from "./limitConf";

export const createUser = (
  name: string,
  expireDate: Date,
  maxConnections: number
) => {
  return new Promise<UserInfo>((resolve, reject) => {
    LinuxUser.addUser(
      {
        username: name,
        expiredate: expireDate,
        create_home: true,
      },
      (error, user) => {
        if (error) {
          if (typeof error === "string") {
            reject(new Error(error));
          } else {
            reject(error);
          }
        } else {
          if (user) {
            LimitConf.setUser(name, maxConnections);
            resolve(user);
          } else {
            reject(new Error("User info is not available"));
          }
        }
      }
    );
  });
};

export const deleteUser = (name: string) => {
  return new Promise<boolean>((resolve, reject) => {
    LinuxUser.removeUser(name, (error) => {
      if (error) {
        if (typeof error === "string") {
          reject(new Error(error));
        } else {
          reject(error);
        }
      } else {
        resolve(true);
      }
    });
  });
};

export const getUsers = () => {
  return new Promise<UserInfo[]>((resolve, reject) => {
    LinuxUser.getUsers((error, users) => {
      if (error) {
        if (typeof error === "string") {
          reject(new Error(error));
        } else {
          reject(error);
        }
      } else {
        if (users) {
          resolve(users);
        } else {
          reject(new Error("User info is not available"));
        }
      }
    });
  });
};

export const getUserExpirationInfo = (name: string) => {
  return new Promise<UserExpirationInfo>((resolve, reject) => {
    LinuxUser.getExpiration(name, (error, info) => {
      if (error) {
        if (typeof error === "string") {
          reject(new Error(error));
        } else {
          reject(error);
        }
      } else {
        if (info) {
          resolve(info);
        } else {
          reject(new Error("User info is not available"));
        }
      }
    });
  });
};
