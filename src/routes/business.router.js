import CustomRouter from './custom.router.js';
import { createBusiness } from '../controllers/business.controller.js';

export default class BusinessRouter extends CustomRouter {

    init() {
        this.post('/', [], createBusiness);
    }

}