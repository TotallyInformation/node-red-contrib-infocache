---
title: To Do
---

NOTE: This document is outdated and needs to be reworked.

# Completed
See the [Change Log](CHANGELOG.md) for details of what has been completed

# In progress
Being worked on now. May already be partially implemented but have further work to do.

- Cache inbound messages by topic
- Replay for all or just one "client"
- Identify clients by a specified message property (defaults to "_socketId" to work with uibuilder)
- Replay via control messages
- Simply send all uibuilder control messages, no further flow logic required.
  uibuilder control messages will not be cached.
- Manual cache clear via control messages
- Cache maximum number of messages by topic
- Add slight delay on replay along with a deduplication of requests
  to handle the fact that front-ends need to send a trigger on window.load AND on socket connected.

# Next
This is what needs working on next.

- Allow the replay delay time to be changed in the admin ui
- Cache messages for a maximum time (in seconds)
- Reset after replay if desired

# Enhancements
These would be nice to do at some point and would make the node more robust and a easier to use in places.

Please feel free to contribute a pull request if you would like to contribute any of these.

- Add `"cache-control":"NEW"` -
  That would just send new cached messages since the last REPLAY or NEW commands.

# Possibilities for further thought
These are random thoughts that might make it into the To Do list but really need more thought before committing to them.
