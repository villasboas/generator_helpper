const Generator     = require( 'yeoman-generator' );
const SequelizeAuto = require( 'sequelize-auto' )
const beautify      = require('gulp-beautify');

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
     * _getType
     * 
     * pega o tipo do campo
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    _getType( value ) {

        // se for do tipo ENUM
        if ( value['type'].indexOf('ENUM') === 0) {
            return "Sequelize." + value['type'];
        } else {

            // declara as variaveis
            let _attr = value['type'].toLowerCase();
            let val   = '';
            
            if (_attr === "boolean" || _attr === "bit(1)") {
                val = '.BOOLEAN';
            } else if (_attr.match(/^(smallint|mediumint|tinyint|int)/)) {
                let length = _attr.match(/\(\d+\)/);
                val = '.INTEGER' + ( length != null ? length : '');
            } else if (_attr.match(/^bigint/)) {
                val = '.BIGINT';
            } else if (_attr.match(/^string|varchar|varying|nvarchar/)) {
                val = '.STRING';
            } else if (_attr.match(/^char/)) {
                let length = _attr.match(/\(\d+\)/);
                val = '.CHAR' + ( length != null ? length : '');
            } else if (_attr.match(/text|ntext$/)) {
                val = '.TEXT';
            } else if (_attr.match(/^(date)/)) {
                val = '.DATE';
            } else if (_attr.match(/^(time)/)) {
                val = '.TIME';
            } else if (_attr.match(/^(float|float4)/)) {
                val = '.FLOAT';
            } else if (_attr.match(/^decimal/)) {
                val = '.DECIMAL';
            } else if (_attr.match(/^(float8|double precision)/)) {
                val = '.DOUBLE';
            } else if (_attr.match(/^uuid|uniqueidentifier/)) {
                val = '.UUIDV4';
            } else if (_attr.match(/^json/)) {
                val = '.JSON';
            } else if (_attr.match(/^jsonb/)) {
                val = '.JSONB';
            } else if (_attr.match(/^geometry/)) {
                val = '.GEOMETRY';
            }

            // volta o valor
            return 'Sequelize'+val;
        }
    }

    /**
     * _getFieldObject
     * 
     * pega o campo
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
    _getFieldObject( value ) {

        // inicia as variaveis
        let fieldName = false;
        let fields    = new Array();

        // percorre todos os campos
        for ( let v in value ) {

            // adiciona em CamelCase
            fieldName = v.replace(/_([a-z])/g, ( g ) => { return g[1].toUpperCase(); });

            // inicia o objeto
            let obj            = new Object();
            obj['name']        = fieldName;
            obj['field']       = v;
            obj['columns']     = new Array();

            // percorre todos os itens
            for ( let f in value[v] ){

                // monta o o objeto
                let column      = new Object();
                column['key']   = f;
                column['value'] = ( f == 'type' ) ? this._getType( value[v] ) : value[v][f];

                // adiciona ao array
                obj['columns'].push( column );
            }

            // adiciona o campo ao array
            fields.push( obj );
        }

        // retorna os campos processados
        return fields;
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
    _generateModel( answers ) {

        // pega os dados do banco
        const auto = new SequelizeAuto( answers.database, answers.user, answers.password );

        // pega os dados do banco
        auto.build( ( err ) => {
            
            // verifica se tem erro
            if ( err ) throw err;

            // informacoes dos dados
            let tables      = new Array();
            let fields      = new Array();
            let tableExists = false;

            // percorre as tabelas
            for ( let i in auto.tables ){
                
                // se a tabela existir
                if ( i == answers.table || !answers.table ) {
                    
                    let model_name = i.replace(/_([a-z])/g,( g ) => { return g[1].toUpperCase(); });
                    model_name = this._capitalize( model_name );

                    // pega os campos
                    tableExists = true;
                    fields      = this._getFieldObject( auto.tables[i] );

                    // usa o beautify
                    this.registerTransformStream(beautify({indentSize: 2 }));

                    // cria o arquivo
                    this.fs.copyTpl(
                        this.templatePath('model.ts'),
                        this.destinationPath(`src/models/${model_name}.ts`),
                        { model  : model_name,
                          table  : i, 
                          fields : fields } );
                }
            }

            // se a tabela não existir, aponta o erro
            if ( !tableExists ) console.error( 'A tabela não existe no Banco de Dados' );
        });
    }

    /**
     * _capitalize
     * 
     * capitalize a string
     * 
     * @public
     * @author Gustavo Vilas Boas
     * @since 02-2017
     */
     _capitalize( string ) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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
        
        // message to get database
        let database = {
            type    : 'input',
            name    : 'database',
            message : 'The database name',
            require : true
        }

        // message to get user
        let user = {
            type    : 'input',
            name    : 'user',
            message : 'The database user',
            require : true
        }

        // message to get password
        let password = {
            type    : 'input',
            name    : 'password',
            message : 'The database password',
            require : true
        }

        // message to get table s name
        let table = {
            type    : 'input',
            name    : 'table',
            message : 'The table name',
            require : true
        }
        
        // call the generateModel method
        return this.prompt([ database, user, password, table ]).then( ( answers ) => {
            console.log( answers );
            this._generateModel( answers );
        });
    }
};