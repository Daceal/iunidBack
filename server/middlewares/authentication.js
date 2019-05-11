const jwt = require('jsonwebtoken');

/**
 * Method name:
 *      checkToken
 * 
 * Received parameters:
 *      token, email
 * 
 * The method verify the token received and the seed we are working.
 * 
 * If the user email is not the same that the email passed that means
 * the email is not a user email and do the same with a company.
 * 
 * We do this because someone can change the localstorage and introduce
 * a false email that could be a company email or user email when he/she is
 * a user instead of a company and vice-versa.
 * 
 */

let checkToken = (req, res, next) => {

    let token = req.get('token');
    let email = req.body.email;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (decoded.user) {
            if (decoded.user.email !== email) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'The email provided is not a user email'
                    }
                });
            }
        } else {
            if (decoded.company.email !== email) {
                return res.json({
                    ok: false,
                    err: {
                        message: 'The email provided is not a company email'
                    }
                });
            }
        }

        if (err) {
            return res.json({
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

/**
 * Method name:
 *      checkAdmin_Role
 * 
 * Received parameters:
 *      user
 * 
 * The method take the current user and compare the role he has
 * with the admin role, if he is not an admin he can´t do the action of the method
 * that this one is included.
 * 
 */

let checkAdmin_Role = (req, res, next) => {

    let userType = req.body.userType;

    if (userType !== 'ADMIN_ROLE') {
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