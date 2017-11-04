# node-red-contrib-infocache
Cache &amp; replay messages. Optionally by topic and client id

## Contents
<!-- TOC -->

- [node-red-contrib-infocache](#node-red-contrib-infocache)
    - [Contents](#contents)
    - [Additional Documentation](#additional-documentation)
    - [Introduction](#introduction)
    - [Features](#features)
    - [Known Issues](#known-issues)
    - [To Do](#to-do)
    - [Changes](#changes)
    - [Dependencies](#dependencies)
    - [Install](#install)
    - [Node Instance Settings](#node-instance-settings)
        - [Future settings](#future-settings)
    - [Recognised Input msg Structures](#recognised-input-msg-structures)
        - [Replay](#replay)
            - [Topic = REPLAY](#topic--replay)
            - [uibuilder "ready for content" control msg](#uibuilder-ready-for-content-control-msg)
        - [Reset](#reset)
            - [Topic = RESET](#topic--reset)
            - [uibuilder "reset cache" control msg](#uibuilder-reset-cache-control-msg)
    - [Examples](#examples)
    - [Discussions and suggestions](#discussions-and-suggestions)
    - [Contributing](#contributing)
    - [Developers/Contributors](#developerscontributors)

<!-- /TOC -->

## Additional Documentation

There may be a little more information available in the [WIKI](https://github.com/TotallyInformation/node-red-contrib-infocache/wiki).

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) `#f03c15`

## Introduction

This is a node for Node-RED. It is designed to provide a temporary cache of input messages so that they can be replayed on request.

The primary purpose of the node is as a companion to [node-red-contrib-uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder) which provides an easy web app builder for Node-RED. While uibuilder provides a dynamic communications channel between the Node-RED server and each connected client browser, when a client connects (or the user reloads the page), any dynamic data is lost and the client has to wait for future messages to arrive. This node allows that issue to be resolved. uibuilder sends control messages when clients connect, disconnect and when they are ready to receive data. These messages come from port 2 on the uibuilder node and you can feed that port directly into an InfoCache node. By default, the "ready for content" uibuilder control message will trigger the InfoCache node to send the contents of the cache for that client only.

There are a number of settings that you can apply that will control how much data is cached and how/when it is cleared. You may need to use some or all of these if you are passing a large number of messages/topics through the cache. **No hard limits are applied** other than those settings and it is perfectly possible to **crash Node-RED** by filling up the memory if you overdo the cache.

_[back to top](#contents)_

## Features

- Cache by topic
- Cache maximum number of messages (optionally by topic)
- Cache messages for a maximum time (in seconds)
- Replay for all or just one "client"
- Identify clients by a specified message property (defaults to "_socketId" to work with uibuilder)
- Replay via control messages
- Reset after replay if desired
- Manual reset via control messages
- Simply send all uibuilder control messages, no further flow logic required

_[back to top](#contents)_

## Known Issues


_[back to top](#contents)_

## To Do

The backlog of ideas and enhancements is in the [To Do file](TODO.md)

_[back to top](#contents)_

## Changes

See the [Change Log](CHANGELOG.md) for details of changes made.

_[back to top](#contents)_

## Dependencies

See the package.json file.

## Install

Run the following command in your Node-RED user directory (typically `~/.node-red`):

```
npm install node-red-contrib-infocache
```

Run/restart Node-RED and add an instance of the InfoCache node.

_[back to top](#contents)_

## Node Instance Settings

Each instance of the InfoCache node has the following settings available.

**Note** that no caching strategy can cover every requirement. If you need to handle different cache strategies, use multiple instances of this node.

**`name` (string, optional)**

Only used in the Node-RED admin UI.

**`Retention Time` (number, optional)**

If not empty, cached messages will only be retained for the number of _seconds_ input. This overrides the # messages to retain so if the number limit hasn't been reached but the time has, messages will be removed anyway.

**`# Messages to retain` (number, optional)**

The number of messages that will be retained (by topic if "Retain by Topic" is true). The oldest msg will be dropped when a new msg arrives once the limit is reached. The default is null which means that **all** msgs will be retained and it is up to you to trim the size using the reset control messages.

**WARNING**: If you let the cache get too large, it **will** crash Node-RED.

**`Retain by Topic?` (boolean)**

If `true`, topics will be retained by topic. Specifically the number of msgs to retain will be by topic.

**`Reset After Replay?` (boolean, optional=false)**

Defaults to `false`. If `true`, the cache will be emptied after a replay event. _Note_ that this is only likely to be useful if you don't need to handle multiple clients. It saves having to have logic to send a reset control message if you always want to clear the cache after a replay.

**`Client Id` (string, optional='_socketId')**

If not specified, will default to the "_socketId" property on input control msgs. When an input control msg is received, if it has the specified property, cache operations will be for that client id only. The default is designed to work closely with [uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder) which uses Socket.IO for dynamic communications between the server and the client.

### Future settings
These settings are planned for future releases.

**`Storage Engine` (dropdown)**

Allows the selection of the cache storage to be used. Initially only "Memory" will be available. Other pluggable engines may be produced. Please feel free to contribute one.


_[back to top](#contents)_

## Recognised Input msg Structures

The InfoCache nodes can be controlled by specific input msgs as shown here. InfoCache is designed to work alongside [uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder)  as well as working independently.

You can let a [uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder)  node send all of it's control msgs (port #2) to InfoCache, everything not listed here will be ignored.

Any input msg structure not listed here will be treated as normal data and subject to caching as per the settings.

### Replay

To replay the cache, you can use either of the following msg formats

#### Topic = REPLAY

This first format will replay the master cache and assumes that the output will go to all connected clients.
```json
{
    "topic": "REPLAY",
    "reset": false
}
```
The reset property is optional and defaults to `false`. Set it to `true` to empty the cache after the replay.

Or, if you want to send the cache to a specific client
```json
{
    "topic": "REPLAY",
    "_socketId": "<Socket.IO client id>",
    "reset": false
}
```
The reset property is optional and defaults to `false`. Set it to `true` to empty the cache _only for the specific client_ after the replay.

Note that "_socketId" can be set to an alternative client identifier property in the settings.

#### uibuilder "ready for content" control msg
Use these formats of msgs when using InfoCache with [uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder) to ensure that newly connected or reloaded client apps get the cache of data delivered to them.

Deliver to all connected clients (probably not what you want unless you only ever have a single client connected):
```json
{
    "type": "ready for content",
    "reset": false
}
```
Or, if you want to send the cache to a specific client (the most likely case):
```json
{
    "type": "ready for content",
    "_socketId": "<Socket.IO client id>",
    "reset": false
}
```

### Reset
While the replay control messages also take a reset flag, you can send a reset control message instead so that you can have full control over the reset process. Don't forget that the node iteslf may also auto-reset depending on the settings.

#### Topic = RESET
Reset the master cache, also resets all client-specific caches:
```json
{
    "topic": "RESET"
}
```

To reset the cache for a specific client:
```json
{
    "topic": "RESET",
    "_socketId": "<Socket.IO client id>"
}
```
Note that "_socketId" can be set to an alternative client identifier property in the settings.

#### uibuilder "reset cache" control msg
Use these formats of msgs when using InfoCache with [uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder) to ensure that newly connected or reloaded client apps get the cache of data delivered to them.

Deliver to all connected clients (probably not what you want unless you only ever have a single client connected):
```json
{
    "type": "reset cache"
}
```
Or, if you want to reset the cache for a specific client (the most likely case):
```json
{
    "type": "reset cache",
    "_socketId": "<Socket.IO client id>"
}
```

_[back to top](#contents)_

## Examples

See the [WIKI](https://github.com/TotallyInformation/node-red-contrib-infocache/wiki) for examples of use. Some additional examples may also appear in the [uibuilder WIKI](https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki).

_[back to top](#contents)_

## Discussions and suggestions

Use the [Node-RED google group](https://groups.google.com/forum/#!forum/node-red) for general discussion about this node. Or use the
[GitHub issues log](https://github.com/TotallyInformation/node-red-contrib-uibuilder/issues) for raising issues or contributing suggestions and enhancements.

## Contributing

If you would like to contribute to this node, you can contact [Totally Information via GitHub](https://github.com/TotallyInformation) or raise a request in the [GitHub issues log](https://github.com/TotallyInformation/node-red-contrib-infocache/issues).

If submitting code (preferably via a pull request), please use eslint to adhere to the same standards.

When contributing code, please use the following coding standards:
- Use ESLint:Standard settings plus the following
- Indents must be 4 spaces
- Strings must be single quoted not double
- Semi-colons should not be used unless absolutely necessary (see [here](https://mislav.net/2010/05/semicolons/) for guide)

## Developers/Contributors

- [Julian Knight](https://github.com/TotallyInformation)1
- [Colin Law](https://github.com/colinl) - many thanks for testing, corrections and pull requests.
- [Steve Rickus](https://github.com/shrickus) - many thanks for testing, corrections and contributed code.


<a href="https://stackexchange.com/users/1375993/julian-knight"><img src="https://stackexchange.com/users/flair/1375993.png" width="208" height="58" alt="profile for Julian Knight on Stack Exchange, a network of free, community-driven Q&amp;A sites" title="profile for Julian Knight on Stack Exchange, a network of free, community-driven Q&amp;A sites" /></a>


_[back to top](#contents)_
