import requests
import os
import numpy as np


os.environ['NO_PROXY'] = '127.0.0.1'
header = {
    'Content-Type':'application/json'
}


url = 'http://localhost:3400/auth'

response = requests.get(url,headers=header,json={
    #'token':'c0b4344b64f7462ad999db7e1f483a9e',
    'username' : 'raiinykush',
    'password' : 'Kenyalove817678!'
})
print(response.status_code)


