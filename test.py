import requests
import os
import numpy as np
import unittest


header = {
    'Content-Type':'application/json'
}

domain = 'https://budgetreportapi.herokuapp.com'

url = domain + '/createTransaction'

response = requests.post(url,headers=header,json={
    'expense' : '759.99',
    'transactionDescription' : 'Credit Card Payment'
})
print(response.status_code)


url = domain + '/createReport'

response = requests.post(url,headers=header,json={
    'income' : '1443.46'
})

print(response.status_code)
header = {
    'Content-Type':'application/json'
}

url = domain + '/createUser'

response = requests.post(url,headers=header,json={
    'username' : 'raiinykush',
    'password' : 'Kenyalove817678!',
    'token': 'c0b4344b64f7462ad999db7e1f483a9e'
})
print(response.status_code)




url = domain + '/auth'

response = requests.post(url,headers=header,json={
    'username' : 'raiinykush',
    'password' : 'Kenyalove817678!'
})
print(response.status_code)

