import requests
import os
import numpy as np
import unittest




domain = 'http://127.0.0.1:3400'
os.environ['NO_PROXY'] = '127.0.0.1'
requests.get(domain + '/reset')


vals = np.random.randint(1,7,size=6)
vals2 = np.random.randint(1,7,size=6)



extract_url = domain + '/extract/data/r1,r2,r3,r4,r5,r6'
collect_url_1 = domain + '/collect'+ '/' + str(vals[0]) + '/' + str(vals[1]) + '/' + str(vals[2]) + '/' + str(vals[3]) + '/' + str(vals[4]) + '/' + str(vals[5])
collect_url_2 = domain + '/collect'+ '/' + str(vals2[0]) + '/' + str(vals2[1]) + '/' + str(vals2[2]) + '/' + str(vals2[3]) + '/' + str(vals2[4]) + '/' + str(vals2[5])


solution = {"r1":vals[0],"r2":vals[1],"r3":vals[2],"r4":vals[3],"r5":vals[4],"r6":vals[5]}
solution2 = {"r1":vals2[0],"r2":vals2[1],"r3":vals2[2],"r4":vals2[3],"r5":vals2[4],"r6":vals2[5]}

json = [solution2,solution]

class testEndpoints(unittest.TestCase):

    
    def test_collectEnpointStatusCode(self):
        request = requests.post(collect_url_1)
        self.assertEqual(request.status_code,200, 'Response Not 200')
        return
    
    def test_extractEndpointStatusCode(self):
        request = requests.get(extract_url)
        self.assertEqual(request.status_code,200, 'Response Not 200')
        return
    
    def test_collectEndpoint_data(self):
        collect_request = requests.post(collect_url_2)
        extract_request = requests.get(extract_url)
        data = extract_request.json()
        self.assertEqual(collect_request.status_code,200,'Request to Collector Endpoint was not 200')
        self.assertEqual(extract_request.status_code,200,'Request to fetch Endpoint was not 200')
        self.assertEqual(data[0],solution2, 'Value for column, r1, was not 1')
        return
    
    def test_extractEndPoint(self):
        endpoint = '/extract/data/r1,r2,r3,r4,r5,r6'
        url = domain + endpoint
        request = requests.get(url)
        data = request.json()
        self.assertEqual(data,json, 'Data does not match')
        return
     
     

if __name__ == '__main__':
    unittest.main()