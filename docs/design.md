---
title: InfoCache Design Notes
description: >
    Documents the design and thinking behind infocache along with ideas for the future.
---

[[toc]]

## Main Requirements

- Use Node-RED's native Context Storage feature
- Integrate with uibuilder's cache control messages
- Control (clear or replay) the cache using a control input message
- Control the cache by topic or client/user id
- Control the overall size of the cache by restricting the maximum number of messages (by topic/client/user)
- Allow replay of a specific position in the cache
- Multi-instance - use as many infocash nodes as memory allows, uses node context so all data is isolated.
- Identify clients by a specified message property (defaults to "_socketId" to work with uibuilder)
- Take any uibuilder control message. Only respond to cache control messages. No further flow logic required.
- uibuilder control messages will not be cached.
- Slight delay (250ms) on replay along with a deduplication of requests (debounce)
  to handle the fact that front-ends need to send a trigger on window.load AND on socket connected.
- Allow reverse replay. Default is first-in-first out (FIFO) but should be able to replay as LIFO (last in, first out).
- Allow replay of first, last or specific index position only.
- Update status on new entry, visual warning if nearly full or full.

## Caveats

- Replayed messages are NOT exact copies of the original message. Only key data is saved in the cache. The msg.payload and topic/_socketId/user-id (as needed).
  - Maybe other properties can be saved in the future but this is complex if we want to avoid costly cloning.

## Options Needed

- Cache Data by:
   -  any message (no categorisation, flat record of input messages)
   -  topic (a queue of input messages per topic)
   -  user (a queue of input messages per client or user id)
   -  both topic and user

- Number of entries

## Control Message Details

These come from the design of uibuilder but can be used by any node or created yourself.

### "Global" Control

Controls the whole cache.

- Cache Replay

   Example msg (example from a client reloading the page):

   ```json
   {
       "uibuilderCtrl": "ready for content",
       "cacheControl": "REPLAY",
       "from": "client",
       "_socketId": "/nr/uib#Bxtu968meXIZhcpSAAAH",
       "_uibAuth": {},
       "topic": "uib1Topic",
       "_msgid": "70d3a693.1b7348"
   }
   ```

- Cache Clear

### Topic Control

Controls a single topic in the cache.

### Client or User Control

Controls the cache for a single client or user

## Other ideas

- Record timestamp with msg?
- Allow replay in reverse order?
- Button to manually clear the cache (possibly several buttons to clear the full cache or a topic/client/user)?
- Option to auto-clear if store or variable name is changed?
- Maybe add cache-control:NEW to allow sending only of cached messages since the last cache-control:REPLAY or NEW.
- Allow the replay delay time to be changed in the admin ui
- Cache messages for a maximum time (in seconds)
- Reset after replay if desired
