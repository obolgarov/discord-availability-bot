# discord-availability-bot
Discord bot to check user availability

specifications:
- logs time when users have entered discord
- logs time when users have logged in and were active
- logs last time user sent message
- logs last time user was in voice channel

commands:
WHOUP [@username] [-options]

no options:
  - displays date when user entered channel
  - displays date when user previously went online
  - displays time since user previously went online
  
ex:
  $ WHOUP @asdf
  
  @asdf:
  entered server on 00/00/00 00:00:00 UTC
  previously online at 00/00/00 00:00:00 UTC
  time since logged on: 00 days, 00 hours, 00 minutes, 00 seconds


options:
  v
    displays time when user last entered voice
    ex:
      time since joining voice chat VOICECHANNELNAME: 00 days, 00 hours, 00 minutes, 00 seconds
  m
    displays time since user sent message
    ex:
      last message sent in TEXTCHANNELNAME: 00 days, 00 hours, 00 minutes, 00 seconds
  a
    all options

ex:
  $ WHOUP @asdf a

  @asdf:
  entered server...
  previously online...
  time since logged...
  last message sent...
  time since joining voice...
