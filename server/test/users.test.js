import axios from "axios";
import assert from "assert";

describe('Test - Get User', function () {
    it('should get a user', function (done) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/users/9SrBe5zrADcgqpzi3R4eYvShTwf2',
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                assert.ok(response.data.email.includes("wzh412000@gmail.com"), 'User was retrieved successfully');
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});


describe('Test - Get User with non-exist user', function () {
    it('should not get a user', function (done) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/users/Nonexist',
            headers: {}
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


describe('Test - Login', function () {
    it('should return user information', function (done) {
        let data = JSON.stringify({
            "email": "wzh412000@gmail.com",
            "password": "wzh412000"
          });

          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/login',
            headers: { 
              'Content-Type': 'application/json', 
              'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            },
            data : data
          };

        axios.request(config)
            .then((response) => {
                assert.ok(response.data.data.email.includes("wzh412000@gmail.com"), 'User was retrieved successfully');
                assert.ok(response.data.data.id.includes("9SrBe5zrADcgqpzi3R4eYvShTwf2"), 'User was retrieved successfully');
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});

describe('Test - Logout', function () {
    it('should clear user session', function (done) {

        let config = {
            method: 'post',
            url: 'http://localhost:3001/logout',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            }
        };

        axios.request(config)
            .then((response) => {
                assert.equal(response.status, 200, 'User session cleared successfully');
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});

describe('Test - Register', function () {
    it('should not register because user already enrolled', function (done) {

        let data = JSON.stringify({
            email: 'wzh412000@gmail.com',
            username: 'testuser',
            password: 'password123',
            avatar: 'https://example.com/avatar.jpg'
          });

        let config = {
            method: 'post',
            url: 'http://localhost:3001/logout',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            },
            data : data
        };

        axios.request(config)
            .then((response) => {
                done();
            })
            .catch((error) => {
                assert.equal(response.status, 409, 'Correct');
                done(error);
            });
    });
});
