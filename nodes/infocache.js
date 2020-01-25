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

        /** Access the node's context object, flow's context and global context
         * Use get() or set() functions as with a function node
         */
        const nodeContext = node.context()
        //const flowContext = node.context().flow
        //const globalContext = node.context().global
        //console.log('[infocache:nodeGo] context: ', {nodeContext, flowContext, globalContext})

        var msgsRcvd = 0

        // console.log('[infocache:nodeGo] ', {'this': node, 'config': config})

        //#region ----- Create local copies of the node configuration (as defined in the .html file) ----- //
        // NB: node.id and node.type are also available
        node.name          = config.name  || ''
        node.topic         = config.topic || ''
        //#endregion ----- Local node config copy ----- //

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

            /** THINK
             * By topic? By user (_socketId or _auth.id)?
             * Limits?
             * Need more than just a complete cache-clear command?
             */
            /** DO
             * Get available RED.settings.contextStorage keys & whether their .module != 'memory'
             */

            let _infocache = nodeContext.get('_infocache') || []
            _infocache.push(msg.payload)
            nodeContext.set('_infocache', _infocache)

            console.log('[infocache:nodeInputHandler] context: ', {nodeContext:node.context()})

            send(msg)

        } // -- end of msg received processing -- //

        // Process inbound messages
        node.on('input', nodeInputHandler)

        // Do something when Node-RED is closing down
        // which includes when this node instance is redeployed
        node.on('close', function(removed,done) {
            log.trace(`[infocache:nodeGo:onClose] ${removed?'Node Removed':'Node (re)deployed'}`)

            node.removeListener('input', nodeInputHandler)

            done()
        })

    } // ---- End of nodeGo (initialised node instance) ---- //

    /** Register the node by name. This must be called before overriding any of the
     *  Node functions.
     * @see https://nodered.org/docs/creating-nodes/node-js#exposing-settings-to-the-editor
     * 3rd param is settings to expose to Editor
     */
    RED.nodes.registerType(moduleName, nodeGo)

} // ==== End of module.exports ==== // 

// EOF
