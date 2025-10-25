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
exports.validarJWT = void 0;
const conexion_1 = __importDefault(require("../db/conexion"));
const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const validarJWT = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (req = request, res = response, next) {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }
    try {
        const { idusuariosistema } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuarioExistente = yield conexion_1.default.query(`SELECT u.idusuariosistema, u.nombrecompleto, u.email, u.rolid, i.idingeniero
            FROM usuariosistema u LEFT JOIN ingeniero i ON u.idusuariosistema = i.usuariosistemaid
            WHERE idusuariosistema = $1`, [idusuariosistema]);
        if (usuarioExistente.rowCount == null || usuarioExistente.rowCount == 0) {
            res.status(401).json({ msg: 'Token no válido - usuario no existe DB' });
            return;
        }
        req.body.usuario = usuarioExistente.rows[0];
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
});
exports.validarJWT = validarJWT;
//# sourceMappingURL=validar-jwt.js.map