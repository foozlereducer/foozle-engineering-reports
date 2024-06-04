export const log = (logger) => async (req, res) => {
    try {
        const {status, message, severity} = req.body;
        const result = await logger(status, message, severity)
        if (result.createdAt) {
            res.send(result)
        } else {
            res.send(`failed to log ${message}`);
        }
    } catch(error) {
        if ('undefined' !== error.stack) {
            const logRes = await logger(status, message, severity, error.stack)
            res.send(`ERROR `)
        } else {
            res.send('boo')
        }
    }
}