/*
* Extra Functionalilty but not in the SRS documents
*/

import { 
    query, 
    orderBy, 
    limit, 
    collection,
    getDocs
} from "firebase/firestore";  
import { 
    db 
} from "../service/firebase.js";

async function getLeaderboard(app) {
    app.get("/leaderboard", async (req, res) => {
        try {
            const q = query(collection(db, "profiles"), orderBy("win", "desc"), limit(100));
            const querySnapshot = await getDocs(q);
            const orderedProfiles = querySnapshot.docs.map(doc => doc.data());
            const leaderboardData = orderedProfiles.map(data => {
                return {
                    id: data['id'],
                    username: data['username'],
                    wins: data['win'],
                    losses: data['loss'],
                }
            });
            res.status(200).json(leaderboardData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch leaderboard" });
        }
    });
}

export function init(app) {
    getLeaderboard(app);
}
