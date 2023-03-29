import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";

import {
    Button,
    Canvas,
    Header,
    Container,
    CustomLink,
    ErrorMessage,
    Form,
    FormInput,
} from "components";

const StyledMessage = styled.div`
    background-color: var(--light-beige);
    padding: 2rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 1.5rem;
    margin: 0 auto;
`;

const StyledAvatarCanvasContainer = styled.div`
    margin: 0 auto;
    text-transform: uppercase;
    text-align: center;
    font-size: 1.6rem;
    line-height: 2rem;
`;

function Register() {
    const canvasRef = useRef();
    const submitButtonRef = useRef();

    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        const submitButton = submitButtonRef.current;
        const canvas = canvasRef.current;

        submitButton.addEventListener("click", (e) => {
            e.preventDefault();
            setAvatar(canvas.toDataURL("image/png"));
            handleRegister(e);
        });
    }, []);

    const handleRegister = (e) => {
        e.preventDefault();
        const body = {
            email,
            username,
            password,
            avatar,
            returnSecureToken: true,
        };
        const options = {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        };

        axios
            .post("/register", body, options)
            .then((res) => {
                setErrorMessage("");
                setMessage(res.data.message);
            })
            .catch((err) => {
                setErrorMessage(err.response.data.error);
            });
    };

    return (
        <>
            <Header />
            <Container>
                {message ? (
                    <StyledMessage>{message}</StyledMessage>
                ) : (
                    <>
                        <Form className="grid-form">
                            {errorMessage && (
                                <ErrorMessage>{errorMessage}</ErrorMessage>
                            )}
                            <StyledAvatarCanvasContainer>
                                Draw your avatar here!
                                <Canvas ref={canvasRef} />
                            </StyledAvatarCanvasContainer>
                            <FormInput
                                label="E-mail"
                                placeholder="Enter e-mail"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            ></FormInput>
                            <FormInput
                                label="Username"
                                placeholder="Enter username"
                                type="text"
                                onChange={(e) => setUsername(e.target.value)}
                            ></FormInput>
                            <FormInput
                                label="Password"
                                placeholder="Enter password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            ></FormInput>
                            <Button ref={submitButtonRef}>Submit</Button>
                            <CustomLink to="/login">
                                Already have an account? Sign in
                            </CustomLink>
                        </Form>
                    </>
                )}
            </Container>
        </>
    );
}

export default Register;
