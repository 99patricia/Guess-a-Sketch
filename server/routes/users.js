import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayRemove,
} from "firebase/firestore";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";

import { auth, adminAuth, db } from "../service/firebase.js";

///////////////////////////// register new user /////////////////////////////
async function register(app) {
    app.post("/register", async (req, res) => {
        try {
            // Extract user data from request body
            const email = req.body["email"];
            const username = req.body["username"];
            const password = req.body["password"];
            const avatar = req.body["avatar"];

            //firebase auth method to create user with email and password
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            try {
                // send email verification
                await sendEmailVerification(user).then(() => {
                    console.log(`Email verification sent to ${email}`);
                    res.status(200).json({
                        message: `Email verification sent to ${email}. Please check your inbox and follow the link to verify your account.`,
                    });
                });

                // timeout
                const timeout = 5 * 60 * 1000; // 5 minutes in milliseconds
                const startTime = Date.now();
                while (
                    !user.emailVerified &&
                    Date.now() - startTime < timeout
                ) {
                    await user.reload();
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 second before checking again
                }

                // User did not verify their email within the timeout period, delete the user
                if (!user.emailVerified) {
                    try {
                        await adminAuth.deleteUser(user.uid).then(() => {
                            console.log(`User with uid ${user.uid} removed.`);
                        });
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    try {
                        const user_json = {
                            id: user.uid,
                            email,
                            username,
                            avatar,
                            friendList: [],
                        };

                        // Add user info to Firestore with <uid>
                        await setDoc(
                            doc(db, "users", user.uid),
                            user_json
                        ).then(() => {
                            console.log(
                                `User with username ${user.username} created.`
                            );
                        });

                        const user_profile = {
                            id: user.uid,
                            username,
                            win: 0,
                            loss: 0,
                            currency: 0,
                            avatar,
                            inventory: [],
                            gamehistory: [],
                        };

                        await setDoc(
                            doc(db, "profiles", user.uid),
                            user_profile
                        );
                    } catch (error) {
                        console.error(error);
                    }
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to create new user" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Wrong user input or exist email" });
        }
    });
}

///////////////////////////// login  /////////////////////////////
async function login(app) {
    app.post("/login", async (req, res) => {
        try {
            const email = req.body["email"];
            const password = req.body["password"];

            await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    // Handle the signed-in user, e.g., retrieve user data from Firestore
                    const docRef = doc(db, "users", user.uid);
                    // Set token cookie
                    if (user)
                        user.getIdToken().then((tk) => {
                            res.cookie("token", tk);
                        });

                    getDoc(docRef)
                        .then((docsnap) => {
                            if (docsnap.exists()) {
                                const userData = docsnap.data();

                                // Fetch the user's profile data to get their perks
                                const profileDocRef = doc(
                                    db,
                                    "profiles",
                                    user.uid
                                );
                                getDoc(profileDocRef).then(async (docsnap) => {
                                    if (docsnap.exists()) {
                                        const profileData = docsnap.data();
                                        const inventory = profileData.inventory;

                                        // Fetch the perk data from user's inventory
                                        const userPerks = [];
                                        for (
                                            let i = 0;
                                            i < inventory.length;
                                            i++
                                        ) {
                                            const perkId = inventory[i];
                                            await getDoc(
                                                doc(db, "perks", perkId)
                                            ).then((docsnap) => {
                                                const perkData = docsnap.data();
                                                userPerks.push(perkData);
                                            });
                                        }

                                        // Send response to client with user data
                                        res.status(200).json({
                                            message: `User ${userData.username} successfully logged in`,
                                            data: userData,
                                            userPerks,
                                        });
                                    }
                                });
                            } else {
                                console.log("No user data available");
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(401).json({
                        error: "Invalid username or password",
                    });
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Wrong user input" });
        }
    });
}

///////////////////////////// logout  /////////////////////////////
async function logout(app) {
    app.post("/logout", async (req, res) => {
        // Not actually needed for logout, but we'll need to verify session tokens
        // in other api calls that require authenticated users
        const token = req.cookies.token || "";
        adminAuth
            .verifyIdToken(token, true /** checkRevoked */)
            .then((decodedToken) => {
                const uid = decodedToken.uid;
                console.log(uid);
            })
            .catch((error) => {
                console.error(error);
            });

        // Clear the session token on logout
        res.clearCookie("token");
        res.status(200).json("User logged out: token cleared.");
    });
}

///////////////////////////// changePassword  /////////////////////////////
async function changePassword(app) {
    app.post("/changePassword", async (req, res) => {
        try {
            const email = req.body["email"];

            await sendPasswordResetEmail(auth, email)
                .then(() => {
                    res.status(200).json({
                        message: `Password reset email sent to ${email}`,
                    });
                })
                .catch((error) => {
                    res.status(401).json({
                        error: "Failed to send password reset email",
                    });
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Wrong user input" });
        }
    });
}

///////////////////////////// getUserById  /////////////////////////////
async function getUserById(app) {
    app.get("/users/:id", async (req, res) => {
        try {
            const userId = req.params.id;

            const docRef = doc(db, "users", userId);

            await getDoc(docRef)
                .then((docsnap) => {
                    if (docsnap.exists()) {
                        const userData = docsnap.data();
                        // Send response to client with user data

                        res.status(200).json(userData);
                    } else {
                        res.status(404).json({ error: "No data found" });
                    }
                })
                .catch((error) => {
                    res.status(404).json({ error: "No data found" });
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error" });
        }
    });
}

async function getFriends(app) {
    app.get("/users/friends/:id", async (req, res) => {
        try {
            const userId = req.params.id;
            const docRef = doc(db, "users", userId);

            await getDoc(docRef)
                .then(async (docsnap) => {
                    if (docsnap.exists()) {
                        const userData = docsnap.data();
                        const friendsIdsList = userData.friendList;

                        // Fetch data for user's friends
                        const friendsList = [];
                        for (let i = 0; i < friendsIdsList.length; i++) {
                            const friendId = friendsIdsList[i];
                            await getDoc(doc(db, "users", friendId)).then(
                                (docsnap) => {
                                    const friendData = docsnap.data();
                                    friendsList.push(friendData);
                                }
                            );
                        }
                        // Send response to client with user data

                        res.status(200).json({ friends: friendsList });
                    } else {
                        res.status(404).json({ error: "No data found" });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    res.status(404).json({ error: "No data found" });
                });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error" });
        }
    });
}

async function deleteFriend(app) {
    app.delete("/deletefriends/:user_id/:friend_id", async (req, res) => {
        try {
            const user_id = req.params.user_id;
            const friend_id = req.params.friend_id;

            // Remove friend_id from the friendList of user_id
            const userDocRef = doc(db, "users", user_id);
            await updateDoc(userDocRef, {
                friendList: arrayRemove(friend_id),
            });

            // Remove user_id from the friendList of friend_id
            const friendDocRef = doc(db, "users", friend_id);
            await updateDoc(friendDocRef, {
                friendList: arrayRemove(user_id),
            });

            res.status(200).json({
                message: `Friendship between user ${user_id} and user ${friend_id} has been deleted.`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete friend" });
        }
    });
}

export function init(app) {
    register(app);
    login(app);
    logout(app);
    changePassword(app);
    getUserById(app);
    getFriends(app);
    deleteFriend(app);
}
