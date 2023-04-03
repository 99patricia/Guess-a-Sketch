import React, { useState } from "react";
import { socket } from "service/socket";
import { Desktop } from "service/mediaQueries";
import { useNavigate } from "react-router-dom";

import { Button, Header, Container, Form, FormInput } from "components";
import { useUserData } from "hooks";

function CreateRoomPage() {
    const navigate = useNavigate();
    const isDesktop = Desktop();

    const [numberOfPlayers, setNumberOfPlayers] = useState(2); // Default to 2 players
    const [drawTime, setDrawTime] = useState(90); // Default to 90 seconds
    const [numberOfRounds, setNumberOfRounds] = useState(3); // Default to 3 rounds
    const { userData } = useUserData();

    var roomId = "";
    const chars = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 4; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const handleJoinRoom = (e) => {
        e.preventDefault();
        const username = localStorage.getItem("username") || "guest";
        const room = {
            roomId,
            username: userData.username,
            avatar: userData.avatar,
            numberOfPlayers,
            drawTime,
            numberOfRounds,
        };
        socket.emit("create-room", room);
        socket.on("create-room-success", (data) => {
            console.log(data);
        });

        navigate(`/room/${roomId}`);
    };

    return (
        <>
            <Header />
            <Container>
                <Form
                    className={`${isDesktop ? "grid-form" : "flex-form"}`}
                    onSubmit={handleJoinRoom}
                >
                    <FormInput
                        label="Players"
                        placeholder="Number of players"
                        min="2"
                        max="8"
                        value={numberOfPlayers}
                        onChange={(e) => setNumberOfPlayers(e.target.value)}
                        type="number"
                    />
                    <FormInput
                        label="Drawtime"
                        placeholder="Seconds in each round"
                        min="15"
                        max="120"
                        value={drawTime}
                        onChange={(e) => setDrawTime(e.target.value)}
                        type="number"
                    />
                    <FormInput
                        label="Rounds"
                        placeholder="Number of rounds in game"
                        min="2"
                        max="10"
                        value={numberOfRounds}
                        onChange={(e) => setNumberOfRounds(e.target.value)}
                        type="number"
                    />
                    <FormInput
                        textArea
                        label="Custom words"
                        placeholder="Define any custom words here separated by a , (comma)"
                    />
                    <Button fullWidth column type="submit">
                        Create
                    </Button>
                </Form>
            </Container>
        </>
    );
}

export default CreateRoomPage;
