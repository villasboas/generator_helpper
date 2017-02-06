/**
 * Module dependencies
 */
import * as express    from 'express';
import * as http       from 'http';
import * as bodyParser from 'body-parser';
import Router          from './libraries/Router';

// Call the Express
const app: express.Express = express();
let server = http.createServer(app);

// Default settings
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Start the routes
new Router(app);

// Start the server
server.listen(4000);
server.on('listening', () => {
    console.log('Rodando na porta %d e no modo %s', server.address().port, app.settings.env);
});
server.on('error', (error) => {
    console.error(error);
});

// And here we go
export default app;
