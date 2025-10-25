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
exports.eliminarCandidato = exports.registrarCandidato = exports.verCandidatosPorCampania = exports.verCandidatos = exports.buscarPorColegiado = void 0;
const conexion_1 = __importDefault(require("../db/conexion"));
const buscarPorColegiado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numeroColegiado } = req.params;
    try {
        const result = yield conexion_1.default.query(`SELECT i.IdIngeniero, u.NombreCompleto, i.Dpi, i.FechaNacimiento 
            FROM Ingeniero i JOIN UsuarioSistema u ON i.UsuarioSistemaId = u.IdUsuarioSistema 
            WHERE i.NumeroColegiado = $1`, [numeroColegiado]);
        if (result.rowCount === 0) {
            res.status(404).json({ msg: 'Ingeniero no encontrado' });
            return;
        }
        const colegiado = result.rows[0];
        res.status(200).json(colegiado);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al buscar ingeniero' });
    }
});
exports.buscarPorColegiado = buscarPorColegiado;
const verCandidatos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield conexion_1.default.query(`SELECT c.IdCandidato, c.Descripcion, c.NumTotalVotos, ca.Titulo AS Campania, u.NombreCompleto AS Ingeniero
            FROM Candidato c
            JOIN Campania ca ON c.CampaniaId = ca.IdCampania
            JOIN Ingeniero i ON c.IngenieroId = i.IdIngeniero
            JOIN UsuarioSistema u ON i.UsuarioSistemaId = u.IdUsuarioSistema`);
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener candidatos' });
    }
});
exports.verCandidatos = verCandidatos;
const verCandidatosPorCampania = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idCampania } = req.params;
    try {
        const result = yield conexion_1.default.query(`SELECT c.IdCandidato, c.Descripcion, c.NumTotalVotos, ca.Titulo AS Campania, u.NombreCompleto AS Ingeniero, ca.idcampania
            FROM Candidato c
            JOIN Campania ca ON c.CampaniaId = ca.IdCampania
            JOIN Ingeniero i ON c.IngenieroId = i.IdIngeniero
            JOIN UsuarioSistema u ON i.UsuarioSistemaId = u.IdUsuarioSistema
            WHERE ca.idcampania = $1`, [idCampania]);
        if (result.rowCount === 0) {
            res.status(404).json({ msg: 'No hay candidatos postulados para esta campaña' });
            return;
        }
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener candidatos por campania' });
    }
});
exports.verCandidatosPorCampania = verCandidatosPorCampania;
const registrarCandidato = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { descripcion, campaniaId, ingenieroId } = req.body;
    try {
        const candidatoExistente = yield conexion_1.default.query('SELECT 1 FROM Candidato WHERE CampaniaId = $1 AND IngenieroId = $2', [campaniaId, ingenieroId]);
        if (candidatoExistente.rowCount == null || candidatoExistente.rowCount > 0) {
            res.status(400).json({ msg: 'El ingeniero ya está registrado como candidato en esta campaña.' });
            return;
        }
        const result = yield conexion_1.default.query('INSERT INTO Candidato (Descripcion, NumTotalVotos, CampaniaId, IngenieroId) VALUES ($1, 0, $2, $3) RETURNING *', [descripcion, campaniaId, ingenieroId]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al registrar candidato' });
    }
});
exports.registrarCandidato = registrarCandidato;
const eliminarCandidato = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idCandidato } = req.params;
    try {
        const candidato = yield conexion_1.default.query('SELECT numtotalvotos FROM Candidato WHERE IdCandidato = $1', [idCandidato]);
        if (candidato.rowCount === 0) {
            res.status(404).json({ msg: 'Candidato no encontrado' });
            return;
        }
        if (candidato.rows[0].numtotalvotos > 0) {
            res.status(500).json({ msg: 'No puedes eliminar este candidato porque ya tiene votos.' });
            return;
        }
        // Eliminar el candidato de la base de datos
        yield conexion_1.default.query('DELETE FROM Candidato WHERE IdCandidato = $1', [idCandidato]);
        res.status(200).json({
            msg: 'Candidato eliminado exitosamente',
            idCandidato
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al eliminar el candidato',
        });
    }
});
exports.eliminarCandidato = eliminarCandidato;
//# sourceMappingURL=candidatosController.js.map