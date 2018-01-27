module.exports = {
  findJoinedServerTime (user) {
    return new Promise((resolve, reject) => {
      console.log('------------------------');
      // console.log(Object.keys(user));
      console.log(Object.keys(user.lastMessage.channel.guild.createdAt));

      console.log('------------------------');
      resolve({
        message: 'TODO: joined server time not yet implemented'
      })
    })
  },
  findPreviouslyOnlineTime (user) {
    return new Promise((resolve, reject) => {
      resolve({
        message: 'TODO: previously online time not yet implemented'
      })
    })
  },
  findTimeSinceLoggedIn (user) {
    return new Promise((resolve, reject) => {
      resolve({
        message: 'TODO: time since logged in not yet implemented'
      })
    })
  },
  findLastVoiceTime (user) {
    return new Promise((resolve, reject) => {
      resolve({
        message: 'TODO: last voice time not yet implemented'
      })
    })
  },
  findLastMessageTime (user) {
    return new Promise((resolve, reject) => {
      resolve({
        message: 'TODO: last text message time not yet implemented'
      })
    })
  }
}
