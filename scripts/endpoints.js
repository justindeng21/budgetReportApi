"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const backend_1 = require("./backend");
let api;
api = new server_1.financeServer();
api.app.post("/createReport", backend_1.jsonParser, function (req, res) {
    let userID, income, currentBalence;
    userID = 0;
    income = parseFloat(req.body.income);
    currentBalence = parseFloat(req.body.income);
    if (Number.isNaN(userID) || Number.isNaN(income) || Number.isNaN(currentBalence)) {
        res.send('Bad Request');
    }
    else {
        api.newBudgetReport(`${userID},${income},${currentBalence},`);
        res.send('ok response');
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
//resets Database
api.app.get('/reset', function (req, res) {
    api.database.resetDatabase();
    res.send('Database reset subroutine called');
});
//handles bad requests
api.app.get("(/*)", function (req, res) {
    const response = {
        message: "No Endpoint exist for the request parameters"
    };
    const jsonContent = JSON.stringify(response);
    res.setHeader('Content-Type', 'application/json');
    res.end(jsonContent);
});
