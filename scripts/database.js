"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mysql_1 = __importDefault(require("mysql"));
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
            this.connection.query(query_, (err, res) => {
                return err ? reject(err) : resolve(res);
            });
        });
    }
}
exports.Database = Database;
