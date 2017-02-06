import Loader from './Loader';
import Config from './Config';
import {Auth} from '../middlewares/Auth';
import { RoutesInterface } from '../interfaces/RoutesInterface';
import { URLInterface } from '../interfaces/URLInterface';
import * as express from 'express';

/**
 * Router Class
 *
 * Set the custom and dynamic routes
 *
 */
export default class Router {

    /**
     * the app object
     */
    private __app;

    /**
     * the config object
     */
    private __config = new Config('routes');

    /**
     * constructor
     *
     * set the routes
     *
     * @public
     * @author Gustavo Vilas Boas
     * @param {object}  the app instance
     * @return {void}
     */
    constructor(app: express.Express) {

        // start the app
        this.__app = app;

        // get the routes
        let routes = this.__config.item('routes');
        for ( let r in routes ) this.setRoute(routes[r]);

        // set the dynamic routes
        this.__setDynamicRoute();
    }

    /**
     * __setDynamicRoute
     *
     * set all defaults routes
     *
     * @private
     * @param {void}
     * @param {void}
     */
    private __setDynamicRoute(): void {

        // authentication
        this.__app.use('*', (req, res, next) => {
            Auth.authenticate(req, res, next);
        });
        // dinamic created routes
        this.__app.all('*', (req, res) => {

            // get the params
            let params = this.__parseURL(req);

            // check if is a controller
            if ( !Loader.isController(`${params['controller']}Controller`) ) {
                this.__error(req, res, `Controller ${params['controller']} not found`);
                return false;
            }

            // try to load the controller
            try {

                // load the controller
                let controller = Loader.controller(`${params['controller']}Controller`);

                // check the function
                if (typeof controller[params['function']] === 'function') {
                    controller[params['function']](req, res, params['params']);
                } else {
                    this.__error(req, res, `Method ${params['function']} in ${params['controller']} not found`);
                }
            } catch ( e ) {

                // show an error and the not found page
                console.error(e);
                this.__notFound(req, res);
            }
        });
    }

    /**
     * setRoute
     *
     * set a new explicit route
     *
     * @public
     * @param {RoutesInterface} a new route
     * @return {void}
     */
    public setRoute( route: RoutesInterface ): void {

        // set 'all' as default method
        route.method = route.method ? route.method : 'all';

        // check if its public
        if ( !route.is_public ) {
            this.__app.use(route.route, ( req, res, next ) => {
                Auth.authenticate(req, res, next);
            });
        }

        // define the explicit routes
        this.__app[route.method](route.route, ( req, res ) => {

            // try to load the controller and the method
            try {

                // get the params
                let params = this.__parseURL(req);

                // load the controller
                let controller = Loader.controller(`${route.controller}`);

                // check the function
                if (typeof controller[route.function] === 'function') {
                    controller[route.function](req, res, params['params']);
                } else {
                    this.__error(req, res, `Method ${route.function} in ${route.controller} not found`);
                }
            } catch ( e ) {

                // show the error and load not found page
                console.error(e);
                this.__notFound(req, res);
            }

        });
    }

    /**
     * __parseURL
     *
     * Parse the url
     *
     * @param {express.Request}  req the requisition
     * @return {URLInterface}
     */
    private __parseURL(req: express.Request): URLInterface {

        // Create the return
        let url: URLInterface = {controller : '', function : '', params : []};

        // split params to get controller and method
        if (typeof(req.params[0]) !== 'undefined') {
            let params = req.params[0].split('/');
            params.splice(0, 1);

            // get controller and function
            url['controller'] = params[0] ? `${params[0].charAt(0).toUpperCase()}${params[0].slice(1)}` : '';
            url['function']   = params[1] ? params[1] : 'index';

            // get the url params
            url['params'] = [];
            if (params.length > 2) {
                for (let i in params) {
                    // convert to number and push params in the array
                    if (+i > 1) url['params'].push(params[i]);
                }
            }
        }

        // Return
        return url;
    }

    /**
     * __notFound
     *
     * default route for not found pages
     *
     * @param {express.Request}  req the requisition
     * @param {express.Response} res the response
     * @return {void}
     */
    private __notFound( req: express.Request, res: express.Response): void {
        res.statusCode = 401;
        res.json('Page Not Found');
    }

    /**
     * __error
     *
     * default route for error
     *
     * @param {express.Request}  req the requisition
     * @param {express.Response} res the response
     * @return {void}
     */
    private __error( req: express.Request, res: express.Response, error: any): void {
        res.statusCode = 500;
        res.json(error);
    }
};
