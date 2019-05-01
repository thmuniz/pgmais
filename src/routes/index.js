import users from './users'

export default function execute(app){

    app.use(function(req, res, next) {
        req.getUrl = function() {
            return req.protocol + "://" + req.get('host') + req.originalUrl
        };
        req.getSimpleUrl = function() {
            return req.protocol + "://" + req.get('host')
        };
        return next()
    });
}
