"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuariosController_1 = require("../controllers/usuariosController");
const express_validator_1 = require("express-validator");
const { validarCampos, validarJWT } = require("../middlewares");
const userRoutes = (0, express_1.Router)();
userRoutes.get('/', usuariosController_1.getUsuarios);
userRoutes.post('/loginIngeniero', [
    (0, express_validator_1.check)('numeroColegiado', 'El numero de colegiado es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('dpi', 'El DPI no es válido').isNumeric().isLength({ min: 13, max: 13 }),
    (0, express_validator_1.check)('fechaNacimiento', 'La fecha de nacimiento no es válida').matches(/^(\d{4})[-|/](0[1-9]|1[0-2])[-|/](0[1-9]|[12][0-9]|3[01])$/),
    (0, express_validator_1.check)('password', 'El password es obligatorio').notEmpty(),
    validarCampos
], usuariosController_1.postLoginInge);
userRoutes.post('/loginAdmin', [
    (0, express_validator_1.check)('email', 'El correo no es válido').isEmail(),
    (0, express_validator_1.check)('password', 'El password es obligatorio').notEmpty(),
    validarCampos
], usuariosController_1.postLoginAdmin);
userRoutes.post('/registrarIngeniero', [
    (0, express_validator_1.check)('numeroColegiado', 'El numero de colegiado es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('dpi', 'El DPI no es válido').isNumeric().isLength({ min: 13, max: 13 }),
    (0, express_validator_1.check)('fechaNacimiento', 'La fecha de nacimiento no es válida').matches(/^(\d{4})[-|/](0[1-9]|1[0-2])[-|/](0[1-9]|[12][0-9]|3[01])$/),
    (0, express_validator_1.check)('nombreCompleto', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El correo no es válido').isEmail(),
    (0, express_validator_1.check)('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    validarCampos
], usuariosController_1.postRegistrarInge);
userRoutes.post('/registrarAdministrador', [
    (0, express_validator_1.check)('nombreCompleto', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El correo no es válido').isEmail(),
    (0, express_validator_1.check)('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    validarCampos
], usuariosController_1.postRegistrarAdmin);
userRoutes.get('/validarToken', validarJWT, usuariosController_1.revalidarToken);
exports.default = userRoutes;
//# sourceMappingURL=usuarios.routes.js.map