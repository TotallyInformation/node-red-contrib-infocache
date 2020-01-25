## Recognised Input Message Structures

The InfoCache nodes can be controlled by specific input messages as shown here. InfoCache is designed to work alongside [uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder)  as well as working independently.

You can let a [uibuilder](https://github.com/TotallyInformation/node-red-contrib-uibuilder) node send all of it's control messages (port #2) to InfoCache, everything not listed here will be ignored. uibuilder control messages have a property "uibuilderCtrl". Any message recieved with that property will not be cached.

Any input message with a "cache-control" property will not be cached.

### Replay cached messages

To replay the cache, you can use either of the following message formats

This first format will replay the master cache and assumes that the output will go to all connected clients.
```json
{
    "cache-control": "REPLAY",
}
```

Or, if you want to send the cache to a specific client
```json
{
    "cache-control": "REPLAY",
    "_socketId": "<Socket.IO client id>",
}
```
Note that the "_socketId" property can be set to an alternative client identifier property in the settings.

### Clear the Cache
To clear the cache either totally or just for a specific client id.

Reset the master cache, also resets all client-specific caches:
```json
{
    "cache-control": "CLEAR"
}
```

To reset the cache for a specific client:
```json
{
    "cache-control": "CLEAR",
    "_socketId": "<Socket.IO client id>"
}
```
Note that "_socketId" can be set to an alternative client identifier property in the settings.