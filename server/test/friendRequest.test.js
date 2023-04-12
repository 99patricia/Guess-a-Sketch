import axios from "axios";
import assert from "assert";

describe('Test - Get Request when someone send to you', function () {
    it('should get all current request', function (done) {
        let data = '';

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/friend_requests/9SrBe5zrADcgqpzi3R4eYvShTwf2',
            headers: {
                'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            },
            data: data
        };
        axios.request(config)
            .then((response) => {
                const data_pice = response.data.find(p => p.request_id === 'xIWcqMZleQOBShZA4Xat');
                assert.ok(data_pice.sender_id.includes("PNMwIuf0V3V2E8wrcmlupIj1Nkf1"), 'Sender ID is correct');
                assert.ok(data_pice.recipient_id.includes("9SrBe5zrADcgqpzi3R4eYvShTwf2"), 'Recipient ID is correct');
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});

describe('Test - Get Request with wrong user ID', function () {
    it('should get error', function (done) {
        let data = '';

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/friend_requests/WrongID',
            headers: {
                'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            },
            data: data
        };
        axios.request(config)
            .then((response) => {
                done();
            })
            .catch((error) => {
                assert.ok(error.response.status == 404, 'Correct');
                done(error);
            });
    });
});


describe('Test - Accept the friend request', function () {
    it('should update the request status and add ID to the friend list', function (done) {
        let data = JSON.stringify({
            "request_id": "xIWcqMZleQOBShZA4Xat",
            "sender_id": "PNMwIuf0V3V2E8wrcmlupIj1Nkf1",
            "recipient_id": "9SrBe5zrADcgqpzi3R4eYvShTwf2"
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/friend_request/accept',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {

                let config_request = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/friend_requests/9SrBe5zrADcgqpzi3R4eYvShTwf2',
                    headers: {
                        'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
                    },
                    data: data
                };
                axios.request(config_request)
                    .then((response) => {
                        const data_pice = response.data.find(p => p.request_id === 'xIWcqMZleQOBShZA4Xat');
                        assert.ok(data_pice.status.includes("accepted"), 'Status is OK');
                    })
                    .catch((error) => {});

                let config_sender = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/users/' + 'PNMwIuf0V3V2E8wrcmlupIj1Nkf1',
                    headers: {
                        'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
                    }
                };

                axios.request(config_sender)
                    .then((response) => {
                        assert.ok(response.data.friendList.includes('9SrBe5zrADcgqpzi3R4eYvShTwf2'), 'Sender add the Receiver');
                    })
                    .catch((error) => {});

                let config_receiver = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/users/' + '9SrBe5zrADcgqpzi3R4eYvShTwf2',
                    headers: {
                        'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
                    }
                };

                axios.request(config_receiver)
                    .then((response) => {
                        assert.ok(response.data.friendList.includes('PNMwIuf0V3V2E8wrcmlupIj1Nkf1'), 'Receiver add the Sender');

                    })
                    .catch((error) => {});

                let config_delete1 = {
                    method: 'delete',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/deletefriends/9SrBe5zrADcgqpzi3R4eYvShTwf2/PNMwIuf0V3V2E8wrcmlupIj1Nkf1',
                    headers: {
                        'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
                    }
                };

                axios.request(config_delete1)
                    .then((response) => {})
                    .catch((error) => {
                        console.log(error);
                    });

                let config_delete2 = {
                    method: 'delete',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/deletefriends/PNMwIuf0V3V2E8wrcmlupIj1Nkf1/9SrBe5zrADcgqpzi3R4eYvShTwf2',
                    headers: {
                        'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
                    }
                };

                axios.request(config_delete2)
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


describe('Test - Reject the friend request', function () {
    it('should update the request status', function (done) {
        let data = JSON.stringify({
            "request_id": "xIWcqMZleQOBShZA4Xat"
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/friend_request/reject',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {

                let config_request = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/friend_requests/9SrBe5zrADcgqpzi3R4eYvShTwf2',
                    headers: {
                        'Cookie': 'token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ijg3YzFlN2Y4MDAzNGJiYzgxYjhmMmRiODM3OTIxZjRiZDI4N2YxZGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZWNlNDkzLWNhcHN0b25lIiwiYXVkIjoiZWNlNDkzLWNhcHN0b25lIiwiYXV0aF90aW1lIjoxNjgwNDcxMDA0LCJ1c2VyX2lkIjoiOVNyQmU1enJBRGNncXB6aTNSNGVZdlNoVHdmMiIsInN1YiI6IjlTckJlNXpyQURjZ3FwemkzUjRlWXZTaFR3ZjIiLCJpYXQiOjE2ODA0NzEwMDQsImV4cCI6MTY4MDQ3NDYwNCwiZW1haWwiOiJ3emg0MTIwMDBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid3poNDEyMDAwQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.m-mPKNgM1Cdz_IEFcGqSh9AkZdecMQMRTp9o44ZbSrG73sAxzl9llpWlPEpaebtN0fhmyXPnynUID7quJrrq2mJdyO9qvBAYbOW5Sbck5XbIIG2n9TqeDDWYjCWWZHOf691vM65glLkoBNhLejohVB3unJG1Ircp2_AH14HS7Zy8QRQ_RnLK0DB9hIj8XffoLP7uf59C8LUh5XjrAeLVNEUBObJsxrB1ob2kjhZu1YAeyZA7oJvSlyGv7f7ppScSUXi2TkDILPdPp0TNZd6r4yz6PE0pdRQbk1ftGCG99nd8RxdDz2VAfBDEcecrX3Djk9XnBd00MCdeZwONQgZOmw'
                    },
                    data: data
                };
                axios.request(config_request)
                    .then((response) => {
                        const data_pice = response.data.find(p => p.request_id === 'xIWcqMZleQOBShZA4Xat');
                        assert.ok(data_pice.status.includes("reject"), 'Status is OK');
                    })
                    .catch((error) => {});

                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});



describe('Test - Handle friend request', function () {
    it('should send a request from Test1 to Test2', function (done) {
        let data = JSON.stringify({
            "sender_id": "PNMwIuf0V3V2E8wrcmlupIj1Nkf1",
            "recipient_username": "Test1",
            "status": "pending",
            "direction": "outgoing"
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/friend_request',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {

                assert.ok(response.data.friendRequestData.sender_id.includes("PNMwIuf0V3V2E8wrcmlupIj1Nkf1"), 'Sender ID is correct');
                assert.ok(response.data.friendRequestData.recipient_id.includes("9SrBe5zrADcgqpzi3R4eYvShTwf2"), 'Receiver ID is correct');
                assert.ok(response.data.friendRequestData.status.includes("pending"), 'Status is correct');

                let data1 = JSON.stringify({
                    "request_id": response.data.friendRequestData.request_id
                });

                let config1 = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/friend_request/delete',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data1
                };

                axios.request(config1)
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