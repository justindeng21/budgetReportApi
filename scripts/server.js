"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.financeServer = exports.monthlyBudgetTable = exports.passwordManager = void 0;
const backend_1 = require("./backend");
const Crypto = __importStar(require("crypto"));
class passwordManager {
    static getRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    static getHash(saltedPassword) {
        return Crypto.createHash('md5').update(saltedPassword).digest('hex');
    }
    static getSalt() {
        return passwordManager.getRandomString(12);
    }
}
exports.passwordManager = passwordManager;
class monthlyBudgetTable extends backend_1.Database {
    createTables() {
        this._query('CREATE TABLE IF NOT EXISTS monthlyBudgetReports(userID int, id mediumint not null auto_increment, income DECIMAL(10,2), currentBalance DECIMAL(6,2), reportDate date,PRIMARY KEY (id));').then(() => {
            this._query('CREATE TABLE IF NOT EXISTS expenses(id mediumint not null auto_increment, userID int,expense DECIMAL(6,2), transactionDate date, transactionDescription varchar(50), PRIMARY KEY (id));').then(() => {
                this._query('CREATE TABLE IF NOT EXISTS users(id mediumint not null auto_increment, salt varchar(12), password varchar(32), username varchar(25), PRIMARY KEY (id));');
            });
        });
    }
    resetDatabase() {
        this._query('drop table monthlyBudgetReports;').then(() => {
            this._query('drop table expenses;').then(() => {
                this._query('drop table users;').then(() => {
                    this.createTables();
                    return;
                });
            });
        });
    }
    createReport(values) {
        var query = 'insert into monthlyBudgetReports(userID, income, currentBalance, reportDate)VALUES (' + values + 'CURDATE());';
        return this._query(query);
    }
    createTransaction(values) {
        var query = 'insert into expenses(userID,expense, transactionDescription,transactionDate)VALUES (' + values + 'CURDATE());';
        return this._query(query);
    }
    createUser(username, password) {
        let salt = passwordManager.getSalt();
        let hashedSaltedPassword = passwordManager.getHash(password + salt);
        let values = `"${salt}","${hashedSaltedPassword}","${username}"`;
        var query = 'insert into users(salt, password, username)VALUES (' + values + ');';
        return this._query(query);
    }
    queryMonthlyTransactions() {
        var datetime = new Date();
        var startDate = new Date(datetime.getFullYear(), datetime.getMonth(), 1).toISOString().slice(0, 10);
        var endDate = datetime.toISOString().slice(0, 10);
        var query = 'SELECT * FROM expenses WHERE transactionDate BETWEEN \'' + startDate + ' 00:00:00\'' + ' AND \'' + endDate + ' 23:59:59\';';
        return this._query(query);
    }
    queryBudgetReport() {
        var datetime = new Date();
        var startDate = new Date(datetime.getFullYear(), datetime.getMonth(), 1).toISOString().slice(0, 10);
        var endDate = datetime.toISOString().slice(0, 10);
        var query = 'SELECT * FROM monthlybudgetReports WHERE reportDate BETWEEN \'' + startDate + ' 00:00:00\'' + ' AND \'' + endDate + ' 23:59:59\';';
        return this._query(query);
    }
    authenticateUser(username) {
        var query = 'SELECT * FROM users WHERE username = ' + `"${username}"` + ';';
        return this._query(query);
    }
}
exports.monthlyBudgetTable = monthlyBudgetTable;
class financeServer extends backend_1.Server {
    constructor() {
        super(); //calls parent class constructor
        this.database = new monthlyBudgetTable();
        this.database.createTables();
    }
    newBudgetReport(values) {
        this.database.createReport(values);
    }
    newTransaction(value) {
        this.database.createTransaction(value);
    }
    getMonthlyTransactions() {
        return this.database.queryMonthlyTransactions();
    }
    getBudgetReport() {
        return this.database.queryBudgetReport();
    }
}
exports.financeServer = financeServer;
