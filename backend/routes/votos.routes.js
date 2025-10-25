"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const votosController_1 = require("../controllers/votosController");
const rol_types_1 = require("../@types/rol.types");
const { validarRol, validarJWT } = require("../middlewares");
const votosRoutes = (0, express_1.Router)();
votosRoutes.post('/registrar', [
    validarJWT,
    validarRol([rol_types_1.RolId.Ingeniero]),
], votosController_1.registrarVoto);
votosRoutes.get('/verVotos/:idCampania', votosController_1.verConteoVotosPorCampania);
exports.default = votosRoutes;
//# sourceMappingURL=votos.routes.js.map