import {financeServer} from './server'
import {Request, Response} from 'express';
import { urlencodedParser,jsonParser } from './backend';


let api : financeServer;
api = new financeServer()




api.app.post("/createReport", jsonParser, function(req: Request, res: Response){
    let userID,income,currentBalence : number
    userID = 0;
    income = parseFloat(req.body.income); 
    currentBalence = parseFloat(req.body.income);


    if( Number.isNaN(userID) || Number.isNaN(income) || Number.isNaN(currentBalence)){
        res.send('Bad Request')

    }
    else{
        api.newBudgetReport(`${userID},${income},${currentBalence},`)
        res.send('ok response') 
    }
    res.end()


    
})


api.app.post("/createTransaction",jsonParser,function(req: Request, res: Response){
    let expense : number
    let transactionDescription : string
    transactionDescription = req.body.transactionDescription
    expense = parseFloat(req.body.expense);


    if( Number.isNaN(expense)){
        res.send('Bad Request')
        console.log(expense)
    }
    else{
        api.newTransaction(`${expense},"${transactionDescription}",`);
        res.sendStatus(204);
    }
    res.end()


})



api.app.get("/monthlyExpenses",function(req: Request, res: Response){
    api.getMonthlyTransactions().then((rows)=>{
        res.end(JSON.stringify(rows))
    })

})


api.app.get("/budgetReport",function(req: Request, res: Response){
    api.getBudgetReport().then((rows)=>{
        res.end(JSON.stringify(rows))
    })

})



//resets Database
api.app.get('/reset',function(req: Request, res: Response){
    api.database.resetDatabase()
    res.send('Database reset subroutine called')
})


//handles bad requests
api.app.get("(/*)",function(req: Request, res: Response){

    const response = {
        message: "No Endpoint exist for the request parameters"
    }

    const jsonContent = JSON.stringify(response);

    res.setHeader('Content-Type', 'application/json');
    res.end(jsonContent)
})



