import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayRemove,
    collection,
    getDocs,
} from "firebase/firestore";

import {
    db
} from "../service/firebase.js";


async function getAllgames(app) {
    app.get("/games", async (req, res) => {
        try {
            // Get all perk documents from Firestore
            const gamesCollection = collection(db, "games");
            const gamesSnapshot = await getDocs(gamesCollection);

            // Convert the query results to an array of perk objects
            const games = gamesSnapshot.docs.map((doc) => doc.data());
            console.log(games);


            res.status(200).json(games);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to fetch games history"
            });
        }
    });
}

async function getGameById(app) {
    app.get("/games/:game_id", async (req, res) => {
        try {
            // Get all perk documents from Firestore
            const { game_id } = req.params;

            // Get the game document with the specified ID from Firestore
            const gamesCollection = collection(db, "games");
            const gameDoc = doc(gamesCollection, game_id);
            const gameData = await getDoc(gameDoc);
      
            // If the document doesn't exist, return a 404 error
            if (!gameData.exists()) {
              res.status(404).json({ error: "Game not found" });
              return;
            }
      
            res.status(200).json(gameData.data());

        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to fetch games history"
            });
        }
    });
}

async function createGames(app) {
    app.post("/games", async (req, res) => {
        try {

            const {
                winner,
                players
            } = req.body;

            // Create a new game document in Firestore
            const gamesCollection = collection(db, "games");
            const newGame = await addDoc(gamesCollection, {
                winner,
                players
            });

            res.status(201).json({
                id: newGame.id
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to create game"
            });
        }
    });
}

export function init(app) {
    getGameById(app);
}