import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
    Button,
    Header,
    Container,
    ErrorMessage,
    Form,
    FormInput,
} from "components";

function Login() {
    const [showErrorMessage, setShowErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        const body = {
            email,
            password,
        };
        const options = {
            headers: { "Content-Type": "application/json" },
        };

        axios
            .post("/login", body, options)
            .then((res) => {
                setShowErrorMessage("");
                const token = res.data.token;
                const username = res.data.data.username;
                localStorage.setItem("token", token);
                localStorage.setItem("username", username);
            })
            .catch((err) => {
                setShowErrorMessage(err.response.data.error);
            });
    };

    return (
        <>
            <Header />
            <Container>
                <Form className="flex-form" onSubmit={handleLogin}>
                    {showErrorMessage && (
                        <ErrorMessage>{showErrorMessage}</ErrorMessage>
                    )}
                    <FormInput
                        label="E-mail"
                        placeholder="Enter e-mail"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    ></FormInput>
                    <FormInput
                        label="Password"
                        placeholder="Enter password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    ></FormInput>
                    <Button column type="submit">
                        Login
                    </Button>
                    <Link to="/">Login as guest</Link>
                </Form>
            </Container>
        </>
    );
}

export default Login;
