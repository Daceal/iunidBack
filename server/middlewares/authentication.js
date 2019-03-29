const jwt = require('jsonwebtoken');

// =====================================
// Check Token
// =====================================

let checkToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalid'
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