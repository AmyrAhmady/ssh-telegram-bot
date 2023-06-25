# SSH User Management Telegram Bot
This bot allows you to create or delete (edit functionality will be added in future) your server users which can be accessed over SSH.  
This can be useful for people who want to create SSH users solely for the purpose of tunneling and using it as a VPN.  

### Usage:
1. Clone this repository on your server using git:
```bash
git clone https://github.com/AmyrAhmady/ssh-telegram-bot.git
```
2. Use your desire package manager to install node packages:
```
// if you are using yarn
yarn

// if you are using npm
npm i

// if you are using pnpm
pnpm i
```
3. Edit `.env.example` with the right credentials and info, then rename it to `.env`
4. Run the project with the `start` command:
```
// if you are using yarn
yarn start

// if you are using npm
npm start

// if you are using pnpm
pnpm start
```


### Client Usage:
- Phone  
  You can use your created users in apps like `NapsternetV` on your phone to use it as a VPN (SSH-Direct method).  
  Android link: https://play.google.com/store/apps/details?id=com.napsternetlabs.napsternetv  
  iOS link: https://apps.apple.com/us/app/napsternetv/id1629465476

- PC  
  On your PC, using `-ND port_number` with your ssh connection would host a socks5 server with the specified port, example:
  ```bash
  ssh user@hostname_or_ip -ND 8080
  ```
  This would create a socks5 on your machine, locally, with the specified port of `8080` to be used however you like


### Support:
Nothing, just leave a star if you like 🙂

