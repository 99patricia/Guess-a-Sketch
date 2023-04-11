import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "service/socket";

import { playSound } from "service/playSound";
import joinSound from "assets/join.m4a";

import {
    Button,
    Header,
    Container,
    ErrorMessage,
    Form,
    FormInput,
} from "components";

import { useUserData } from "hooks";

function Home() {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState("");
    const { isLoggedIn, loggedInAsGuest, userData } = useUserData();

    const createRoomButtonRef = useRef();

    const handleJoinRoom = (e) => {
        e.preventDefault();
        socket.room = roomId;

        if (roomId === "") {
            setShowErrorMessage("Room code cannot be empty");
        } else {
            const room = {
                roomId,
                username: userData.username,
                avatar: userData.avatar,
            };

            // Manually connect socket when joining room
            const sessionID = sessionStorage.getItem("sessionID");

            if (sessionID) {
                socket.auth = {
                    username: userData.username,
                    sessionID,
                };
            } else {
                socket.auth = { username: userData.username };
            }
            socket.connect();
            socket.on("session", ({ sessionID, userID }) => {
                socket.auth = {
                    username: userData.username,
                    sessionID,
                };
                sessionStorage.setItem("sessionID", sessionID);
                socket.userID = userID;
            });
            socket.emit("join-room", room);
            socket.on("join-room-fail", (data) => {
                setShowErrorMessage(data.msg);
            });
            socket.on("join-room-success", (roomId) => {
                playSound(joinSound);
                navigate(`/room/${roomId}`);
            });
        }
    };

    useEffect(() => {
        if (!(isLoggedIn || loggedInAsGuest)) navigate("/login");

        const button = createRoomButtonRef.current;
        button.addEventListener("click", (e) => {
            e.preventDefault();
            navigate("/createRoom");
        });
    }, [isLoggedIn, loggedInAsGuest, navigate]);

    return (
        <>
            <Header />
            <Container>
                <Form className="flex-form" onSubmit={handleJoinRoom}>
                    {showErrorMessage && (
                        <ErrorMessage>{showErrorMessage}</ErrorMessage>
                    )}
                    <FormInput
                        label="Join a room"
                        placeholder="Enter room code"
                        type="text"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                    ></FormInput>
                    <Button column fullWidth type="submit">
                        Join
                    </Button>
                    <Button
                        column
                        fullWidth
                        ref={createRoomButtonRef}
                        secondary
                    >
                        Create a new room
                    </Button>
                </Form>
            </Container>
        </>
    );
}

export default Home;
