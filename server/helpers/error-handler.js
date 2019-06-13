module.exports = function (err, req, res, next) {
    if (err.code === 400) {
        res.status(400).json({
            message: "Bad request"
        })
    } else if (err.code === 401) {
        res.status(401).json({
            message: `${err.message}`
        })
    } else if (err.code === 404) {
        res.status(404).json({
            message: `${err.message}`
        })
    } else if (err.name === 'ValidationError') {
        const errors = {
          message: err.message,
          path: err.path
        };
        res.status(400).json(errors);
    } else {
        res.status(500).json({
            message: `${err}`
        })
    }
}