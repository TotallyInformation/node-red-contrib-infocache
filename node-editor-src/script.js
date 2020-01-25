// Isolate this code
;(function () {
    'use strict'

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
    var nodeIcon = 'db.png'

    //#endregion ------------------------------------------------- //

    // Register the node type, defaults and set up the edit fns 
     //@ts-ignore 
    RED.nodes.registerType(moduleName, {
        /** @see https://nodered.org/docs/creating-nodes/node-html */
        category: paletteCategory,
        color: paletteColor,
        defaults: {
            name: { value: '' },
            topic: { value: '' },
        },
        inputs: 1,
        outputs: 1,
        /** @see https://nodered.org/docs/creating-nodes/appearance#icon, @see https://fontawesome.com/v4.7.0/icons/ */
        icon: nodeIcon, //'font-awesome/fa-random',
        //paletteLabel: nodeLabel,
        label: function () { return this.url || this.name || nodeLabel },

        /** Prepares the Editor panel */
        oneditprepare: function () {
            var that = this

            //console.log('RED', RED)
            console.log('[infocache:oneditprepare] THIS', that)

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