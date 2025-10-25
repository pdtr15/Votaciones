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
exports.revalidarToken = exports.postRegistrarAdmin = exports.postRegistrarInge = exports.postLoginAdmin = exports.postLoginInge = exports.getUsuarios = void 0;
const conexion_1 = __importDefault(require("../db/conexion"));
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Hola");
    return;
});
exports.getUsuarios = getUsuarios;
const postLoginInge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numeroColegiado, dpi, fechaNacimiento, password } = req.body;
    try {
        // Verificar si el usuario existe
        const query = {
            text: `SELECT u.idusuariosistema, u.nombrecompleto, u.email, u.contrasenia, i.idingeniero, u.rolid
            FROM usuariosistema u INNER JOIN ingeniero i ON u.idusuariosistema = i.usuariosistemaid 
            WHERE i.numerocolegiado = $1 AND i.dpi = $2 AND fechanacimiento = $3`,
            values: [numeroColegiado, dpi, fechaNacimiento],
        };
        const respuesta = yield conexion_1.default.query(query);
        const usuario = respuesta.rows[0];
        if (!usuario) {
            res.status(400).json({
                msg: 'Los datos ingresados no son correctos'
            });
            return;
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.contrasenia);
        if (!validPassword) {
            res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
            return;
        }
        // Generar el JWT
        const token = yield generarJWT(usuario.idusuariosistema);
        const nuevoUsuario = {
            nombrecompleto: usuario.nombrecompleto,
            email: usuario.email,
            rolid: usuario.rolid
        };
        res.json({
            usuario: nuevoUsuario,
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servicio'
        });
    }
});
exports.postLoginInge = postLoginInge;
const postLoginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Verificar si el usuario existe
        const query = {
            text: `SELECT idusuariosistema, nombrecompleto, email, contrasenia, rolid
            FROM usuariosistema WHERE email = $1 and rolid = 1;`,
            values: [email],
        };
        const respuesta = yield conexion_1.default.query(query);
        const usuario = respuesta.rows[0];
        console.log(usuario);
        if (!usuario) {
            res.status(400).json({
                msg: 'Los datos ingresados no son correctos'
            });
            return;
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.contrasenia);
        if (!validPassword) {
            res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
            return;
        }
        // Generar el JWT
        const token = yield generarJWT(usuario.idusuariosistema);
        const nuevoUsuario = {
            nombrecompleto: usuario.nombrecompleto,
            email: usuario.email,
            rolid: usuario.rolid
        };
        res.json({
            usuario: nuevoUsuario,
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servicio'
        });
    }
});
exports.postLoginAdmin = postLoginAdmin;
const postRegistrarInge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreCompleto, email, password, numeroColegiado, dpi, fechaNacimiento } = req.body;
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    const passwordEncriptada = bcryptjs.hashSync(password, salt);
    // Guardar en BD
    const query = {
        text: 'SELECT registrar_usuario_ingeniero($1, $2, $3, $4, $5, $6, $7)',
        values: [nombreCompleto, email, passwordEncriptada, '2', numeroColegiado, dpi, fechaNacimiento],
    };
    try {
        const respuesta = yield conexion_1.default.query(query);
        const mensaje = respuesta.rows[0].registrar_usuario_ingeniero;
        if (mensaje.includes("Error:")) {
            res.status(500).json({
                msg: mensaje
            });
        }
        else {
            res.status(201).json({
                msg: "Usuario creado con exito!"
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servicio'
        });
    }
    return;
});
exports.postRegistrarInge = postRegistrarInge;
const postRegistrarAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreCompleto, email, password } = req.body;
    const usuarioExistente = yield conexion_1.default.query('SELECT 1 FROM UsuarioSistema WHERE Email = $1', [email]);
    if (usuarioExistente.rowCount == null || usuarioExistente.rowCount > 0) {
        res.status(400).json({ msg: 'El usuario ya está registrado.' });
        return;
    }
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    const passwordEncriptada = bcryptjs.hashSync(password, salt);
    // Guardar en BD
    const query = {
        text: 'INSERT INTO usuariosistema (nombrecompleto, email, contrasenia, rolid) VALUES($1, $2, $3, $4)',
        values: [nombreCompleto, email, passwordEncriptada, '1'],
    };
    try {
        yield conexion_1.default.query(query);
        res.status(201).json({
            msg: "Usuario creado con exito!"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servicio'
        });
    }
    return;
});
exports.postRegistrarAdmin = postRegistrarAdmin;
const revalidarToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idusuariosistema, nombrecompleto, email, rolid } = req.body.usuario;
    // Generar JWT
    // const token = await generarJWT(idusuariosistema);
    res.status(200).json({
        nombrecompleto, email, rolid
        // token
    });
});
exports.revalidarToken = revalidarToken;
//# sourceMappingURL=usuariosController.js.map