const Generator  = require('yeoman-generator');

/**
 * App generator
 * 
 * generates the root application structure
 * 
 * @author Gustavo Vilas Boas
 * @since 02-2017
 */
module.exports = class extends Generator {

    /**
     * constructor
     * 
     * constructor method
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    constructor( args, opts ) {
        super( args, opts );

        // all starter files
        this.starter_files = [  '.gitignore', 
                                'gulp-deploy.js', 
                                'gulpfile.js', 
                                'package.json', 
                                'tsconfig.json', 
                                'tslint.json' ];

        // This makes `appname` a required argument.
        this.argument('appname', { type: String, required: true });
    }

    /**
     * writeFiles
     * 
     * Copy files to the application path
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    writeFiles( name ) {

        // copy all files
        this.fs.copy(
            this.templatePath('src/'),
            this.destinationPath('./src/')
        );
        
        // copy all files and template them
        for ( let s in this.starter_files ) {

            // set the files var
            let file = this.starter_files[s];

            // copy the files to the application path
            this.fs.copyTpl(
                this.templatePath( file ),
                this.destinationPath( file ),
                { name: this.options.appname }
            );
        }
    }

    /**
     * installing
     * 
     * install the package dependencies
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    installing() {
        this.log( 'installing dependencies' );
        this.installDependencies( { npm : true, bower: false, yarn: false });
    }
};