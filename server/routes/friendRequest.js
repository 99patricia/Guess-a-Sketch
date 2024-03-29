/*
* API file for the Functional Requirments
* FR20 - Request.SendFriendRequest
* FR21 - Request.AcceptFriendRequest 
* FR22 - Request.DeclineFriendRequest
*/

import {
    doc,
    collection,
    query,
    where,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    arrayUnion,
} from "firebase/firestore";

import {
    db
} from "../service/firebase.js";

///////////////////////////// handleFriendRequest  /////////////////////////////
async function handleFriendRequest(app) {
    app.post("/friend_request", async (req, res) => {
        try {
            // Extract friend request data from request body
            const sender_id = req.body["sender_id"];
            const recipient_username = req.body["recipient_username"];
            const status = req.body["status"];
            const direction = req.body["direction"];

            var recipient_id = "";

            {

                const q = query(
                    collection(db, "profiles"),
                    where("username", "==", recipient_username)
                );

                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    // player is a guest
                    res.status(400).json({
                        error: "User not found"
                    });
                    return;
                } else {
                    querySnapshot.forEach((docSnapshot) => {
                        recipient_id = docSnapshot.data()?.id;
                    });
                }
            }

            if (sender_id === recipient_id) {
                res.status(400).json({
                    error: "You cannot send a friend request to yourself"
                });
                return;
            }

            // Create a new friend request document with auto-generated request_id
            const friendRequestData = {
                sender_id,
                recipient_id,
                status,
                direction,
            };


            {
                const friendRequestsRef = collection(db, "friendRequests");
                const q = query(
                    collection(db, "friendRequests"),
                    where("sender_id", "==", sender_id),
                    where("recipient_id", "==", recipient_id),
                    where("status", "==", "pending")
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) { // request already exists
                    res.status(400).json({
                        error: "Request already exists"
                    });
                    return;
                }
            }
            

            const senderDocRef = doc(db, "users", sender_id);
            const senderSnapshot = await getDoc(senderDocRef);

            const receiverDocRef = doc(db, "users", recipient_id);
            const receiverSnapshot = await getDoc(receiverDocRef);

            if (!senderSnapshot.exists() || !receiverSnapshot.exists()) {
                res.status(400).json({
                    error: "User not found"
                });
                return;
            }

            if (
                senderSnapshot.data().friendList.includes(recipient_id) ||
                receiverSnapshot.data().friendList.includes(sender_id)
            ) {
                res.status(400).json({
                    error: "Users are already friends"
                });
                return;
            }

            // Add friend request info to Firestore
            const requestDocRef = await addDoc(
                collection(db, "friendRequests"),
                friendRequestData
            );
            const request_id = requestDocRef.id;

            // Add the generated request_id to the friend request data
            friendRequestData.request_id = request_id;

            // Update the friend request document with the generated request_id
            await updateDoc(requestDocRef, {
                request_id
            });

            res.status(200).json({
                message: `Friend request with ID: ${request_id} has been created.`,
                friendRequestData,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to handle friend request"
            });
        }
    });
}

///////////////////////////// getFriendRequests Only for Receiver /////////////////////////////
async function getFriendRequests(app) {
    app.get("/friend_requests/:id", async (req, res) => {
        try {
            // Extract the user_id from the request query parameters
            const user_id = req.params.id;

            // Create a query to retrieve friend requests where the sender_id matches the user_id

            const senderQuery = query(
                collection(db, "friendRequests"),
                where("sender_id", "==", user_id)
            );

            // Create a query to retrieve friend requests where the recipient_id matches the user_id
            const recipientQuery = query(
                collection(db, "friendRequests"),
                where("recipient_id", "==", user_id)
            );

            // Execute the queries and store the results using Promise.all()
            const [senderSnapshot, recipientSnapshot] = await Promise.all([
                getDocs(senderQuery),
                getDocs(recipientQuery),
            ]);

            //console.log(senderSnapshot);

            // Convert the query results to an array of friend request objects
            const friendRequests = [];

            // TODO: sender request we don't use that?
            /*
            senderSnapshot.forEach((doc) => {
                friendRequests.push(doc.data());
            });
            */
            recipientSnapshot.forEach((doc) => {
                friendRequests.push(doc.data());
            });

            // Send the friend requests array as the response
            res.status(200).json(friendRequests);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to retrieve friend requests",
            });
        }
    });
}

///////////////////////////// acceptFriendRequest /////////////////////////////
async function acceptFriendRequest(app) {
    app.post("/friend_request/accept", async (req, res) => {
        try {
            const request_id = req.body["request_id"];
            const sender_id = req.body["sender_id"];
            const recipient_id = req.body["recipient_id"];

            // Update the friend request status in Firestore
            const requestDocRef = doc(db, "friendRequests", request_id);
            await updateDoc(requestDocRef, {
                status: "accepted"
            });

            // Update the friends list of both users in Firestore
            const senderDocRef = doc(db, "users", sender_id);
            const recipientDocRef = doc(db, "users", recipient_id);

            await updateDoc(senderDocRef, {
                friendList: arrayUnion(recipient_id),
            });
            await updateDoc(recipientDocRef, {
                friendList: arrayUnion(sender_id),
            });

            res.status(200).json({
                message: `Friend request with ID: ${request_id} has been accepted.`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to accept friend request"
            });
        }
    });
}

///////////////////////////// rejectFriendRequest /////////////////////////////
async function rejectFriendRequest(app) {
    app.post("/friend_request/reject", async (req, res) => {
        try {
            const request_id = req.body["request_id"];

            // Update the friend request status in Firestore
            const requestDocRef = doc(db, "friendRequests", request_id);
            await updateDoc(requestDocRef, {
                status: "rejected"
            });

            res.status(200).json({
                message: `Friend request with ID: ${request_id} has been rejected.`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to reject friend request"
            });
        }
    });
}

///////////////////////////// deleteFriendRequest /////////////////////////////
async function deleteFriendRequest(app) {
    app.post("/friend_request/delete", async (req, res) => {
        try {
            const request_id = req.body["request_id"];

            // Delete the friend request from Firestore
            const requestDocRef = doc(db, "friendRequests", request_id);
            await deleteDoc(requestDocRef);

            res.status(200).json({
                message: `Friend request with ID: ${request_id} has been deleted.`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Failed to delete friend request"
            });
        }
    });
}

export function init(app) {
    handleFriendRequest(app),
        getFriendRequests(app),
        acceptFriendRequest(app),
        rejectFriendRequest(app),
        deleteFriendRequest(app);
}