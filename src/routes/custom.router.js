import { Router } from 'express';

export default class CustomRouter {

    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    get(path, policies, ...callbacks) {
        this.router.get(
            path,
            this.#generateCustomResponses,
            this.#handlePolicies(policies),
            ...callbacks
        );
    }

    post(path, policies, ...callbacks) {
        this.router.post(
            path,
            (req, res, next) => this.#generateCustomResponses(req, res, next),
            this.#handlePolicies(policies),
            ...callbacks
        );
    }

    put(path, policies, ...callbacks) {
        this.router.put(
            path,
            (req, res, next) => this.#generateCustomResponses(req, res, next),
            this.#handlePolicies(policies),
            ...callbacks
        );
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(
            path,
            (req, res, next) => this.#generateCustomResponses(req, res, next),
            this.#handlePolicies(policies),
            ...callbacks
        );
    }

    patch(path, policies, ...callbacks) {
        this.router.patch(
            path,
            (req, res, next) => this.#generateCustomResponses(req, res, next),
            this.#handlePolicies(policies),
            ...callbacks
        );
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

    #handlePolicies(policies) {
        return (req, res, next) => {
            if (!Array.isArray(policies)) {
                req.logger?.error(`[POLICY ERROR] Expected an array, but received: ${typeof policies}`)
                return res.internalError("El parámetro 'policies' debe ser un array.")
            }
            if (policies.includes('public')) return next()

            const user = req.user

            if (!user) {
                req.logger?.warning('[AUTH] Unauthorized access attempt (no user in request)')
                return res.unauthorized('No autorizado: se requiere autenticación.')
            }

            if (!policies.includes(user.role)) {
                req.logger?.warning(`[AUTH] Forbidden: user role "${user.role}" does not match required policies ${JSON.stringify(policies)}`)
                return res.forbidden('No tenés permisos para acceder a este recurso.')
            }

            next()
        }
    }

}