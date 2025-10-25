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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const conexion_1 = __importDefault(require("../db/conexion"));
const usuarios_routes_1 = __importDefault(require("../routes/usuarios.routes"));
const campanias_routes_1 = __importDefault(require("../routes/campanias.routes"));
const candidatos_routes_1 = __importDefault(require("../routes/candidatos.routes"));
const votos_routes_1 = __importDefault(require("../routes/votos.routes"));
class Server {
    constructor() {
        this.apiPaths = {
            usuarios: '/api/usuarios',
            campanias: '/api/campanias',
            candidatos: '/api/candidatos',
            votos: '/api/votos',
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8080';
        this.middlewares();
        // Definir las rutas de la api
        this.rutas();
        this.dbConexion();
    }
    dbConexion() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                conexion_1.default;
                console.log('Conexion con base de datos');
            }
            catch (error) {
                console.log('Ha ocurrido un error en base de datos: ' + error);
            }
        });
    }
    middlewares() {
        //CORS
        this.app.use((0, cors_1.default)());
        //Lectura del body
        this.app.use(express_1.default.json());
        //Carpeta publica
        this.app.use(express_1.default.static('public'));
    }
    rutas() {
        this.app.use(this.apiPaths.usuarios, usuarios_routes_1.default);
        this.app.use(this.apiPaths.campanias, campanias_routes_1.default);
        this.app.use(this.apiPaths.candidatos, candidatos_routes_1.default);
        this.app.use(this.apiPaths.votos, votos_routes_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en http://localhost:' + this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map