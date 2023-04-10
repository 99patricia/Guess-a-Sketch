import React, { useEffect, useState } from "react";
import { socket } from "service/socket";
import { Desktop } from "service/mediaQueries";
import { useNavigate } from "react-router-dom";

import { Button, Header, Container, Form, FormInput } from "components";
import { useUserData } from "hooks";
import axios from "axios";

function CreateRoom() {
    const navigate = useNavigate();
    const isDesktop = Desktop();

    const [numberOfPlayers, setNumberOfPlayers] = useState(2); // Default to 2 players
    const [drawTime, setDrawTime] = useState(90); // Default to 90 seconds
    const [numberOfRounds, setNumberOfRounds] = useState(3); // Default to 3 rounds
    const { userData } = useUserData();
    const [wordbanks, setWordbanks] = useState([]);
    const [chosenCategoryId, setChosenCategoryId] = useState("");
    const [chosenCategory, setChosenCategory] = useState("");

    useEffect(() => {
        axios.get(`/wordbank/${userData.id}`).then((res) => {
            setWordbanks(res.data);
            setChosenCategoryId(
                res.data[0].isGlobal
                    ? `${res.data[0].name}__GLOBAL`
                    : `${res.data[0].name}__${userData.id}`
            );
        });
    }, [setWordbanks, userData.id]);

    var roomId = "";
    const chars = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 4; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const handleSelectWordbank = (e) => {
        const index = e.target.selectedIndex;
        const el = e.target.childNodes[index];
        const categoryId = el.getAttribute("id");

        setChosenCategory(e.target.value);
        setChosenCategoryId(categoryId);
    };

    const handleCreateRoom = (e) => {
        e.preventDefault();

        axios.get(`/wordbankcontent/${chosenCategoryId}`).then((res) => {
            const wordbankContent = res.data;
            const room = {
                roomId,
                username: userData.username,
                avatar: userData.avatar,
                numberOfPlayers,
                drawTime,
                numberOfRounds,
                wordbankContent,
            };

            // Manually connect socket when creating room
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
            socket.emit("create-room", room);
            socket.on("create-room-success", () => {
                navigate(`/room/${roomId}`);
            });
        });
    };

    return (
        <>
            <Header />
            <Container>
                <Form
                    className={`${isDesktop ? "grid-form" : "flex-form"}`}
                    onSubmit={handleCreateRoom}
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
                        label="Category"
                        value={chosenCategory}
                        onChange={handleSelectWordbank}
                        select
                    >
                        {wordbanks.map((wordbank) => {
                            return (
                                <option
                                    key={wordbank.name}
                                    label={wordbank.name}
                                    id={
                                        wordbank.isGlobal
                                            ? `${wordbank.name}__GLOBAL`
                                            : `${wordbank.name}__${userData.id}`
                                    }
                                >
                                    {wordbank.name}
                                </option>
                            );
                        })}
                    </FormInput>
                    <Button fullWidth column type="submit">
                        Create
                    </Button>
                </Form>
            </Container>
        </>
    );
}

export default CreateRoom;
