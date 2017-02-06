import { CustomJWT } from '../libraries/CustomJWT';
import { User }      from '../models/User';
import { Logs }      from '../models/Logs';
import { BaseController } from '../core/BaseController';
import * as express from 'express';
export abstract class Auth {

    /**
     * authenticate
     *
     * Check if the current user is Authenticate
     *
     * @public
     * @author Gustavo Vilas Boas
     * @param {express.Response}     res the response for the request
     * @param {express.Request}      req  the request object
     * @param {express.NextFunction} net a call for the next function
     * @return {boolean} if the user is Authenticate or not
     */
    public static authenticate(req: express.Request, res: express.Response, next: express.NextFunction): boolean {

        // Get the data from de request header
        let token = req.headers ? req.headers['token'] : req.query['token'];

        // create a new CustomJWT
        let jwt = new CustomJWT(token);

        // create a new user model instance
        let userModel = new User();

        // create a new base instance
        let base = new BaseController();

        // check if jwt is valid
        if ( jwt.valid() ) {

            // get the email and if of the sent token
            let email  = jwt.item('email');
            let userID = jwt.item('user_id');

            // compare the header data with JWT
            if (req.headers['user_id'] === userID.toString() && req.headers['email'] === email) {

                // try to Authenticate the user
                userModel.authenticate(email, userID, jwt.token )
                .then( response => {

                    // ok?
                    if (!response) {
                        base.showAccessDenied(req, res);
                        return false;
                    }

                    // the requested url
                    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

                    // create a new Logs object
                    let log = new Logs();

                    // registrate the user log
                    log.register(userID, `O usuário ${email} acessou ${fullUrl}`, 'AC', fullUrl );
                    next();
                })
                .catch( err => {

                    // show Access Denied message
                    base.showAccessDenied(req, res);
                    return false;
                });
            } else {

                // show Access Denied message
                base.showAccessDenied(req, res);
                return false;
            }

        } else {

            // show Access Denied message
            base.showAccessDenied(req, res);
            return false;
        }
    }
};
