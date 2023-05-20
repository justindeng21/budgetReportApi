
import { Database, Server } from './backend';
import * as Crypto from 'crypto'

export class passwordManager{
    static getRandomString(length : number){
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

    static getHash(saltedPassword : string){
        return Crypto.createHash('md5').update(saltedPassword).digest('hex')
    }


    static getSalt(){
        return passwordManager.getRandomString(12)
    }
}


export class monthlyBudgetTable extends Database{

    createTables(){
        this._query('CREATE TABLE IF NOT EXISTS monthlyBudgetReports(userID int, id mediumint not null auto_increment, income DECIMAL(10,2), currentBalance DECIMAL(6,2), reportDate date,PRIMARY KEY (id));').then(()=>{
            this._query('CREATE TABLE IF NOT EXISTS expenses(id mediumint not null auto_increment, userID int,expense DECIMAL(6,2), transactionDate date, transactionDescription varchar(50), PRIMARY KEY (id));').then(()=>{
                this._query('CREATE TABLE IF NOT EXISTS users(id mediumint not null auto_increment, salt varchar(12), password varchar(32), username varchar(25), PRIMARY KEY (id));')
            })
        })
        
    }

    resetDatabase(){
        this._query('drop table monthlyBudgetReports;').then(()=>{
            this._query('drop table expenses;').then(()=>{
                this._query('drop table users;').then(()=>{
                    this.createTables();
                    return
                })
            })
        })
        
    }

    createReport(values : string){
        var query = 'insert into monthlyBudgetReports(userID, income, currentBalance, reportDate)VALUES (' + values + 'CURDATE());'
        return this._query(query)
    }

    createTransaction(values : string){
        var query = 'insert into expenses(expense, transactionDescription,transactionDate)VALUES (' + values + 'CURDATE());'
        return this._query(query)
    }

    createUser(username : string, password : string){

        let salt = passwordManager.getSalt()
        let hashedSaltedPassword = passwordManager.getHash(password + salt)

        let values = `"${salt}","${hashedSaltedPassword}","${username}"`
        var query = 'insert into users(salt, password, username)VALUES (' + values + ');'
        return this._query(query)
    }

    queryMonthlyTransactions(){
        var datetime = new Date();
        var startDate = new Date(datetime.getFullYear(), datetime.getMonth(), 1).toISOString().slice(0,10)
        var endDate = datetime.toISOString().slice(0,10)

        
        
        var query = 'SELECT * FROM expenses WHERE transactionDate BETWEEN \'' + startDate + ' 00:00:00\''+ ' AND \'' + endDate + ' 23:59:59\';'

        return this._query(query)
    }

    queryBudgetReport(){

        var datetime = new Date();
        var startDate = new Date(datetime.getFullYear(), datetime.getMonth(), 1).toISOString().slice(0,10)
        var endDate = datetime.toISOString().slice(0,10)

        
        
        var query = 'SELECT * FROM monthlybudgetReports WHERE reportDate BETWEEN \'' + startDate + ' 00:00:00\''+ ' AND \'' + endDate + ' 23:59:59\';'

        return this._query(query)

    }


    authenticateUser(username : string, password : string){
        var query =  'SELECT * FROM users WHERE username = ' + `"${username}"` +';'
        return this._query(query)
    }

}





export class financeServer extends Server{
    database : monthlyBudgetTable;

    constructor(){
        super(); //calls parent class constructor
        this.database = new monthlyBudgetTable();
        this.database.createTables()
    }

    
    newBudgetReport(values:string){
        
        this.database.createReport(values)
        

    }

    newTransaction(value : string){
        this.database.createTransaction(value)
    }

    getMonthlyTransactions(){
        return this.database.queryMonthlyTransactions()
        
    }

    getBudgetReport(){
        return this.database.queryBudgetReport()
    }

}









