import Helper from './Helper';

/**
 * Loader
 * 
 * A class for loading Models and Controllers
 * 
 * @author Gustavo Vilas Boas
 * @since 12-2016
 */
class Loader {

    /**
     * __controllers
     * 
     * @private
     * @type {Array<string>}
     */
    private __controllers: Array<string>;

    /**
     * __models
     * 
     * @private
     * @type {Array<string>}
     */
    private __models: Array<string>;

    /**
     * constructor
     * 
     * set the controllers and models
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @return {void}
     */
    constructor() {
        this.__setControllers();
        this.__setModels();
    }

    /**
     * __setControllers
     * 
     * read all controllers files
     * 
     * @private 
     * @author Gustavo Vilas Boas
     * @since 12-2016
     */
    private __setControllers(): void {

        // get all controllers files
        this.__controllers = Helper.getFiles('../controllers', ['js', 'ts']);

    };

    /**
     * __setModels
     * 
     * read all models files
     * 
     * @private
     * @author Gustavo Vilas Boas
     * @since 12-2016
     */
    private __setModels(): void {

        // get all controllers files
        this.__models = Helper.getFiles('../models', ['js', 'ts']);

    }

    /**
     * isController
     * 
     * check if a string is a valid controller name
     * 
     * @private
     * @author Gustavo Vilas Boas
     * @since 12-2016
     * @param {string} name the controller name
     * @return {boolean}
     */
    public isController( name: string ): boolean {
        return this.__controllers.indexOf(name) !== -1;
    }

    /**
     * isModel
     * 
     * check if a string is a valid model name
     * 
     * @private
     * @author Gustavo Vilas Boas
     * @since 12-2016
     * @param {string} name the model name
     * @return {boolean}
     */
    public isModel( name: string ): boolean {
        return this.__models.indexOf(name) !== -1;
    }

    /**
     * model
     * 
     * load the passed model
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 12-2016
     * @param {string} name the model name
     * @return a instance of the model
     */
    public model( name: string ) {

        // check if a model with the informed name exists
        if ( this.isModel( name )) {

            // try to load the model
            try {

                // load the model
                let model = require(`../models/${name}`)[name];

                // return a new instance of the object
                return new model();

            } catch ( e ) {

                // if the loading failed
                throw new Error(`Was not possible to load ${name} Model`);
            }

        } else {

            // if the model doesnt exists
            throw new Error(`${name} is not Model`);
        }
    }

    /**
     * controller
     * 
     * load the passed controller
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 12-2016
     * @param {string} name the controller name
     * @return a instance of the controller
     */
    public controller( name: string ) {

        // check if a controller with the informed name exists
        if ( this.isController( name )) {

            // try to load the controller
            try {

                // load the controller
                let controller = require(`../controllers/${name}`)[name];

                // return a new instance of the object
                return new controller();

            } catch ( e ) {

                // if the loading failed
                throw new Error(`Was not possible to load ${name} Controller`);
            }

        } else {

            // if the controller doesnt exists
            throw new Error(`${name} is not Controller`);
        }
    }
}

// export a new instance of the Loader class
export default new Loader();
