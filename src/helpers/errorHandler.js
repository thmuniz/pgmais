import winston from 'winston'

/**
* Helper de tratamento de erros
*/
class ErrorHandler {

    constructor() {
        this.env = process.env.STAGE || 'development'
        this.logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    colorize: true
                })
            ]
        })
    }
    /**
     * Receives an HTTP error and created the apropriated response code, message and logs it
     * Recebe um erro de HTTP e cria o seu respectivo código de erro, mensagem e logs
     * @return {boolean}
     */
    createErrorResponse(error) {
        const errorCode = error.status || 500
        let errorMessage

        switch (errorCode) {
            case 404:
                errorMessage = null
                break

            default:
                errorMessage = "Internal error."
                break
        }

        if (error.display === true) {
            errorMessage = error.error
        }
        this.logger.log('error', error)
        return {status: errorCode, message: errorMessage}
    }

    handleError(options) {
        const res = options.res
        const error = options.error
        const err = this.createErrorResponse(error)
        return res.status(err.status).json({error: err.message})
    }
}
export default new ErrorHandler()