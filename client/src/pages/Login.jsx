/**
 * Satisfies:
 * FR3 - Request.Log-in
 */
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
    Button,
    Header,
    Container,
    ErrorMessage,
    Form,
    FormInput,
} from "components";
import styled from "styled-components";

const StyledP = styled.p`
    text-align: center;
    margin: 0;
`;

const StyledLink = styled(Link)`
    text-align: center;
    color: var(--primary);
`;

function Login() {
    const [showErrorMessage, setShowErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const body = {
            email,
            password,
            returnSecureToken: true,
        };
        const options = {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        };

        axios
            .post("/login", body, options)
            .then((res) => {
                setShowErrorMessage("");
                localStorage.setItem("userData", JSON.stringify(res.data.data));
                const userPerks = res.data.userPerks;
                if (userPerks && userPerks.length > 0) {
                    // User may have unlocked more than one perk, equip their best perk on login
                    const bestPerk = userPerks.reduce((prev, current) => {
                        return prev.rank > current.rank ? prev : current;
                    });
                    localStorage.setItem(
                        "equippedPerk",
                        JSON.stringify(bestPerk)
                    );
                }

                navigate("/");
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
                    <StyledLink to="/changePassword">
                        Forgot your password?
                    </StyledLink>
                    <Button column type="submit">
                        Login
                    </Button>
                    <StyledLink to="/register">
                        Don't have an account? Sign up here
                    </StyledLink>
                    <StyledP>or</StyledP>
                    <StyledLink to="/guestLogin">Login as guest</StyledLink>
                </Form>
            </Container>
        </>
    );
}

export default Login;
