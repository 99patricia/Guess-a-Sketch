import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Header, Container, Form, FormInput } from "components";

function CreateRoomPage() {
    const [roomId] = useState("");
    const [nickname] = useState("");
    const navigate = useNavigate();

    const handleJoinRoom = (e) => {
        e.preventDefault();
        localStorage.setItem("nickname", nickname);
        navigate(`/chat/${roomId}`);
    };

    return (
        <>
            <Header />
            <Container>
                <Form className="grid-form" onSubmit={handleJoinRoom}>
                    <FormInput
                        label="Players"
                        placeholder="Number of players"
                        min="2"
                        max="8"
                        type="number"
                    />
                    <FormInput
                        label="Drawtime"
                        placeholder="Seconds in each round"
                        min="15"
                        max="120"
                        type="number"
                    />
                    <FormInput
                        label="Rounds"
                        placeholder="Number of rounds in game"
                        min="2"
                        max="10"
                        type="number"
                    />
                    <FormInput
                        textArea
                        label="Custom words"
                        placeholder="Define any custom words here separated by a , (comma)"
                    />
                    <Button column type="submit">
                        Create
                    </Button>
                </Form>
            </Container>
        </>
    );
}

export default CreateRoomPage;
