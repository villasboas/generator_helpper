/**
 * BaseController
 *
 * Classe abstrata com as funções comuns a todos os controllers
 *
 * @author Henrique de Castro
 * @since  12/2016
 */
import * as express from 'express';
export class BaseController {

    /**
     * showSuccess
     *
     * Exibe um retorno de sucesso
     *
     * @author Henrique de Castro
     * @since  12/2016
     * @param  array
     * @param  object
     * @return void
     */
    public showSucess(data: Object, res: express.Response) {

        // Adiciona o sucesso nos dados
        let ret       = {};
        ret['status'] = true;
        ret['error']  = false;
        ret['data']   = data;

        // Exibe o retorno
        res.json(ret);
    }

    /**
     * showError
     *
     * Exibe um retorno de erro
     *
     * @author Henrique de Castro
     * @since  12/2016
     * @param  string
     * @param  object
     * @return void
     */
    public showError(error: String, res: express.Response) {

        // Adiciona erro nos dados
        let data       = {};
        data['status'] = false;
        data['error']  = error;

        // Exibe o retorno
        res.json(data);

    }

    /**
     * showAccessDenied
     *
     * Exibe um retorno de acesso negado
     *
     * @author Henrique de Castro
     * @since  12/2016
     * @param  object
     * @return void
     */
    public showAccessDenied(req: express.Request, res: express.Response) {

        // Adiciona erro nos dados
        let data       = {};
        data['status'] = false;
        data['error']  = 'Acesso negado';

        // Exibe o retorno
        res.statusCode = 401;
        res.json(data);
    }

}
