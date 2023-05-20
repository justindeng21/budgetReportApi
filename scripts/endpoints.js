"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const backend_1 = require("./backend");
let api;
api = new server_1.financeServer();
let masterkey = server_1.passwordManager.getHash(server_1.passwordManager.getRandomString(10));
const userKeys = {};
api.app.post("/createReport", backend_1.jsonParser, function (req, res) {
    let userID, income, currentBalence;
    userID = 1;
    income = parseFloat(req.body.income);
    currentBalence = parseFloat(req.body.income);
    if (Number.isNaN(userID) || Number.isNaN(income) || Number.isNaN(currentBalence)) {
        res.send('Bad Request');
    }
    else {
        api.newBudgetReport(`${userID},${income},${currentBalence},`);
        res.sendStatus(204);
    }
    res.end();
});
api.app.post("/createTransaction", backend_1.jsonParser, function (req, res) {
    let expense;
    let transactionDescription;
    transactionDescription = req.body.transactionDescription;
    expense = parseFloat(req.body.expense);
    if (Number.isNaN(expense)) {
        res.send('Bad Request');
        console.log(expense);
    }
    else {
        api.newTransaction(`${expense},"${transactionDescription}",`);
        res.sendStatus(204);
    }
    res.end();
});
api.app.get("/monthlyExpenses", function (req, res) {
    api.getMonthlyTransactions().then((rows) => {
        res.end(JSON.stringify(rows));
    });
});
api.app.get("/budgetReport", function (req, res) {
    api.getBudgetReport().then((rows) => {
        res.end(JSON.stringify(rows));
    });
});
api.app.get('/reset', function (req, res) {
    api.database.resetDatabase();
    res.send('Database reset subroutine called');
});
api.app.post("/createUser", backend_1.jsonParser, function (req, res) {
    let token = req.body.token;
    let username = req.body.username;
    let password = req.body.password;
    if (token != 'c0b4344b64f7462ad999db7e1f483a9e') {
        res.sendStatus(400);
    }
    else {
        api.database.createUser(username, password);
        res.sendStatus(204);
    }
});
api.app.post("/auth", backend_1.jsonParser, function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    api.database.authenticateUser(username, password).then((rows) => {
        var result = rows;
        let saltedPassword = password + result[0]['salt'];
        if (server_1.passwordManager.getHash(saltedPassword) == result[0]['password']) {
            let userAuthtoken = server_1.passwordManager.getHash(server_1.passwordManager.getRandomString(10));
            let userSecretString = server_1.passwordManager.getHash(masterkey + userAuthtoken);
            userKeys[userAuthtoken] = userSecretString;
            res.setHeader("Access-Control-Allow-Origin", "https://budgetreportv2.herokuapp.com");
            res.setHeader("Set-Cookie", ["validated=true;SameSite=None;Secure", 'budgetReportAuth=' + userAuthtoken + ';SameSite=None;Secure;']);
            res.redirect(307, 'https://budgetreportv2.herokuapp.com/reportingtool');
        }
        else {
            res.cookie('validated', 'false');
            res.sendStatus(400);
        }
    });
});
api.app.get("(/*)", function (req, res) {
    const response = {
        message: "No Endpoint exist for the request parameters"
    };
    const jsonContent = JSON.stringify(response);
    res.setHeader('Content-Type', 'application/json');
    res.end(jsonContent);
});
