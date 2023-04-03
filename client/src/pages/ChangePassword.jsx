import React, { useState } from "react";
import axios from "axios";

import {
    Button,
    Header,
    Container,
    ErrorMessage,
    Form,
    FormInput,
} from "components";

function ChangePassword() {
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");

    const handleChangePassword = (e) => {
        e.preventDefault();
        const body = { email, returnSecureToken: true };
        const options = {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        };
        axios
            .post("/changePassword", body, options)
            .then((res) => {
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
                <Form className="flex-form" onSubmit={handleChangePassword}>
                    {errorMessage && (
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    )}
                    {message ? (
                        <p>{message}</p>
                    ) : (
                        <>
                            <FormInput
                                label="E-mail"
                                placeholder="Enter e-mail"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            ></FormInput>
                            <Button column type="submit">
                                Send password reset link
                            </Button>
                        </>
                    )}
                </Form>
            </Container>
        </>
    );
}

export default ChangePassword;
