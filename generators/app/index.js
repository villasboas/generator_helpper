const Generator  = require('yeoman-generator');

module.exports = class extends Generator {

    constructor( args, opts ) {
        super( args, opts );

        this.starter_files = [  '.gitignore', 
                                'gulp-deploy.js', 
                                'gulpfile.js', 
                                'package.json', 
                                'tsconfig.json', 
                                'tslint.json' ];

        // This makes `appname` a required argument.
        this.argument('appname', { type: String, required: true });
    }

    writeFiles( name ) {

        this.fs.copy(
            this.templatePath('src/'),
            this.destinationPath('./src/')
        );
        

        for ( let s in this.starter_files ) {

            let file = this.starter_files[s];

            this.fs.copyTpl(
                this.templatePath( file ),
                this.destinationPath( file ),
                { name: this.options.appname }
            );
        }
    }

    installing() {
        this.log( 'installing dependencies' );
        this.installDependencies( { npm : true, bower: false, yarn: false });
    }

};