"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlencodedParser = exports.jsonParser = exports.Server = exports.Database = void 0;
const mysql_1 = __importDefault(require("mysql"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const port = process.env.PORT || 3400;
class Database {
    constructor() {
        this.connection = mysql_1.default.createConnection({
            host: "127.0.0.1",
            port: 3306,
            user: "root",
            password: 'Kenyalove817678!',
            database: 'test'
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
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.server = this.app.listen(port, () => console.log("server running"));
    }
    _closeServer() {
        this.server.close();
    }
}
exports.Server = Server;
exports.jsonParser = body_parser_1.default.json();
exports.urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
