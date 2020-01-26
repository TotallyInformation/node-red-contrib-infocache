---
title: How to configure the infocache node
---

NOTE: This document is outdated and needs to be reworked.

Each instance of the InfoCache node has the following settings available.

**Note** that no caching strategy can cover every requirement. If you need to handle different cache strategies, use multiple instances of this node.

**`name` (string, optional)**

Only used in the Node-RED admin UI.

**`Client Id` (string, optional='_socketId')**

If not specified, will default to the "_socketId" property on input control messages. When an input control message is received, if it has the specified property, cache operations will be for that client id only. The default is designed to work closely with [uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder) which uses Socket.IO for dynamic communications between the server and the client.

### Future settings
These settings are planned for future releases.

**`Retention Time` (number, optional)**

If not empty, cached messages will only be retained for the number of _seconds_ input. This overrides the # messages to retain so if the number limit hasn't been reached but the time has, messages will be removed anyway.

**`# Messages to retain` (number, optional)**

The number of messages that will be retained (by topic if "Retain by Topic" is true). The oldest message will be dropped when a new message arrives once the limit is reached. The default is null which means that **all** messages will be retained and it is up to you to trim the size using the reset control messages.

**WARNING**: If you let the cache get too large, it **will** crash Node-RED.

**`Reset After Replay?` (boolean, optional=false)**

Defaults to `false`. If `true`, the cache will be emptied after a replay event. _Note_ that this is only likely to be useful if you don't need to handle multiple clients. It saves having to have logic to send a reset control message if you always want to clear the cache after a replay.

**`Storage Engine` (dropdown)**

Allows the selection of the cache storage to be used. Initially only "Memory" will be available. Other pluggable engines may be produced. Please feel free to contribute one.


