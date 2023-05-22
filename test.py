import requests
import os

import pandas


os.environ['NO_PROXY'] = '127.0.0.1'
header = {
    'Content-Type':'application/json'
}

 

#url = 'https://budgetreportapi.herokuapp.com'
url = 'http://localhost:3400'
#response = requests.get(url+'/reset',headers=header)


response = requests.post(url+'/createUser',headers=header,json={
    'token':'c0b4344b64f7462ad999db7e1f483a9e',
    'username' : 'justin',
    'password' : 'password123'
})


#transactions = pandas.read_csv('data/creditTransactions.csv')  

#print(transactions.to_json(orient="records"))
#response = requests.post(url+'/importExpenses',json={'data': transactions.to_json(orient="records")},headers=header)
