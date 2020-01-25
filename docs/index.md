# node-red-contrib-infocache
Cache &amp; replay messages. Optionally by topic and client or user id. Replay the cache or a part of it on request.

## Introduction

This is a node for Node-RED. It is designed to provide a temporary cache of input messages so that they can be replayed on request.

It can be used in any flow but it is also designed as a companion to [node-red-contrib-uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder) which provides an easy web app builder for Node-RED. While uibuilder provides a dynamic communications channel between the Node-RED server and each connected client browser, when a client connects (or the user reloads the page), any dynamic data is lost and the client has to wait for future messages to arrive. This node allows that issue to be resolved. uibuilder sends control messages when clients connect, disconnect and when they are ready to receive data. These messages come from port 2 on the uibuilder node and you can feed that port directly into an InfoCache node. By default, the "ready for content" uibuilder control message will trigger the InfoCache node to send the contents of the cache for that client only.

There are a number of settings that you can apply that will control how much data is cached and how/when it is cleared. You may need to use some or all of these if you are passing a large number of messages/topics through the cache. **No hard limits are applied** other than those settings and it is perfectly possible to **crash Node-RED** by filling up the memory if you overdo the cache.

## Contents

[[toc]]

## Additional Documentation

Please see the sections listed in the sidebar.

There may also be a little more information available in the [WIKI](https://github.com/TotallyInformation/node-red-contrib-infocache/wiki).

## Implemented Features

Urm, not a lot so far!

## Future Features

Please see the [design](./design.md) document.


## Known Issues

None at this time

## To Do

The backlog of ideas and enhancements is in the [To Do file](./TODO.md)

## Changes

See the [Change Log](./CHANGELOG.md) for details of changes made.

## Dependencies

See the [package.json](./package.json) file.

## Install

Install via the palette manage in the Node-RED admin ui (no restart needed). 

Alternatively run the following command in your Node-RED user directory (typically `~/.node-red`):

```
npm install node-red-contrib-infocache
```

then restart Node-RED and add an instance of the InfoCache node.

You can install a specific published version with (change `latest` to desired version):

```
npm install node-red-contrib-infocache@latest
```

You can also install a specific unpublished branch from GitHub with (change `security` to desired branch):

```
npm install node-red-contrib-infocache@security
```

You can also install a specific unpublished tag (version) from GitHub with (change `v0.0.1` to desired release tag):

```
npm install node-red-contrib-infocache@v0.0.1
```

## Node Configuration

See the [node configuration](./node-configuration.md) document.

## Recognised Input Message Structures

See the [input messages](./input-messages.md) document.

## Examples

See the [library examples](../examples) for examples of use, these are flows that can be imported in Node-RED. 

Some additional examples may also appear in the [WIKI](https://github.com/TotallyInformation/node-red-contrib-infocache/wiki) or the [uibuilder WIKI](https://github.com/TotallyInformation/node-red-contrib-uibuilder/wiki).

## Discussions and suggestions

Please use the [Node-RED Discourse Forum](https://discourse.nodered.org/) for general discussion about this node. 

Alternatively use the [GitHub issues log](https://github.com/TotallyInformation/node-red-contrib-uibuilder/issues) for raising issues or contributing suggestions and enhancements.

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

<a href="https://stackexchange.com/users/1375993/julian-knight"><img src="https://stackexchange.com/users/flair/1375993.png" width="208" height="58" alt="profile for Julian Knight on Stack Exchange, a network of free, community-driven Q&amp;A sites" title="profile for Julian Knight on Stack Exchange, a network of free, community-driven Q&amp;A sites" /></a>


_[back to top](#contents)_
