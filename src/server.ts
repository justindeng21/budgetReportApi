
import { Database, Server } from './backend';




export class monthlyBudgetTable extends Database{

    createTables(){
        this._query('CREATE TABLE IF NOT EXISTS monthlyBudgetReports(userID int, id mediumint not null auto_increment, income DECIMAL(10,2), currentBalance DECIMAL(6,2), reportDate date,PRIMARY KEY (id));').then(()=>{
            this._query('CREATE TABLE IF NOT EXISTS expenses(id mediumint not null auto_increment, expense DECIMAL(6,2), transactionDate date, transactionDescription varchar(50), PRIMARY KEY (id));')
            return
        })
        
    }

    resetDatabase(){
        this._query('drop table monthlyBudgetReports;').then(()=>{
            this._query('drop table expenses;').then(()=>{
                this.createTables();
                return
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

    getMonthlyTransactions(){
        var datetime = new Date();
        var startDate = new Date(datetime.getFullYear(), datetime.getMonth(), 1).toISOString().slice(0,10)
        var endDate = datetime.toISOString().slice(0,10)

        
        
        var query = 'SELECT * FROM expenses WHERE transactionDate BETWEEN \'' + startDate + ' 00:00:00\''+ ' AND \'' + endDate + ' 23:59:59\';'

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
        return this.database.getMonthlyTransactions()
        
    }

}


