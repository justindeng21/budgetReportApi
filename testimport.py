import requests
import os
import pandas
import unittest




url = 'http://localhost:3400'
os.environ['NO_PROXY'] = '127.0.0.1'

header = {
    'Content-Type':'application/json'
}

transactions = pandas.read_csv('data/creditTransactions.csv')  




class testImport(unittest.TestCase):

    def test_import(self):

        response = requests.post(url+'/importExpenses',json={'data': transactions.to_json(orient="records")},headers=header)

        self.assertEqual(response.status_code, 204)

if __name__ == '__main__':
    unittest.main()




