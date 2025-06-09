import CustomRouter from './custom.router.js';

export default class BaseRouter extends CustomRouter {

    init() {
        this.get('/ping', ['public'], (req, res) => {
            res.success('Ping successful', { message: 'Pong! Server is alive' });
        });
    }

}

