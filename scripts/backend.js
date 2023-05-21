"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlencodedParser = exports.jsonParser = exports.Server = exports.Database = void 0;
const mysql_1 = __importDefault(require("mysql"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
class Database {
    constructor() {
        this.connection = mysql_1.default.createConnection({
            host: process.env.HOST || '127.0.0.1',
            port: 3306,
            user: process.env.USER || 'root',
            password: process.env.PASSWORD || 'Kenyalove817678!',
            database: process.env.DATABASE || 'test'
        });
        this.connection.connect(function (err) {
            if (err)
                throw err;
            console.log("Connected!");
        });
    }
    _query(query_) {
        return new Promise((resolve, reject) => {
            this.connection.query(query_, (err, rows) => {
                return err ? reject(err) : resolve(rows);
            });
        });
    }
}
exports.Database = Database;
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*"); //"https://budgetreportv2.herokuapp.com");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            next();
        });
        this.server = this.app.listen(process.env.PORT || 3400, () => console.log("server running"));
    }
    _closeServer() {
        this.server.close();
    }
}
exports.Server = Server;
exports.jsonParser = body_parser_1.default.json();
exports.urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
