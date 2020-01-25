---
Title: InfoCache Design Notes
Description: >
    Documents the design and thinking behind infocache along with ideas for the future.
---

## Main Features

- Uses Node-RED's native Context Storage feature
- Integrates with uibuilder's cache control messages
- Control (clear or replay) the cache using a control input message
- Control the cache by topic or client/user id
- Control the overall size of the cache
- Allows replay of a specific position in the cache
- Multi-instance - use as many infocash nodes as memory allows, uses node context so all data is isolated.
- 

## Options

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
   {"uibuilderCtrl":"ready for content","cacheControl":"REPLAY","from":"client","_socketId":"/nr/uib#Bxtu968meXIZhcpSAAAH","_uibAuth":{},"topic":"uib1Topic","_msgid":"70d3a693.1b7348"}
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