/**
 * Copyright (c) 2020 Julian Knight (Totally Information)
 * https://it.knightnet.org.uk
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
'use strict'

/** Dummy logging 
 * @type {Object.<string, function>} */
var dummyLog = {
    fatal: function(){}, // fatal - only those errors which make the application unusable should be recorded
    error: function(){}, // error - record errors which are deemed fatal for a particular request + fatal errors
    warn: function(){},  // warn - record problems which are non fatal + errors + fatal errors
    info: function(){},  // info - record information about the general running of the application + warn + error + fatal errors
    debug: function(){}, // debug - record information which is more verbose than info + info + warn + error + fatal errors
    trace: function(){}, // trace - record very detailed logging + debug + info + warn + error + fatal errors
}
var log = dummyLog // reset to RED.log or anything else you fancy at any point

const moduleName = 'infocache' 

/** Export the function that defines the node */
module.exports = function(RED) {
    // NB: entries in settings.js are read-only and shouldn't be read using RED.settings.get, that is only for settings that can change in-flight.
    //     see Node-RED issue #1543.

    // console.log('[infocache:module] RED: ', Object.keys(RED))
    //console.log('[infocache:module] RED.nodes: ', RED.nodes.eachNode.toString())

    /*     RED.events.on('nodes-started',function() {
            console.log('[infocache:module] ****** All nodes have started ******')
        })
        RED.events.on('nodes-stopped',function() {
            console.log('[infocache:module] ****** All nodes have stopped ******')
        }) */
    
    //#region ----- Constants (& logging) for standard setup ----- //

    /** Folder containing settings.js, installed nodes, etc. @constant {string} userDir */
    //userDir = RED.settings.userDir
    
    /** Root URL path for http-in/out and uibuilder nodes @constant {string} httpNodeRoot */
    //const httpNodeRoot = RED.settings.httpNodeRoot

    //#region ----- back-end debugging ----- //
    log = RED.log
    log.trace('[infocache:Module] ----------------- module started -----------------')
    //#endregion ----- back-end debugging ----- //

    //const app = RED.httpNode // || RED.httpAdmin

    //#endregion -------- Constants -------- //

    /** Run the node instance - called from registerType()
     * @param {Object} config The configuration object passed from the Admin interface (see the matching HTML file)
     */
    function nodeGo(config) {
        // Create the node
        RED.nodes.createNode(this, config)

        /** A copy of 'this' object in case we need it in context of callbacks of other functions. @constant {Object} node */
        const node = this
        log.trace('[infocache:nodeGo] = Keys: this, config =', {'this': Object.keys(node), 'config': Object.keys(config)})

        //#region -------- copy node instance config to `this` -------- //
        // NB: node.id and node.type are also available
        node.name         = config.name  || ''
        
        /** Name of the NR context storage to use (see settings.js) @type {string} */
        node.contextName = config.contextName || 'default' // default or file
        /** How many cache entries to retain? @type {number} */
        node.maxEntries = config.maxEntries || 10
        /** Validate maxEntries >0 && <=100000  */
        if ( node.maxEntries<1 || node.maxEntries>100000 ) {
            log.error(`[infocache] ${node.id} maxEntries configuration invalid: ${node.maxEntries}. Must be between 1 and 100,000`)
        }

        // console.log('[infocache:nodeGo] ', {'this': node, 'config': config})
        //#endregion -------- End of copy node config to `this` -------- //

        //#region -------- Local constants and vars -------- //

        /** Name of the node context variable to use @type {string} */
        node.cacheVarName = config.cacheVarName || '_infocache'
        /** Define the structure of an empty cache @type {Object|Array} */
        node.emptyCache = []
        /** How big is the cache? @type {number} */
        node.cacheSize = 0
        /** How many msgs processed? */
        node.msgsRcvd = 0

        /** Access the node's context object, flow's context and global context
         * Use get() or set() functions as with a function node
         */
        const nodeContext = node.context()
        /** Get the cache - only once on startup or node instance deployment - will update memory version 
         * If someone deletes the node context variable, it will be recreated on next set()
         */
        var _infocache = nodeContext.get(node.cacheVarName, node.contextName) || node.emptyCache
        node.cacheSize = _infocache.length

        // console.log('[infocache:nodeGo] ', {'this': node, 'config': config})
        //#endregion -------- End of Local constants and vars -------- //

        // Set initial status
        node.status({ 
            fill: (node.cacheSize === 0 ? 'grey' : 'blue'), 
            shape: 'ring', 
            text:`Cached: ${node.cacheSize}, Rcvd: ${node.msgsRcvd}`
        })



        /** Handler function for node input events (when a node instance receives a msg)
         * @see https://nodered.org/blog/2019/09/20/node-done 
         * @param {Object} msg The msg object received.
         * @param {function} send Per msg send function, node-red v1+
         * @param {function} done Per msg finish function, node-red v1+
         **/
        function nodeInputHandler(msg, send, done) {

            // If this is pre-1.0, 'send' will be undefined, so fallback to node.send
            send = send || function() { node.send.apply(node,arguments) }
            // If this is pre-1.0, 'done' will be undefined, so fallback to dummy function
            done = done || function() { if (arguments.length>0) node.error.apply(node,arguments) }

            /** DO
             * Get available RED.settings.contextStorage keys & whether their .module != 'memory'
             */

            //console.log('[infocache:nodeInputHandler] context: ', {nodeContext:node.context()})

            // Handle cache control messages
            if ( Object.prototype.hasOwnProperty.call(msg, 'cacheControl') ) {

                switch (msg.cacheControl) {
                    // Replay everything
                    case 'REPLAY': {
                        for (let key in _infocache) { // works on both array and object
                            // Get msg from cache
                            let msgOut = _infocache[key]
                            // Add auth data from incoming control msg
                            msgOut._auth = msg._auth
                            msgOut._uibAuth = msg._uibAuth
                            // Let the client know this is from cache
                            msgOut._from = 'cache'
                            // If control msg comes from a specific client, send cache only to that
                            if ( Object.prototype.hasOwnProperty.call(msg, '_socketId') ) {
                                msgOut._socketId = msg._socketId
                            }
                            // Send the cached msg
                            send(msgOut)
                        }
                        break
                    }
                    // Clear the whole cache (no msg sent)
                    case 'CLEAR': {
                        _infocache = node.emptyCache
                        nodeContext.set(node.cacheVarName, _infocache, node.contextName)
                        node.cacheSize = 0
                        //TODO add confirming uibuilderCtrl msg (optional?)
                        break
                    }
                    //TODO Add other control msgs to replay/clear parts of the cache
                    default: {
                        break
                    }
                }
            
            } else {
                // Handle non-cache-control msgs

                // ignore other uibuilder control messages but ... 
                if ( ! Object.prototype.hasOwnProperty.call(msg, 'uibuilderCtrl') ) {
                    // How many msgs processed?
                    node.msgsRcvd++

                    // send other messages onward
                    send(msg)

                    // clone the msg
                    let clonedMsg = RED.util.cloneMessage(msg)
                    /** Remove original req, res, _socketId, _auth, _uibAuth, _msgid 
                     * req and res are deep and recursive - can't be serialised
                     * _socketId is ephemeral (changes on browser reload or lost ws connection) - will be added from the incoming control msg if a REPLAY is requested
                     * _auth/_uibAuth may contain sensitive data - they will be added from the incoming control msg if a REPLAY is requested
                     */
                    delete clonedMsg._msgid
                    delete clonedMsg.req
                    delete clonedMsg.res
                    delete clonedMsg._socketId
                    delete clonedMsg._auth
                    delete clonedMsg._uibAuth
                    // Remove empty topic (inject node sends empty string if no topic provided)
                    if ( clonedMsg.topic === '' ) delete clonedMsg.topic

                    // Add timestamp (ms since 1970) for future reference and filtering - floor /1000 to get seconds
                    clonedMsg._cacheTime = Date.now()

                    // and save the msg in the cache - if _infocache is array push or if object use key
                    if ( Array.isArray(_infocache) ) {
                        // if cache is at max length, remove 1st entry first
                        if ( node.cacheSize >= node.maxEntries ) {
                            _infocache.shift()
                        }

                        _infocache.push(clonedMsg)
                        node.cacheSize = _infocache.length
                    }
                    //} else {
                    //    // Keep the last msg.payload by topic
                    //    _infocache[msg.topic].push(msg.payload)
                    //}

                    // save context for next time
                    nodeContext.set(node.cacheVarName, _infocache)

                }

            }

            // Show number of cached msgs in status
            node.status({
                fill: (node.cacheSize >= node.maxEntries ? 'red' : (node.cacheSize >= node.maxEntries-2 ? 'yellow' : 'green') ),
                shape: (node.cacheSize >= node.maxEntries ? 'dot' : 'ring'),
                text:`Cached: ${node.cacheSize}, Rcvd: ${node.msgsRcvd}`
            })

            // We are finished processing this message
            done()

        } // -- end of msg received processing -- //

        // Process inbound messages
        node.on('input', nodeInputHandler)

        // Do something when Node-RED is closing down
        // which includes when this node instance is redeployed
        node.on('close', function(removed,done) {
            log.trace(`[infocache:nodeGo:onClose] ${removed?'Node Removed':'Node (re)deployed'}`)
            console.log(`[infocache:nodeGo:onClose] CLOSE ${node.cacheSize} ${node.msgsRcvd} ${_infocache.length}`)

            node.removeListener('input', nodeInputHandler)

            done()
        })

    } // ---- End of nodeGo (initialised node instance) ---- //

    /** Register the node by name. This must be called before overriding any of the
     *  Node functions.
     * @see https://nodered.org/docs/creating-nodes/node-js#exposing-settings-to-the-editor
     * 3rd param is settings to expose to Editor
     */
    RED.nodes.registerType(moduleName, nodeGo, {
        'settings': {
            'infocacheContextStorage': { 'value': RED.settings.contextStorage, 'exportable': true },
        },
    })

} // ==== End of module.exports ==== // 

// EOF
