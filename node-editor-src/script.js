// Isolate this code
;(function () {
    'use strict'

    //https://nodered.org/docs/creating-nodes/node-html
    /** @typedef {import("node-red").Red} Red */

    //#region --------- "global" variables for the panel --------- //

    /** Module name must match this nodes html file @constant {string} moduleName */
    var moduleName  = 'infocache'
    /** Node's label @constant {string} paletteCategory */
    var nodeLabel  = 'info cache'
    /** Node's palette category @constant {string} paletteCategory */
    var paletteCategory  = 'uibuilder'
    /** Node's background color @constant {string} paletteColor */
    var paletteColor  = '#E6E0F8'
    /** Node's icon image */
    var nodeIcon = 'db.png' //'font-awesome/fa-random'
    /** Default maxEntries value */
    var defMaxEntries = 10
    /** Holder for settings/contextStorage (set by validator) {'<name>': {"module":'<type>'}, ...} @type {Object} */
    var contextStorage = {}
    /** Holder for settings/context/default (set by validator) @type {string|null} */
    var contextDefault = null

    //#endregion ------------------------------------------------- //

    //#region ---------------- Utility Functions ----------------- //
    /** Make sure context storage is known BEFORE editor is available
     * NOTE: This is called BEFORE oneditprepare when 1st loading the Editor
     * RED.settings.context doesn't tell us what module is actually in use so we have to get creative
     */
    function validateContext(value) {
        // build context storage vars
        if ( contextDefault === null ) { // not yet built
            // this is always set by NR even if settings.js doesn't have anything
            contextDefault = RED.settings.context.default
            // If nothing in settings.js, build the structure from the default - otherwise grab it from settings
            if ( RED.settings.infocacheContextStorage === undefined ) contextStorage[contextDefault] = { 'module' : 'memory' }
            else contextStorage = RED.settings.infocacheContextStorage
        }

        // If the value is not in the context store types, that's an error
        if ( Object.keys(contextStorage).indexOf(value) > -1 ) return true
        else return false
    } // -- End of validateMaxEntries() -- //
    //#endregion ------------------------------------------------- //

    // Register the node type, defaults and set up the edit fns 
     //@ts-ignore 
    RED.nodes.registerType(moduleName, {
        /** @see https://nodered.org/docs/creating-nodes/node-html */
        category: paletteCategory,
        color: paletteColor,
        defaults: {
            name: { value: '', },
            maxEntries: { value: defMaxEntries, required: true },
            contextName: { value: 'default', required: true, validate: validateContext }
        },
        inputs: 1,
        outputs: 1,
        /** @see https://nodered.org/docs/creating-nodes/appearance#icon, @see https://fontawesome.com/v4.7.0/icons/ */
        icon: nodeIcon,
        //paletteLabel: nodeLabel,
        label: function () { return this.name || nodeLabel },

        //#region ---------- Custom properties ---------- //
        /** Is the chosen context store memory based? @type {boolean} */
        //csIsMemory: true,
        //#endregion -------- Custom properties -------- //

        /** Prepares the Editor panel */
        oneditprepare: function () {
            var that = this

            // If the context store selection changes ...
            $('#node-input-contextName').on('change', function(e) {
                /** Is the context store memory based? @type {boolean} */
                var contextIsMemory = contextStorage[this.value].module === 'memory'

                if ( contextIsMemory ) {
                    $('#contextName-hint').html('You have selected a store that is memory-based, so the cache <b><u>WILL NOT</u></b> be restored on a restart of Node-RED or the server.')
                } else {
                    $('#contextName-hint').html('You have selected a store that is persisted to the filling system, so the cache <b><u>WILL</u></b> be restored on a restart of Node-RED or the server.')
                }
            })

            /** Populate the context store select tag */
            var keys = Object.keys(contextStorage)
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i]
                var module = contextStorage[key].module

                /** Is the context store memory based? @type {boolean} */
                var contextIsMemory = contextStorage[key].module === 'memory'

                $('#node-input-contextName')
                    .append(
                        $('<option></option>')
                            .attr('value', key)
                            .attr('selected', key === that.contextName )
                            .attr('title', (contextIsMemory ? 'WARNING: Not persistent. ' : 'NOTE: Persistent. ') + (key === contextDefault ? 'Default context store. ' : ''))
                            .text(key + (key === RED.settings.context.default ? '*' : '') + ' (' + module + ')')
                            .css({
                                'color': contextIsMemory ? '#99ccff' : '#009900',
                                'font-weight': contextIsMemory ? 'normal' : 'bolder',
                            })
                    )
            } // --- --- //

        }, // ---- End of oneditprepare ---- //

        /** Runs before save */
        // oneditsave: function() {
        // }, // ---- End of oneditsave ---- //

        /** Runs before cancel */
        // oneditcancel: function() {
        // }, // ---- End of oneditcancel ---- //

        /** Handle window resizing for the editor */
        // oneditresize: function(_size) {
        // }, // ---- End of oneditcancel ---- //

    }) // ---- End of registerType() ---- //
})()