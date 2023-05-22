import {financeServer, passwordManager} from './server'
import {Request, Response} from 'express';
import { urlencodedParser,jsonParser } from './backend';



let api : financeServer;
api = new financeServer()

let masterkey = passwordManager.getHash(passwordManager.getRandomString(10))

interface userKeyDict  {
    [key : string] : string
}

const userKeys : userKeyDict = {};



function validateToken(authtoken : string){
    let userKey = passwordManager.getHash(masterkey + authtoken);
    try{
        return userKeys[userKey]
    }
    catch{
        return 'invalidToken'
    }
    
}


api.app.post("/createReport", jsonParser, function(req: Request, res: Response){
    let authToken = req.headers.cookie?.split('=')
    let income = parseFloat(req.body.income); 
    let currentBalence = parseFloat(req.body.income);


    if( Number.isNaN(income) || Number.isNaN(currentBalence)){
        res.send('Bad Request')

    }
    else if(authToken !== undefined){
        
        api.newBudgetReport(`${validateToken(authToken[1])},${income},${currentBalence},`)
        res.sendStatus(204);
    }
    res.end()


    
})


api.app.post("/createTransaction",jsonParser,function(req: Request, res: Response){
    let authToken = req.headers.cookie?.split('=')
    let transactionDescription = req.body.transactionDescription
    let expense = parseFloat(req.body.expense);


    if( Number.isNaN(expense)){
        res.send('Bad Request')
        console.log(expense)
    }
    else if(authToken !== undefined){
        api.newTransaction(`${validateToken(authToken[1])},${expense},"${transactionDescription}",`);
        res.sendStatus(204);
    }
    res.end()
})



api.app.get("/validateToken",function(req: Request, res: Response){
    let authToken = req.headers.cookie?.split('=')

    console.log(authToken)
    if(authToken === undefined){
        res.send(400)   
    }
    if(authToken !== undefined && validateToken(authToken[1]) === 'invalidToken'){
        res.send(400)
    }
    else{
        res.send(200)
    }


})




api.app.get("/monthlyExpenses",function(req: Request, res: Response){
    let authToken = req.headers.cookie?.split('=')
    if(authToken !== undefined){
        api.getMonthlyTransactions(validateToken(authToken[1])).then((rows)=>{
            res.end(JSON.stringify(rows))
        })
    }

})


api.app.get("/budgetReport",function(req: Request, res: Response){
    let authToken = req.headers.cookie?.split('=')
    if(authToken !== undefined){
        api.getBudgetReport(validateToken(authToken[1])).then((rows)=>{
            res.end(JSON.stringify(rows))
        })
    }

})




api.app.get('/reset',function(req: Request, res: Response){
    api.database.resetDatabase()
    res.send('Database reset subroutine called')
})




api.app.post("/createUser",jsonParser,function(req: Request, res: Response){

    let token = req.body.token
    let username = req.body.username;
    let password = req.body.password;
    if(token != 'c0b4344b64f7462ad999db7e1f483a9e'){
        res.sendStatus(400)
    }

    else{
        api.database.createUser(username,password);
        res.sendStatus(204);
    }

})

api.app.post("/importExpenses",jsonParser,function(req: Request, res: Response){
    let data = JSON.parse(req.body.data)
    let values = ''

    console.log(data)
    //for(var i = 0; i < data.length;i++){
    //    var date = data[i]['date'].split('-')
    //    var parsedDate = new Date(date[2], date[0]-1, date[1])
    //    values += `(1,'${parsedDate.toISOString().slice(0,10)} 00:00:00','${data[i]['value']}','${data[i]['description'].replace('\'','_')}')`
    //    if(i != data.length-1){
    //        values += ','
    //    }
    //}

    //api.import(values)
    


    res.sendStatus(204);
    

})




api.app.post("/auth",jsonParser,function(req: Request, res: Response){

    let username = req.body.username;
    let password = req.body.password;

    api.database.authenticateUser(username).then((rows : any )=>{
        var result = rows
        let saltedPassword = password + result[0]['salt']

        if(passwordManager.getHash(saltedPassword) == result[0]['password']){
            let userAuthtoken = passwordManager.getHash(passwordManager.getRandomString(10));
            let userSecretString = passwordManager.getHash(masterkey + userAuthtoken);
            userKeys[userSecretString] = result[0]['id'];
            res.setHeader("Set-Cookie",['budgetReportAuth=' + userAuthtoken+';SameSite=None;Secure;']);
            res.sendStatus(204)
        }
        else{
            res.cookie('validated','false')
            res.sendStatus(400);
        }
    })

})



api.app.get("(/*)",function(req: Request, res: Response){

    const response = {
        message: "No Endpoint exist for the request parameters"
    }

    const jsonContent = JSON.stringify(response);

    res.setHeader('Content-Type', 'application/json');
    res.end(jsonContent)
})








