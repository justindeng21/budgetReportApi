"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.financeServer = exports.monthlyBudgetTable = void 0;
const backend_1 = require("./backend");
class monthlyBudgetTable extends backend_1.Database {
    createTables() {
        this._query('CREATE TABLE IF NOT EXISTS monthlyBudgetReports(userID int, id mediumint not null auto_increment, income DECIMAL(10,2), currentBalance DECIMAL(6,2), reportDate date,PRIMARY KEY (id));').then(() => {
            this._query('CREATE TABLE IF NOT EXISTS expenses(id mediumint not null auto_increment, expense DECIMAL(6,2), transactionDate date, transactionDescription varchar(50), PRIMARY KEY (id));');
            return;
        });
    }
    resetDatabase() {
        this._query('drop table monthlyBudgetReports;').then(() => {
            this._query('drop table expenses;').then(() => {
                this.createTables();
                return;
            });
        });
    }
    createReport(values) {
        var query = 'insert into monthlyBudgetReports(userID, income, currentBalance, reportDate)VALUES (' + values + 'CURDATE());';
        return this._query(query);
    }
    createTransaction(values) {
        var query = 'insert into expenses(expense, transactionDescription,transactionDate)VALUES (' + values + 'CURDATE());';
        return this._query(query);
    }
    getMonthlyTransactions() {
        var datetime = new Date();
        var startDate = new Date(datetime.getFullYear(), datetime.getMonth(), 1).toISOString().slice(0, 10);
        var endDate = datetime.toISOString().slice(0, 10);
        var query = 'SELECT * FROM expenses WHERE transactionDate BETWEEN \'' + startDate + ' 00:00:00\'' + ' AND \'' + endDate + ' 23:59:59\';';
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
        return this.database.getMonthlyTransactions();
    }
}
exports.financeServer = financeServer;
