"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleEstadoCampania = exports.registrarCampania = exports.verCampaniaPorId = exports.verCampanias = void 0;
const conexion_1 = __importDefault(require("../db/conexion"));
const verCampanias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query('SELECT idcampania, titulo, descripcion, fechacreacion, fechafinalizacion, estadoid FROM Campania ORDER BY idCampania ASC');
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener campañas' });
    }
});
exports.verCampanias = verCampanias;
const verCampaniaPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idCampania } = req.params;
    try {
        const result = yield conexion_1.default.query('SELECT idcampania, titulo, descripcion, fechacreacion, fechafinalizacion, estadoid FROM Campania WHERE idcampania = $1 ORDER BY idCampania ASC', [idCampania]);
        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener campañas' });
    }
});
exports.verCampaniaPorId = verCampaniaPorId;
const registrarCampania = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { titulo, descripcion } = req.body;
    try {
        const result = yield conexion_1.default.query('INSERT INTO campania (titulo, descripcion, estadoId ) VALUES ($1, $2, 1) RETURNING idcampania, titulo, descripcion; ', [titulo, descripcion]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al registrar campaña' });
    }
});
exports.registrarCampania = registrarCampania;
const toggleEstadoCampania = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idCampania } = req.params;
    try {
        // Obtener el estado actual de la campaña
        const result = yield conexion_1.default.query('SELECT EstadoId FROM Campania WHERE IdCampania = $1', [idCampania]);
        if (result.rowCount === 0) {
            res.status(404).json({ msg: 'Campaña no encontrada' });
            return;
        }
        const estadoActual = result.rows[0].estadoid;
        // Cambiar el estado de la campaña dependiendo del estado actual
        let nuevoEstado;
        let fechaFinalizacion;
        if (estadoActual === 1) {
            // Cambiar a "Finalizado"
            nuevoEstado = 2;
            fechaFinalizacion = new Date().toLocaleString("en-US", { timeZone: "America/Guatemala" }); // Asignar la fecha actual
        }
        else if (estadoActual === 2) {
            // Cambiar a "Activado"
            nuevoEstado = 1;
            fechaFinalizacion = null; // Limpiar la fecha de finalización
        }
        else {
            res.status(400).json({ msg: 'Estado no válido' });
            return;
        }
        // Actualizar la campaña con el nuevo estado y fecha de finalización
        const updateResult = yield conexion_1.default.query('UPDATE campania SET estadoId = $1, fechafinalizacion = $2 WHERE idcampania = $3 RETURNING *;', [nuevoEstado, fechaFinalizacion, idCampania]);
        res.status(200).json(updateResult.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al cambiar estado de campaña' });
    }
});
exports.toggleEstadoCampania = toggleEstadoCampania;
//# sourceMappingURL=campaniasController.js.map