/*
* Test the market API and also the database 
*/

import axios from "axios";
import assert from "assert";

describe('Test - Get All Perks', function () {
    it('should get all perks', function (done) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/perks',
            headers: {}
        };


        axios.request(config)
            .then((response) => {
                const perk1 = response.data.find(p => p.perkname === 'Scribbler');
				assert.ok(perk1.perkname.includes('Scribbler'), 'Found the Scribbler');
                done();
            })
            .catch((error) => {
                done(error); 
            });
    });
});

describe('Test - Get Perk', function () {
    it('should get perk based on ID', function (done) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/perks/6cICAsduVYRWkxRKPvPE',
            headers: { }
        };


        axios.request(config)
            .then((response) => {
				assert.ok(response.data.perkname.includes('Scribbler'), 'Found the Scribbler');
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});

describe('Test - Get Perk non-exist', function () {
    it('should get perk based on non exist ID', function (done) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/perks/Nonexist',
            headers: { }
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

