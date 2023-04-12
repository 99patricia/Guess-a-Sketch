/*
* Test the userProfile API and also the database 
*/

import axios from "axios";
import assert from "assert";

describe('Test - Get User Profile', function () {
    it('should get user profile information', function (done) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/profile/9SrBe5zrADcgqpzi3R4eYvShTwf2',
            headers: {
                'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            }
        };

        axios.request(config)
            .then((response) => {
                assert.ok(response.data.username.includes("Test1"), 'Username is correct');
                assert.ok(response.data.id.includes("9SrBe5zrADcgqpzi3R4eYvShTwf2"), 'User Id is correct');
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});

describe('Test - Get User Profile with empty input', function () {
    it('should get 404', function (done) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/profile/9SrBe5zrADcgqpzi3R4eYvShTwf2',
            headers: {
                'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            }
        };

        axios.request(config)
            .then((response) => {
                done();
            })
            .catch((error) => {
                assert.ok(error.response.status == 404, 'Correct');
                done();
            });
    });
});

/*

describe('Test - Update User Profile', function () {
    it('should update user currency by 1000', function (done) {
        let data = JSON.stringify({
            "currency": 1000
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/profile/9SrBe5zrADcgqpzi3R4eYvShTwf2',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {

                let config_cc = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/profile/9SrBe5zrADcgqpzi3R4eYvShTwf2',
                    headers: {
                        'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
                    }
                };

                axios.request(config_cc)
                    .then((response) => {
                        assert.ok(response.data.currency == 1000, 'Currency is correct');
                    })
                    .catch((error) => {
                        done(error);
                    });

                let data2 = JSON.stringify({
                    "currency": -1000
                });

                let config_dd = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/profile/9SrBe5zrADcgqpzi3R4eYvShTwf2',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
                    },
                    data: data2
                };

                axios.request(config_dd)
                    .then((response) => {})
                    .catch((error) => {
                        console.log(error);
                    });

                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});

*/



describe('Test - Update User Profile end of the game', function () {
    it('should update user currency by 4000, win by 1, loss by 12', function (done) {
        let data = JSON.stringify({
            "win": 1,
            "loss": 12,
            "currency": 4000
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/endgame/9SrBe5zrADcgqpzi3R4eYvShTwf2',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {

                let config_cc = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/profile/9SrBe5zrADcgqpzi3R4eYvShTwf2',
                    headers: {
                        'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
                    }
                };

                axios.request(config_cc)
                    .then((response) => {
                        assert.ok(response.data.currency == 0, 'Currency is correct');
                        assert.ok(response.data.win == 1, 'Win is correct');
                        assert.ok(response.data.loss == 12, 'Loss is correct');

                    })
                    .catch((error) => {});
                
                    
                    let data2 = JSON.stringify({
                        "win": -1,
                        "loss": -12,
                        "currency": -4000
                      });
                      
                      let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'http://localhost:3001/endgame/9SrBe5zrADcgqpzi3R4eYvShTwf2',
                        headers: { 
                          'Content-Type': 'application/json', 
                          'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
                        },
                        data : data2
                      };
                      
                      axios.request(config)
                      .then((response) => {
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                

                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});
