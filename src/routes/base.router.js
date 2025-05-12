import CustomRouter from './CustomRouter.js';

export default class BaseRouter extends CustomRouter {

    init() {
        this.get('/ping', (req, res) => {
            res.success('Ping successful', { message: 'Pong! Server is alive' });
        });
    }

}

