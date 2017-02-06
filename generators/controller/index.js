const Generator  = require('yeoman-generator');

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
    _generateController( name ) {
        this.fs.copyTpl(
            this.templatePath('controller.ts'),
            this.destinationPath(`src/controllers/${name}Controller.ts`),
            { controller: name }
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
            message : 'The controller name',
            require : true
        }
        
        // call the generateController method
        return this.prompt([ message ]).then( ( answers ) => {
            this._generateController( answers.name );
        });
    }
};