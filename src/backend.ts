import mysql,{Connection} from 'mysql';

import express,{Application} from 'express';
import bodyParser from 'body-parser';


export class Database{
    connection : Connection;
    constructor(){

        this.connection = mysql.createConnection({
            host: process.env.HOST || '127.0.0.1',
            port: 3306,
            user: process.env.USER || 'root',
            password: process.env.PASSWORD || 'Kenyalove817678!',
            database: process.env.DATABASE || 'test'
        });
        
        this.connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
        
    }

    _query(query_:string){
        return new Promise((resolve,reject) => {
            this.connection.query(query_, (err,rows)=>{
                return err ? reject(err) : resolve(rows);
            })
        })

    }

}


export class Server{
    app : Application;

    
    server : any;
    constructor(){
        
        this.app  = express();

        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "https://budgetreportv2.herokuapp.com");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            next();
          });

        this.server = this.app.listen(process.env.PORT || 3400, () => console.log("server running"));
    }

    _closeServer(){  
       this.server.close()
    }

}

export var jsonParser = bodyParser.json()
export var urlencodedParser = bodyParser.urlencoded({ extended: false })

