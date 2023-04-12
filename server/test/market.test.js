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


describe('Test - create Perk', function () {
	it('should create a new Perk', function (done) {
		let data = JSON.stringify({
            "perkname": "Test Perks2",
            "description": "Test2",
            "price": 1000
        });
          
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/perks',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };

		axios.request(config)
			.then(response => {
				// Check if the response has a status code of 200
				assert.equal(response.status, 200);
				done();
			})
			.catch(error => {
				done(error);
			});
	});

	it('should get new perks', function (done) {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/perks',
            headers: {}
        };


        axios.request(config)
            .then((response) => {
                const perk2 = response.data.find(p => p.perkname === 'Test Perks2');
				assert.ok(perk2.perkname.includes('Test Perks2'), 'Found the Test Perks');
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

});


describe('Test - delete perks', function () {
	it('should delete test perks', function (done) {

        let configdelete = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: '',
            headers: { }
        };


        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/perks',
            headers: {}
        };


        axios.request(config)
            .then((response) => {
                const perkToDelete = response.data.find(p => p.perkname === 'Test Perks2');
                configdelete.url = 'http://localhost:3001/perks/' + perkToDelete.perk_id;

                axios.request(configdelete)
                    .then(response => {
                        // Check if the response has a status code of 200
                        assert.equal(response.status, 200);
                        done();
                    })
                    .catch(error => {
                        done(error);
                    });
            })
            .catch((error) => {
                console.log(error);
                done(error);
            });
	});
});
