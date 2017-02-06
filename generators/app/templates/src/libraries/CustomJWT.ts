/**
 * 
 * CustomJWT
 * 
 * Classe para manipulação e criação de JsonWebTokens. 
 * 
 * @author villasboas
 * @since 11/2016
 * 
 */
import * as Token from 'jsonwebtoken';
export class CustomJWT {

    /**
     * @private
     * @type {string}
     * @desc chave usada na encriptação
     */
    private __privateKey: string = 'osnfoHelpperanOJASOjs837doifjaosnKLJNOjas';

    /**
     * @private
     * @type {string}
     * @desc algoritimo de encriptação
     */
    private __algorithm: string = 'HS256';

    /**
     * @private
     * @type {string}
     * @desc token gerado
     */
    private __token: string;

    /**
     * @private
     * @type {string}
     * @desc prazo de validade
     */
    private __expiration: string = '';

    /**
     * @private
     * @type {object}
     * @desc dados descriptografados
     */
    private __decoded: {};

    /**
     * Método construtor
     * 
     * @param token {string} token de inicialização ( não obrigatório )
     */
    constructor( token?: string ) {

        // seta o token se ele nao existir
        this.__token = token ? token : '';

        // verifica se o token passado é válido
        if ( token ) this.valid();
    }

    /**
     * set algoritihm
     * define qual o algoritimo usado na geração do token
     * 
     * @public
     * @param type {string} o algoritimo que será usado 
     */
    set algoritihm( type: string ){
        this.__algorithm = type;
    }

    /**
     * set token
     * seta um token qualquer 
     * 
     * @public
     * @param token {string} um token TokenScript
     */
    set token( token: string ) {
        this.token = token;
    }

    /**
     * get token
     * pega o token  
     * 
     * @public
     * @return token {string} um token TokenScript
     */
    get token(): string{
        return this.__token;
    }

    /**
     * get token
     * pega o token decodificado
     * 
     * @public
     * @return token {string} um token TokenScript
     */
    get decoded(): Object {
        return this.__decoded;
    }

     /**
     * set expiration
     * seta um prazo de validade para o token
     * 
     * @public
     * @param expiration {string} um dado que pode ser convertido em data
     */
    set expiration( expiration: string ) {
        this.__expiration = expiration;
    }

    /**
     * create
     * Cria um novo TokenScript
     * 
     * @private
     * @param data {object} um objeto que será guardado no token gerado
     * @return {create}
     */
    public create( data: {} ): string {

        // verifica se uma chave foi informada
        if ( this.__privateKey.length === 0 ) {
            throw new Error('Nenhuma chave privada foi informada');
        } else if ( this.__privateKey.length < 16 ) {
            throw new Error('A chave privada precisa ter mais de 16 caracters');
        }

        // objeto de config
        let config = {
            algorithm : this.__algorithm
        };

        // verifica se tem prazo de validade
        if ( this.__expiration )
            config['expiresIn'] = this.__expiration;

        // cria o token
        this.__token = Token.sign( data , this.__privateKey, config);

        // volta o token
        return this.__token;
    }

    /**
     * valid
     * Informa se um TokenScript é válido ou não, de acordo com as regras definidas
     * 
     * @private
     * @return {boolean}
     */
    public valid(): boolean {

        // Tenta decodificar o token
        try {

            // pega os dados
            this.__decoded = Token.verify(this.__token, this.__privateKey);

            // Tudo ok
            return true;
        } catch (err) {

            // mostra o erro e retorna false
            console.error(err.message);
            return false;
        }
    }

    /**
     * item
     * Retorna o item informado do token decodificado
     * 
     * @private
     * @param key {string} o item a ser recuperado
     * @return {string}
     */
    public item( key: string ): string {

        // verifica se a chave esta definida
        return typeof this.__decoded[key] === 'undefined' ? '' : this.__decoded[key];
    }
};

