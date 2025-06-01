export default function customResponses(req, res, next) {

    if (typeof res.success !== 'function') {
        res.success = (message, data = null) => {
            res.status(200).json({
                status: 'success',
                message,
                data
            });
        };
    }

    if (typeof res.created !== 'function') {
        res.created = (message, data = null) => {
            res.status(201).json({
                status: 'success',
                message,
                data
            });
        };
    }

    if (typeof res.badRequest !== 'function') {
        res.badRequest = (message) => {
            res.status(400).json({
                status: 'error',
                error: message
            });
        };
    }

    if (typeof res.internalError !== 'function') {
        res.internalError = (message) => {
            res.status(500).json({
                status: 'error',
                error: message
            });
        };
    }

    if (typeof res.conflict !== 'function') {
        res.conflict = (message) => {
            res.status(409).json({
                status: 'error',
                error: message
            });
        };
    }

    if (typeof res.notFound !== 'function') {
        res.notFound = (message = 'Not Found') => {
            res.status(404).json({
                status: 'error',
                error: message
            });
        };
    }

    next();
}
