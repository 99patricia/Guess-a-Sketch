import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { CustomLink } from "components";

import {
    Button,
    Header,
    Container,
    ErrorMessage,
    Form,
    FormInput,
} from "components";

function Register() {
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const body = {
            email,
            username,
            password,
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
                    <p>{message}</p>
                ) : (
                    <>
                        <Form className="grid-form" onSubmit={handleRegister}>
                            {errorMessage && (
                                <ErrorMessage>{errorMessage}</ErrorMessage>
                            )}
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
                            <Button column type="submit">
                                Sign up
                            </Button>
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
