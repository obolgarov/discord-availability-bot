let Discord = require('discord.js');
let mh = require('discord-message-handler');
let processor = require('./processor.js');

let client = new Discord.Client();

let token = 'MzY4MjAzMDk2NTgyNzgyOTc3.DMGjXw.kcEHKUXYm0IdIuPWcJE1Wc-010Q'

processor.setClient(client);

// console.log(messageHandler);
mh.onCommand("WHOUP")
.do((args, rawArgs, message) => {
  // console.log(args);
  if (args.length === 0) {
    processor.sendHelp(message);
  } else if (args.length === 1) {
    processor.processUser({
      userId: args[0],
      message: message
    });
  } else if (args.length === 2) {
    processor.processUser({
      userId: args[0],
      message: message,
      option: args[1]
    });
  } else {
    // too much args, pretend there are 2, but disclose ignoring the rest
    processor.processUser({
      userId: args[0],
      message: message,
      option: args[1]
    });
  }
})

mh.setCaseSensitive(true);


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
  console.log(msg.content);
  mh.handleMessage(msg);
});

client.login(token);

console.log('running...');
