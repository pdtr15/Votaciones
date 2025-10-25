"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const candidatosController_1 = require("../controllers/candidatosController");
const rol_types_1 = require("../@types/rol.types");
const { validarCampos, validarJWT, validarRol } = require("../middlewares");
const candidatosRoutes = (0, express_1.Router)();
candidatosRoutes.get('/buscarColegiado/:numeroColegiado', [
    (0, express_validator_1.check)('numeroColegiado', 'El numero de colegiado es obligatorio').not().isEmpty(),
    validarCampos
], candidatosController_1.buscarPorColegiado);
candidatosRoutes.get('/', candidatosController_1.verCandidatos);
candidatosRoutes.get('/:idCampania', candidatosController_1.verCandidatosPorCampania);
candidatosRoutes.post('/registrar', [
    (0, express_validator_1.check)('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    (0, express_validator_1.check)('campaniaId', 'El campaniaId no es válido').isNumeric(),
    (0, express_validator_1.check)('ingenieroId', 'El ingenieroId no es válido').isNumeric(),
    validarCampos
], candidatosController_1.registrarCandidato);
candidatosRoutes.delete('/eliminar/:idCandidato', [
    validarJWT,
    validarRol([rol_types_1.RolId.Administrador]),
], candidatosController_1.eliminarCandidato);
exports.default = candidatosRoutes;
//# sourceMappingURL=candidatos.routes.js.map