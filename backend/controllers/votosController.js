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
exports.verConteoVotosPorCampania = exports.registrarVoto = void 0;
const conexion_1 = __importDefault(require("../db/conexion"));
const registrarVoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, candidatoId, campaniaId } = req.body;
    console.log(usuario);
    try {
        // Llamar al procedimiento almacenado para registrar el voto y actualizar los votos del candidato
        const respuesta = yield conexion_1.default.query('SELECT registrar_voto($1, $2, $3)', [usuario.idingeniero, candidatoId, campaniaId]);
        const mensaje = respuesta.rows[0].registrar_voto;
        console.log(mensaje);
        if (mensaje.includes("Error:")) {
            res.status(500).json({
                msg: mensaje
            });
        }
        else {
            res.status(201).json({
                msg: mensaje
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servicio'
        });
    }
});
exports.registrarVoto = registrarVoto;
const verConteoVotosPorCampania = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idCampania } = req.params;
    try {
        const totalVotosResult = yield conexion_1.default.query('SELECT SUM(NumTotalVotos) AS total_votos FROM Candidato WHERE campaniaid = $1', [idCampania]);
        const totalVotos = totalVotosResult.rows[0].total_votos || 0;
        if (totalVotos == 0) {
            res.status(404).json({ msg: 'Aún no se han registrado votos' });
            return;
        }
        const result = yield conexion_1.default.query(`SELECT 
                c.IdCandidato, 
                u.NombreCompleto AS NombreCandidato,
                c.Descripcion,
                c.NumTotalVotos, 
                ((c.NumTotalVotos * 100.0) / $1) AS PorcentajeVotos
            FROM Candidato c
            INNER JOIN Ingeniero i ON c.IngenieroId = i.IdIngeniero
            INNER JOIN UsuarioSistema u ON i.UsuarioSistemaId = u.IdUsuarioSistema
            WHERE c.CampaniaId = $2
            ORDER BY c.NumTotalVotos DESC
            `, [totalVotos, idCampania]);
        // Verificar si se encontraron candidatos
        if (result.rows.length === 0) {
            res.status(404).json({ msg: 'No se encontraron votos para esta campaña' });
            return;
        }
        // Retornar los resultados
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error al obtener el conteo de votos:', error);
        res.status(500).json({ msg: 'Error al obtener el conteo de votos' });
    }
});
exports.verConteoVotosPorCampania = verConteoVotosPorCampania;
//# sourceMappingURL=votosController.js.map