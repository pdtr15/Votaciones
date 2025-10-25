"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const campaniasController_1 = require("../controllers/campaniasController");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const rol_types_1 = require("../@types/rol.types");
const { validarCampos, validarRol } = require("../middlewares");
const campaniasRoutes = (0, express_1.Router)();
campaniasRoutes.get('/', campaniasController_1.verCampanias);
campaniasRoutes.get('/:idCampania', campaniasController_1.verCampaniaPorId);
campaniasRoutes.post('/registrar', [
    validar_jwt_1.validarJWT,
    validarRol([rol_types_1.RolId.Administrador]),
    (0, express_validator_1.check)('titulo', 'El título es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('titulo', 'El título tiene que ser menor a 150 caracteres').isLength({ max: 150 }),
    (0, express_validator_1.check)('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    (0, express_validator_1.check)('descripcion', 'La descripción tiene que ser menor a 500 caracteres').isLength({ max: 500 }),
    validarCampos
], campaniasController_1.registrarCampania);
campaniasRoutes.put('/toggleEstado/:idCampania', [
    validar_jwt_1.validarJWT,
    validarRol([rol_types_1.RolId.Administrador]),
], campaniasController_1.toggleEstadoCampania);
exports.default = campaniasRoutes;
//# sourceMappingURL=campanias.routes.js.map