"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarJWT = void 0;
const jwt = require('jsonwebtoken');
const generarJWT = (idusuariosistema = '') => {
    return new Promise((resolve, reject) => {
        const payload = { idusuariosistema };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: `${process.env.EXPIRES}`
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generarJWT = generarJWT;
//# sourceMappingURL=generar-jwt.js.map