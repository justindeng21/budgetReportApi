import requests
import os
import numpy as np


os.environ['NO_PROXY'] = '127.0.0.1'
header = {
    'Content-Type':'application/json'
}

 

#url = 'https://budgetreportapi.herokuapp.com'


url = 'http://localhost:3400'

response = requests.get(url+'/reset',headers=header)


response = requests.post(url+'/createUser',headers=header,json={
    'token':'c0b4344b64f7462ad999db7e1f483a9e',
    'username' : 'justin',
    'password' : 'password123'
})




