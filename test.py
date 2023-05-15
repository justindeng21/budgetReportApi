import requests
import os
import numpy as np
import unittest
os.environ['NO_PROXY'] = '127.0.0.1'
header = {
    'Content-Type':'application/json'
}


url = 'https://budgetreportapi.herokuapp.com/auth'

response = requests.post(url,headers=header,json={
    'username' : 'raiinykush',
    'password' : 'Kenydsfa7678!'
})
print(response.status_code)

