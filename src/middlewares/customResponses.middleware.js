export default function customResponses(req, res, next) {

    res.success = (message, data = null) => {
        res.status(200).json({
            status: 'success',
            message,
            data
        });
    };

    res.created = (message, data = null) => {
        res.status(201).json({
            status: 'success',
            message,
            data
        });
    };

    res.badRequest = (message) => {
        res.status(400).json({
            status: 'error',
            error: message
        });
    };

    res.internalError = (message) => {
        res.status(500).json({
            status: 'error',
            error: message
        });
    };

    res.conflict = (message) => {
        res.status(409).json({
            status: 'error',
            error: message
        });
    };

    res.notFound = (message = 'Not Found') => {
        res.status(404).json({
            status: 'error',
            error: message
        });
    };

    next();

}