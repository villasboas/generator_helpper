/**
 * Config
 *
 * Get the configs
 *
 * @author Henrique de Castro
 * @since  12/2016
 */
import * as express from 'express';
import Helper from './Helper';
export default class Config {

    // Storage data
    private __data: Object = {};

    // the current config object
    private __config_items: string;

    /**
     * constructor
     *
     * Read the config.json
     *
     * @author Henrique de Castro
     * @since  12/2016
     * @return void
     */
    constructor( config_items: string ) {

        // set the collection for the instance
        this.__config_items = config_items;

        // get all the config files
        let config_files = Helper.getFiles('../config', ['ts', 'js']);

        // get all config objects
        for ( var f in config_files ) {

            // trying to load the configuration file
            try {

                // get the file content
                let inner = require(`../config/${config_files[f]}`)[config_files[f]];

                // check if it is undefined
                if ( typeof inner === 'undefined') {
                    throw new Error('The exported object and the configuration file must have the same name');
                } else {

                    // get the enviroment
                    let env: string = express().settings.env;

                    // save the data
                    this.__data[config_files[f]] = inner[env] ? inner[env] : inner;
                }

            } catch ( e ) {

                // catch the error
                throw( e );
            }
        }
    }

    /**
     * item
     *
     * Get the item data
     *
     * @author Henrique de Castro
     * @since  12/2016
     * @return Object
     */
     item (key: string): Object {
         return this.__data[this.__config_items][key] || {};
     }
};
