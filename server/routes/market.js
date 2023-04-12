/*
* API file for the Functional Requirments
* FR16 - Unlock.Perk
*/


import {
    doc,
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

import { db } from "../service/firebase.js";

///////////////////////////// createPerk  /////////////////////////////
async function createPerk(app) {
    app.post("/perks", async (req, res) => {
        try {
            const perkname = req.body["perkname"];
            const description = req.body["description"];
            const price = req.body["price"];

            const perkData = {
                perkname,
                description,
                price,
            };

            const perkDocRef = await addDoc(collection(db, "perks"), perkData);
            const perk_id = perkDocRef.id;

            // Create a new perk document

            perkData.perk_id = perk_id;

            // Update the perk document with the generated perk_id
            await updateDoc(perkDocRef, { perk_id });

            res.status(200).json({
                message: "Perk created successfully",
                perk: perkData,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create perk" });
        }
    });
}

///////////////////////////// getPerk  /////////////////////////////
async function getPerk(app) {
    app.get("/perks/:perk_id", async (req, res) => {
        try {
            const perk_id = req.params.perk_id;

            // Get the perk document from Firestore
            const perkDocRef = doc(db, "perks", perk_id);
            const perkSnapshot = await getDoc(perkDocRef);

            if (!perkSnapshot.exists()) {
                res.status(404).json({ error: "Perk not found" });
                return;
            }

            // Get perk information
            const perk = perkSnapshot.data();

            res.status(200).json(perk);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch perk" });
        }
    });
}

///////////////////////////// getAllPerks  /////////////////////////////
async function getAllPerks(app) {
    app.get("/perks", async (req, res) => {
        try {
            // Get all perk documents from Firestore
            const perksCollection = collection(db, "perks");
            const perksSnapshot = await getDocs(perksCollection);

            // Convert the query results to an array of perk objects
            const perks = perksSnapshot.docs.map((doc) => doc.data());

            res.status(200).json(perks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch perks" });
        }
    });
}

async function getUserPerks(app) {
    app.get("/user_perks/:user_id", async (req, res) => {
        try {
            const userId = req.params.user_id;

            // Fetch the user's profile data
            const profileDocRef = doc(db, "profiles", userId);
            await getDoc(profileDocRef).then(async (docsnap) => {
                if (!docsnap.exists()) {
                    res.status(404).json({ error: "User not found" });
                } else {
                    const userData = docsnap.data();
                    const inventory = userData.inventory;

                    // Fetch the perk data from user's inventory
                    const userPerks = [];
                    for (let i = 0; i < inventory.length; i++) {
                        const perkId = inventory[i];
                        await getDoc(doc(db, "perks", perkId)).then(
                            (docsnap) => {
                                const perkData = docsnap.data();
                                userPerks.push(perkData);
                            }
                        );
                    }

                    res.status(200).json({ userPerks });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch user's perks" });
        }
    });
}

///////////////////////////// purchasePerk  /////////////////////////////
async function purchasePerk(app) {
    app.post("/purchase/:user_id/:perk_id", async (req, res) => {
        try {
            const user_id = req.params.user_id;
            const perk_id = req.params.perk_id;

            // Fetch the user's profile and the perk data
            const profileDocRef = doc(db, "profiles", user_id);
            const profileSnapshot = await getDoc(profileDocRef);

            const perkDocRef = doc(db, "perks", perk_id);
            const perkSnapshot = await getDoc(perkDocRef);

            if (!profileSnapshot.exists() || !perkSnapshot.exists()) {
                res.status(400).json({ error: "User or perk not found" });
                return;
            }

            const userData = profileSnapshot.data();
            const perkData = perkSnapshot.data();

            // Check if the user has enough currency to purchase the perk
            if (userData.currency < perkData.price) {
                res.status(400).json({
                    error: "Not enough currency to purchase perk",
                });
                return;
            }
            //////////////////////////////////////
            if (userData.inventory.includes(perk_id)) {
                res.status(400).json({ error: "Perk is already purchased" });
                return;
            }

            // Deduct the perk cost from the user's currency and add the perk to their inventory
            const updatedCurrency = userData.currency - perkData.price;
            const updatedInventory = userData.inventory.concat(perk_id);

            // Update the user's profile in Firestore
            await updateDoc(profileDocRef, {
                currency: updatedCurrency,
                inventory: updatedInventory,
            });

            res.status(200).json({
                message: "Perk purchased successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to purchase perk" });
        }
    });
}

///////////////////////////// deletePerk  /////////////////////////////
async function deletePerk(app) {
    app.delete("/perks/:perk_id", async (req, res) => {
        try {
            const perk_id = req.params.perk_id;

            // Get the reference to the document to be deleted
            const perkDocRef = doc(db, "perks", perk_id);

            // Check if the document exists before deleting
            const perkDocSnapshot = await getDoc(perkDocRef);
            if (!perkDocSnapshot.exists()) {
                throw new Error("Perk document not found");
            }

            // Delete the document
            await deleteDoc(perkDocRef);

            res.status(200).json({
                message: "Perk deleted successfully",
                perk_id: perk_id,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete perk" });
        }
    });
}

export function init(app) {
    createPerk(app),
        getPerk(app),
        getAllPerks(app),
        getUserPerks(app),
        purchasePerk(app),
        deletePerk(app);
}
