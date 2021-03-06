const Generator  = require('yeoman-generator');

/**
 * Library generator
 * 
 * generates a new library
 * 
 * @author Gustavo Vilas Boas
 * @since 02-2017
 */
module.exports = class extends Generator {

    /**
     * constructor
     * 
     * the constructor method
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    constructor( args, opts ) {
        super( args, opts );
    }

    /**
     * _generateController
     * 
     * generate a new controller
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    _generateLibrary( name ) {
        this.fs.copyTpl(
            this.templatePath('library.ts'),
            this.destinationPath(`src/libraries/${name}.ts`),
            { name: name }
        );
    }

    /**
     * prompting
     * 
     * show the user message
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    prompting() {
        
        // message to get controller s name
        let message = {
            type    : 'input',
            name    : 'name',
            message : 'The library name',
            require : true
        }
        
        // call the generateController method
        return this.prompt([ message ]).then( ( answers ) => {
            this._generateLibrary( answers.name );
        });
    }
};