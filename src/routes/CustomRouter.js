import { Router } from 'express';

export default class CustomRouter {

    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    get(path, ...middlewares) {
        this.router.get(path, (req, res, next) => this.#generateCustomResponses(req, res, next), ...middlewares);
    }

    post(path, ...middlewares) {
        this.router.post(path, (req, res, next) => this.#generateCustomResponses(req, res, next), ...middlewares);
    }

    put(path, ...middlewares) {
        this.router.put(path, (req, res, next) => this.#generateCustomResponses(req, res, next), ...middlewares);
    }

    delete(path, ...middlewares) {
        this.router.delete(path, (req, res, next) => this.#generateCustomResponses(req, res, next), ...middlewares);
    }

    patch(path, ...middlewares) {
        this.router.patch(path, (req, res, next) => this.#generateCustomResponses(req, res, next), ...middlewares);
    }

    init() {
        throw new Error('init() must be implemented in the subclass');
    }

    #generateCustomResponses(req, res, next) {
        res.success = (message, data = {}) => {
            res.status(200).json({ status: 'success', message, data });
        }

        res.created = (message, data = {}) => {
            res.status(201).json({ status: 'success', message, data });
        };

        res.noContent = () => {
            res.status(204).send();
        };

        res.badRequest = (error) => {
            res.status(400).json({ status: 'error', error });
        };

        res.unauthorized = (error) => {
            res.status(401).json({ status: 'error', error });
        };

        res.forbidden = (error) => {
            res.status(403).json({ status: 'error', error });
        };

        res.conflict = (error) => {
            res.status(409).json({ status: 'error', error });
        };

        res.internalError = (error) => {
            res.status(500).json({ status: 'error', error });
        };

        next();
    }

}