let timeFinder = require('./time-finder.js');

module.exports = {
  data: {
    client: null
  },
  setClient (client) {
    this.data.client = client;
  },
  sendHelp (message) {
    message.reply('TODO: help');
  },
  processUser (options) {
    // console.log(options);
    let userPromise = this.parseUserId(options.userId)
    .catch((error) => {
      return this.sendResponse({error: 'invalid user id'}, options.message);
    });

    let basicTimeDataPromise = userPromise.then(this.getBasicTimeData.bind(this));

    let addedTimeDataPromise = Promise.all([
      userPromise,
      basicTimeDataPromise
    ]).then((results) => {
      return this.addOption(options.option, results[0], results[1])
    })

    let replyToUserPromise = Promise.all([
      userPromise,
      addedTimeDataPromise
    ]).then((results) => {
      return this.sendResponse(results[1], options.message, results[0]);
    }).catch((error) => {
      return this.sendResponse({error: error}, options.message);
    })
  },
  parseUserId (userId) {
    return new Promise((resolve, reject) => {
      // check if passed id is already correct
      // console.log(userId);
      this.getUserFromId(userId)
      .then((user) => {
        resolve(user);
      }, (error) => {
        // user id invalid
        // parse user id then try again
        return this.getIdFromMessageId(userId)
        .then((parsedUserId) => {
          // console.log(parsedUserId);
          return this.getUserFromId(parsedUserId);
        })
        .then((user) => {
          return user;
        }, (error) => {
          return this.getIdFromMessageIdAlt(userId)
          .then((parsedUserId) => {
            return this.getUserFromId(parsedUserId);
          }).then((result) => {
            resolve(result);
          }).catch((error) => {
            reject(error);
          })
        });
      }).then(resolve)
      .catch(reject);

    });
  },
  getUserFromId (userId) {
    return new Promise((resolve, reject) => {
      // console.log(userId);
      this.data.client.fetchUser(userId)
      .then((user) => {
        resolve(user);
      }).catch((error) => {
        reject(error);
      });
    })
  },
  getIdFromMessageId (id) {
    // if id obtained from message, it will be <@...>
    // this function removes the first two and last characters
    // as if the id was from a parsed message
    return new Promise((resolve, reject) => {
      resolve(id.substring(2, id.length - 1));
    });
  },
  getIdFromMessageIdAlt (id) {
    return new Promise((resolve, reject) => {
      resolve(id.substring(3, id.length - 1));
    })
  },
  getBasicTimeData (user) {
    // returns an object containing javascript times
    return Promise.all([
      timeFinder.findJoinedServerTime(user),
      timeFinder.findPreviouslyOnlineTime(user),
      timeFinder.findTimeSinceLoggedIn(user)
    ]).then((results) => {
      return {
        enteredServerTime: results[0],
        previouslyOnlineTime: results[1],
        timeSinceLoggedIn: results[2]
      }
    });
  },
  addOption (option, user, messageData) {
    return new Promise((resolve, reject) => {
      if (option) {
        switch (option) {
        case 't':
          timeFinder.findLastMessageTime(user)
          .then((result) => {
            resolve(Object.assign({}, messageData, {
              lastMessageTime: result,
            }))
          })
          break;
        case 'v':
          timeFinder.findLastVoiceTime(user)
          .then((result) => {
            resolve(Object.assign({}, messageData, {
              lastVoiceTime: result
            }))
          })
          break;
        case 'a':
          Promise.all([
            timeFinder.findLastMessageTime(user),
            timeFinder.findLastVoiceTime(user)
          ]).then((results) => {
            resolve(Object.assign({}, messageData, {
              lastMessageTime: results[0],
              lastVoiceTime:  results[1]
            }))
          })
          break;
        default:
          reject('invalid option');
          break;
        }
      } else {
        // no options, return bare messages
        resolve(messageData);
      }
    })
  },
  sendResponse (messages, replyableMessage, user) {
    return new Promise((resolve, reject) => {
      let finalMessage = '';
      // \nUser: @' + user.username + '\n
      if (messages.error) {
        finalMessage = '\n ' + messages.error;
      } else {
        finalMessage += '\nUser: @' + user.username + '\n';
        finalMessage += messages.enteredServerTime.message + '\n';
        finalMessage += messages.previouslyOnlineTime.message + '\n';
        finalMessage += messages.timeSinceLoggedIn.message + '\n';
        if (messages.lastMessageTime) {
          finalMessage += messages.lastMessageTime.message + '\n';
        }
        if (messages.lastVoiceTime) {
          finalMessage += messages.lastVoiceTime.message + '\n';
        }
      }

      replyableMessage.reply(finalMessage);
    });
  }
}
