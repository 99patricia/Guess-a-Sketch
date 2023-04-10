import {
    doc,
    collection,
    query,
    where,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
} from "firebase/firestore";

import { db } from "../service/firebase.js";

///////////////////////////// getUserWordbanks /////////////////////////////
async function getUserWordbanks(app) {
    app.get("/wordbank/:user_id", async (req, res) => {
        try {
            const user_id = req.params.user_id;

            const wordQuery = query(
                collection(db, "wordBank"),
                where("user_id", "in", [user_id, "GLOBAL"])
            );

            const [wordSnapshot] = await Promise.all([getDocs(wordQuery)]);

            const wordbanks = wordSnapshot.docs.map((doc) => {
                const wordBankData = doc.data();
                return {
                    name: wordBankData.bankname,
                    isGlobal: wordBankData.user_id === "GLOBAL",
                    words: wordBankData.words,
                };
            });

            res.status(200).json(wordbanks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch word bank names" });
        }
    });
}

///////////////////////////// getWordBankContent /////////////////////////////
async function getWordBankContent(app) {
    app.get("/wordbankcontent/:name_wordbank", async (req, res) => {
        try {
            const name_wordbank = req.params.name_wordbank;

            const wordBankDocRef = doc(db, "wordBank", name_wordbank);

            // Fetch the document
            const snapshot = await getDoc(wordBankDocRef);
            if (snapshot.exists()) {
                // If the document exists, send the content as the response
                res.status(200).json(snapshot.data().words);
            } else {
                res.status(404).json({ error: "Word bank not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to fetch word bank content",
            });
        }
    });
}

///////////////////////////// createWordBank /////////////////////////////
async function createWordBank(app) {
    app.post("/wordbank/:name_wordbank/:user_id", async (req, res) => {
        try {
            const name_wordbank = req.params.name_wordbank;
            const user_id = req.params.user_id;

            const bankname = name_wordbank;
            const words = req.body["words"];

            const wordBankDocRef = doc(
                db,
                "wordBank",
                name_wordbank + "__" + user_id
            );

            // Check if the document already exists
            const snapshot = await getDoc(wordBankDocRef);
            if (snapshot.exists()) {
                res.status(400).json({ error: "Word bank already exists" });
                return;
            }

            // If the document doesn't exist, create a new one
            const wordBankData = { bankname, words, user_id };
            await setDoc(wordBankDocRef, wordBankData);
            res.status(200).json({ message: "Word bank created successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create word bank" });
        }
    });
}

async function deleteWordBank(app) {
    // Example function to delete a word bank
    app.delete("/wordbank/:name_wordbank/:user_id", async (req, res) => {
        try {
            const name_wordbank = req.params.name_wordbank;
            const user_id = req.params.user_id;

            const wordBankDocRef = doc(
                db,
                "wordBank",
                name_wordbank + "__" + user_id
            );

            // Check if the document exists
            const snapshot = await getDoc(wordBankDocRef);
            if (!snapshot.exists()) {
                res.status(404).json({ error: "Word bank not found" });
                return;
            }

            // If the document exists, delete it
            await deleteDoc(wordBankDocRef);
            res.status(200).json({ message: "Word bank deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete word bank" });
        }
    });
}

export function init(app) {
    getUserWordbanks(app),
        getWordBankContent(app),
        deleteWordBank(app),
        createWordBank(app);
}
