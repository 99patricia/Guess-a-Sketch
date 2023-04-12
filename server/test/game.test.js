import axios from "axios";
import assert from "assert";



describe('Test - Get Game by ID', function () {
    const validGameId = 'sample_valid_game_id'; // Replace this with a valid game ID from your database
    const invalidGameId = 'sample_invalid_game_id'; // Replace this with an invalid game ID

    it('should get the game data when a valid game ID is provided', async function () {
        const config = {
            method: 'get',
            url: `http://localhost:3001/games/x6vYTqoZFvctis5gspk1`,
            headers: {}
        };

        try {
            const response = await axios.request(config);
            const gameData = response.data;

            // Check if the game data is not empty
            assert.ok(Object.keys(gameData).length > 0, 'Game data is not empty');

        } catch (error) {
            assert.fail('Failed to fetch game data for valid game ID');
        }
    });

    it('should return a 404 error when an invalid game ID is provided', async function () {
        const config = {
            method: 'get',
            url: `http://localhost:3001/games/Invalid`,
            headers: {}
        };

        try {
            await axios.request(config);
            assert.fail('Expected 404 error for invalid game ID');
        } catch (error) {
            // Check if the error status code is 404
            assert.strictEqual(error.response.status, 404, 'Error status code is 404 for invalid game ID');
        }
    });
});

/*
describe('Test - Get All Games', function () {
    it('should fetch all games successfully', async function () {
        const config = {
            method: 'get',
            url: 'http://localhost:3001/games',
            headers: {}
        };

        try {
            const response = await axios.request(config);
            const games = response.data;

            // Check if the games array is not empty
            console.log('asdadsada');
            assert.ok(Array.isArray(games), 'Games data is an array');

            // Check if each game object in the array has the required fields
            // Replace 'field_name' with the actual field names in your game objects
            games.forEach(game => {
                assert.ok(game.hasOwnProperty('field_name'), 'Game object has the required field');
            });

        } catch (error) {
            assert.fail('Failed to fetch all games');
        }
    });
});
*/


