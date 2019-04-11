const jwt = require('jsonwebtoken');

// =====================================
// Check Token
// =====================================

let checkToken = (req, res, next) => {

    let token = req.get('token');
    let email = req.body.email;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (decoded.user) {
            console.log(decoded.user.email);
            if (decoded.user.email !== email) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'The email provided is not a user email'
                    }
                });
            }
        } else {
            console.log(decoded.company.email);
            if (decoded.company.email !== email) {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'The email provided is not a company email'
                    }
                });
            }
        }

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid Token'
                }
            });
        }

        req.user = decoded.user;
        next();

    });

};

// =====================================
// Check ADMIN_ROLE
// =====================================

let checkAdmin_Role = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'User is not admin'
            }
        });
    }

    next();
};

module.exports = {
    checkToken,
    checkAdmin_Role
}