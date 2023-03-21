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
    getAuth,
} from "firebase/auth";

///////////////////////////// register new user /////////////////////////////
async function register(app, db, auth) {
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
                    console.log("Email verification sent!");
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

                // User did not verify their email within the timeout period, delete the user and inform the client
                if (!user.emailVerified) {
                    await user.delete();
                    res.status(500).json({
                        error: "Failed to verify email within timeout period",
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to create new user" });
            }

            try {
                const user_json = {
                    id: user.uid,
                    email: req.body["email"],
                    username: req.body["username"],
                    avatar: req.body["avatar"],
                    friendList: [],
                };

                // Add user info to Firestore with <uid>
                await setDoc(doc(db, "users", user.uid), user_json);

                const user_profile = {
                    id: user.uid,
                    username: req.body["username"],
                    win: 0,
                    loss: 0,
                    currency: 0,
                    avatar: req.body["avatar"],
                    inventory: [],
                };

                await setDoc(doc(db, "profiles", user.uid), user_profile);
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    error: "Failed to store new user into database",
                });
            }

            // response successfuly and passback user's uid
            res.status(201).json({
                message: `Created new user with ID: ${username}`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Wrong user input or exist email" });
        }
    });
}

///////////////////////////// login  /////////////////////////////
async function login(app, db, auth) {
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
                                // Send response to client with user data
                                res.status(200).json({
                                    message: `User ${userData.username} successfully logged in`,
                                    data: userData,
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
        res.clearCookie("token");
        res.status(200).json("User logged out: token cleared.");
    });
}

///////////////////////////// changePassword  /////////////////////////////
async function changePassword(app, auth) {
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
async function getUserById(app, db) {
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

async function deleteFriend(app, db) {
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

export function init(app, db, auth) {
    register(app, db, auth);
    login(app, db, auth);
    logout(app);
    changePassword(app, auth);
    getUserById(app, db);
    deleteFriend(app, db);
}
