const Generator = require( 'yeoman-generator' );
const beautify  = require('js-beautify').js_beautify;
const fs        = require( 'fs' );
const markdown  = require ( 'tidy-markdown' );
const ejs       = require( 'ejs' );

/**
 * Model generator
 * 
 * generates a new model
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
     * _generateDocs
     * 
     * generate de docs for the new route
     * 
     * @private
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    _generateDocs( route ) {

        // get the routes file
        const path = this.templatePath(`template.md`);
        
        // open the already writen file
        fs.readFile( this.destinationPath( 'README.md' ), ( err, text ) => {

            // le o arquivo de template
            fs.readFile( path, 'utf8', ( err, data ) => {

                // check if there is any error
                if ( err ) throw new Error( err );

                // set all as string
                for ( let r in route ) route[r] = route[r].toString();
                
                // process the template
                let compiled = ejs.render( data, {
                    'route'     : route.route,
                    'controller': route.controller,
                    'action'    : route.function, 
                    'method'    : route.method,
                    'file'      : text, 
                    'is_public' : route.is_public,
                }, {} );

                // write the file
                this.fs.write( this.destinationPath( 'README.md' ), compiled );
            });
        }); 
    }

    /**
     * _writeRoute
     * 
     * write the new route
     * 
     * @private
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    _writeRoute( route ) {

        // transforma o json em string
        let route_str = ', '+JSON.stringify( route );

        // get the routes file
        const path = this.destinationPath(`src/config/routes.ts`);
        fs.readFile( path, 'utf8', ( err, data ) => {
            
            // check for errors
            if ( err ) throw new Error( err ); 

            // get the last index of ]; 
            let last_index = data.lastIndexOf('];');

            // set the new string
            let str = `${data.substring( 0, last_index )}${route_str}${data.substring( last_index )}`;
            str     = beautify( str, { indent_size: 2 } );

            // write the file
            this.fs.write( path, str );

            // generate de docs for the new route
            this._generateDocs( route );
        });
    }

    /**
     * _generateRoute
     * 
     * generates the new route object
     * 
     * @private
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    _generateRoute( answers ) {

        // monta a rota
        let obj = {
                route      : `/${answers.path}`,
                controller : `${answers.controller}Controller`,
                function   : `${answers.method}`,
                method     : answers.action,
                is_public  : ( answers.is_public === 'yes' || answers.is_public === 'y' ) 
        };

        // escreva a rota
        this._writeRoute( obj );
    }

    /**
     * prompting
     * 
     * show the user interaction
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    prompting () {

        // message to get database
        let path = {
            type    : 'input',
            name    : 'path',
            message : 'The route path',
            require : true
        }

        // message to get user
        let controller = {
            type    : 'input',
            name    : 'controller',
            message : 'The route controller',
            require : true
        }

        // message to get password
        let method = {
            type    : 'input',
            name    : 'method',
            message : 'The controller method',
            require : true
        }

        // message to get table s name
        let is_public = {
            type    : 'input',
            name    : 'is_public',
            message : 'Is this route public?',
            require : true
        }

        // message to get table s name
        let action = {
            type    : 'input',
            name    : 'action',
            message : 'The route action',
            require : true
        }
        
        // call the generateModel method
        return this.prompt([ path, controller, method, is_public, action ]).then( ( answers ) => {
            this._generateRoute( answers );
        });
    } 
};