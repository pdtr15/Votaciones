"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarRol = void 0;
const validarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        try {
            const usuario = req.body.usuario;
            if (!usuario) {
                return res.status(401).json({
                    msg: 'No hay token en la petición o el usuario no está autenticado'
                });
            }
            if (!rolesPermitidos.includes(usuario.rolid)) {
                return res.status(403).json({
                    msg: 'El usuario no tiene el rol adecuado para esta acción'
                });
            }
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: 'Error al verificar el rol del usuario'
            });
        }
    };
};
exports.validarRol = validarRol;
//# sourceMappingURL=validarRol.js.map