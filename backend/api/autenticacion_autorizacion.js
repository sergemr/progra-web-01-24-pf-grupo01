const jwt = require('jsonwebtoken');

const autenticacion_autorizacion = {
    authenticateJWT: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, process.env.JWT_LLAVE_SECRETA, (err, user) => {
                if (err) {
                    return res.status(403).json({ mensaje: 'Token inválido' });
                }

                req.user = user;
                next();
            });
        } else {
            res.status(401).json({ mensaje: 'Token no proporcionado' });
        }
    },

    autorizarAdmin: (req, res, next) => {
        // Verificar si el rol del usuario es 'admin'
        if (req.user && req.user.rol === 'admin') {
            next();
        } else {
            res.status(403).json({ mensaje: 'Acceso denegado. Solo el administrador puede realizar esta operación.' });
        }
    }
};

module.exports = autenticacion_autorizacion;