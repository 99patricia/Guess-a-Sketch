/*
* Test the leaderboard API and also the database 
*/

import axios from "axios";
import assert from "assert";

describe('Test - Get Leaderboard', function () {
    it('should get the top 100 players sorted by wins in descending order', async function () {
        const config = {
            method: 'get',
            url: 'http://localhost:3001/leaderboard',
            headers: {}
        };

        try {
            const response = await axios.request(config);
            const leaderboardData = response.data;

            // Check if the number of records returned is correct
            assert.ok(leaderboardData.length <= 100, 'Number of records is less than or equal to 100');

            // Check if the records are sorted by wins in descending order
            let isSorted = true;
            for (let i = 0; i < leaderboardData.length - 1; i++) {
                if (leaderboardData[i].wins < leaderboardData[i + 1].wins) {
                    isSorted = false;
                    break;
                }
            }
            assert.ok(isSorted, 'Leaderboard data is sorted by wins in descending order');

            // Check if the required fields are present in each record
            leaderboardData.forEach(record => {
                assert.ok(record.hasOwnProperty('id'), 'Record has id field');
                assert.ok(record.hasOwnProperty('username'), 'Record has username field');
                assert.ok(record.hasOwnProperty('wins'), 'Record has wins field');
                assert.ok(record.hasOwnProperty('losses'), 'Record has losses field');
            });

        } catch (error) {
            assert.fail('Failed to fetch leaderboard data');
        }
    });
});