/**
 * BaseModel
 *
 * Abstract class with all common models methods 
 *
 * @author Gustavo Vilas Boas
 * @since  12/2016
 */
import * as Sequelize from 'sequelize';
import * as Mongoose from 'mongoose';
import Config from '../libraries/Config';
export abstract class BaseModel {

    /**
     * ORM
     * 
     * An instance of current ORM
     * @private
     */
    private __ORM: Sequelize.Model<{}, {}> | Mongoose.Model<Mongoose.Document>;

    /**
     * _is_sql
     * 
     * @type {boolean} _is_sql indicates if the current model is sql or not
     * @protected
     */
    protected _is_sql: boolean = true;

    /**
     * debug
     * 
     * @type {boolean} debug activate the debug
     * @protected
     */
    public debug: boolean = false;

    /**
     * _name
     * 
     * @type {string} _name the name of the model
     * @protected
     */
    protected _name: string;

    /**
     * _fields
     * 
     * @type {Schema} _fields a MongoDB Schema
     * @type {Object} _fields a Sequelize model object
     * @protected
     */
    protected _fields: {};

    /**
     * __config
     * 
     * @type {Config} _config an instance of Config object
     * @protected
     */
    private __config: Config = new Config('database');

    /**
     * get ORM
     * 
     * Initialize the Sequelize or Mongoose and return the ORM
     *
     * @author Henrique de Castro
     * @since 12/2016
     */
    public get ORM(): any {

        // check if is a sql or a no-sql database
        if ( this._is_sql ) this.__setSequelize(); else this.__setMongoose();

        // Return the object
        return this.__ORM;
    }

    /**
     * __setSequelize
     * 
     * set the sequelize ORM
     * 
     * @author Gustavo Vilas Boas
     * @since 12-2016
     */
    private __setSequelize(): void {

        // get the sql configs
        let sql = this.__config.item('sql');

        // a new sequelize instance
        let sequelize: Sequelize.Sequelize;

        // try do connect to the database
        try {

            // debug?
            if (this.debug)
                sql['logging'] = console.log;

            // set se sequelize configurations
            sequelize = new Sequelize(  sql['database'], sql['username'], sql['password'], sql );

            // define a new model
            this.__ORM = sequelize.define(this._name, this._fields);

            // sync with the db
            this.__ORM.sync();

        } catch ( e ) {

            // show the error
            console.error(e);
        }
    }

    /**
     * __setMongoose
     * 
     * set the mongoose ORM
     * 
     * @author Gustavo Vilas Boas
     * @since 12-2016
     */
    private __setMongoose(): void {

        // get the no-sql configs
        let config = this.__config.item('no_sql');

        // debug?
        Mongoose.set('debug', this.debug);

        // a new instance of the MongoDB Schema
        let schema = new Mongoose.Schema(this._fields, {versionKey: '' });

        // try to connect
        try {

            // connection string
            let url = `mongodb://${config['host']}/${config['database']}`;

            // connect to database
            Mongoose.connect(url, config);

            // define the promise object
            (<any>Mongoose).Promise = global.Promise;

        } catch ( e ) {

            // show the error, if exists
            if ( e.message !== 'Trying to open unclosed connection.' )
                console.error(e.message);
        }

        // trying to create a new MongoDB model
        try {

            // check if the model already exists
            if ( Mongoose.model(this._name) ) this.__ORM = Mongoose.model(this._name);

        } catch ( e ) {

            // if model doesnt exists
            if (e.name === 'MissingSchemaError')  this.__ORM = Mongoose.model(this._name, schema);
        }
    }
};


