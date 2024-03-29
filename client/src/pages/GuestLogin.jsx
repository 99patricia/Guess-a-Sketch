/**
 * Satisfies:
 * FR5 - Request.Guest-Log-in
 * FR6 - Draw.Guest.Avatar
 */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { StyledLabel } from "components/FormInput";
import {
    Button,
    Header,
    Canvas,
    Container,
    ErrorMessage,
    Form,
    FormInput,
} from "components";

function GuestLogin() {
    const [errorMessage, setErrorMessage] = useState("");
    const [nickname, setNickname] = useState("");
    const [avatar, setAvatar] = useState("");

    const canvasRef = useRef();
    const submitButtonRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        const submitButton = submitButtonRef.current;
        const canvas = canvasRef.current;

        submitButton.addEventListener("click", (e) => {
            e.preventDefault();

            // Save the avatar image data to store in database
            const ctx = canvas.getContext("2d");
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            setAvatar(canvas.toDataURL("image/png"));
        });
    });

    const handleGuestLogin = (e) => {
        e.preventDefault();
        if (nickname === "") {
            setErrorMessage("Please enter a nickname");
        } else {
            sessionStorage.setItem("guestLoggedIn", true);
            sessionStorage.setItem("username", nickname);
            sessionStorage.setItem("guestAvatar", avatar);
            navigate("/");
        }
    };

    return (
        <>
            <Header />
            <Container>
                <Form className="flex-form">
                    {errorMessage && (
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    )}
                    <FormInput
                        label="Nickname"
                        placeholder="Enter nickname"
                        type="text"
                        onChange={(e) => setNickname(e.target.value)}
                    ></FormInput>
                    <StyledLabel>Avatar</StyledLabel>
                    <Canvas ref={canvasRef} noContainer />
                    <br />
                    <Button
                        column
                        onClick={handleGuestLogin}
                        ref={submitButtonRef}
                        type="submit"
                    >
                        Login as guest
                    </Button>
                </Form>
            </Container>
        </>
    );
}

export default GuestLogin;
