import { Request, Response } from "express";
import pool from "../db/conexion";
import { InuevoUsuarioAdmin, InuevoUsuarioInge, IpostLoginAdmin, IpostLoginInge, IpostRegistrarAdmin, IpostRegistrarInge, IqueryLoginAdmin, IqueryLoginInge, IusuarioToken } from "../@types/usuarios.types";
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt')



export const getUsuarios = async (req: Request, res: Response) => {
    res.send("Hola");
    return;
}

export const postLoginInge = async (req: Request, res: Response) => {
    const { numeroColegiado, dpi, fechaNacimiento, password }: IpostLoginInge = req.body;

    try {
        // Verificar si el usuario existe
        const query = {
            text: `SELECT u.idusuariosistema, u.nombrecompleto, u.email, u.contrasenia, i.idingeniero, u.rolid
            FROM usuariosistema u INNER JOIN ingeniero i ON u.idusuariosistema = i.usuariosistemaid 
            WHERE i.numerocolegiado = $1 AND i.dpi = $2 AND fechanacimiento = $3`,
            values: [numeroColegiado, dpi, fechaNacimiento],
        }

        const respuesta = await pool.query(query);

        const usuario: IqueryLoginInge = respuesta.rows[0];

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
        const token = await generarJWT(usuario.idusuariosistema);

        const nuevoUsuario: InuevoUsuarioInge = {
            nombrecompleto: usuario.nombrecompleto,
            email: usuario.email,
            rolid: usuario.rolid
        }

        res.json({
            usuario: nuevoUsuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servicio'
        });
    }
}

export const postLoginAdmin = async (req: Request, res: Response) => {
    const { email, password }: IpostLoginAdmin = req.body;

    try {
        // Verificar si el usuario existe
        const query = {
            text: `SELECT idusuariosistema, nombrecompleto, email, contrasenia, rolid
            FROM usuariosistema WHERE email = $1 and rolid = 1;`,
            values: [email],
        }

        const respuesta = await pool.query(query);

        const usuario: IqueryLoginAdmin = respuesta.rows[0];
        console.log(usuario)

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
        const token = await generarJWT(usuario.idusuariosistema);

        const nuevoUsuario: InuevoUsuarioAdmin = {
            nombrecompleto: usuario.nombrecompleto,
            email: usuario.email,
            rolid: usuario.rolid
        }

        res.json({
            usuario: nuevoUsuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servicio'
        });
    }
}

export const postRegistrarInge = async (req: Request, res: Response) => {
    const { nombreCompleto, email, password, numeroColegiado, dpi, fechaNacimiento }: IpostRegistrarInge = req.body;

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    const passwordEncriptada = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    const query = {
        text: 'SELECT registrar_usuario_ingeniero($1, $2, $3, $4, $5, $6, $7)',
        values: [nombreCompleto, email, passwordEncriptada, '2', numeroColegiado, dpi, fechaNacimiento],
    }

    try {
        const respuesta = await pool.query(query);
        const mensaje: string = respuesta.rows[0].registrar_usuario_ingeniero;

        if (mensaje.includes("Error:")) {
            res.status(500).json({
                msg: mensaje
            });
        } else {
            res.status(201).json({
                msg: "Usuario creado con exito!"
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servicio'
        });
    }

    return;
}

export const postRegistrarAdmin = async (req: Request, res: Response) => {
    const { nombreCompleto, email, password }: IpostRegistrarAdmin = req.body;

    const usuarioExistente = await pool.query(
        'SELECT 1 FROM UsuarioSistema WHERE Email = $1',
        [email]
    );

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
    }

    try {
        await pool.query(query);

        res.status(201).json({
            msg: "Usuario creado con exito!"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Ha ocurrido un error en el servicio'
        });
    }

    return;
}


export const revalidarToken = async (req: Request, res: Response) => {

    const { idusuariosistema, nombrecompleto, email, rolid }: IusuarioToken = req.body.usuario;

    // Generar JWT
    // const token = await generarJWT(idusuariosistema);

    res.status(200).json({
        nombrecompleto, email, rolid
        // token
    })
}
