import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { StyledLabel } from "components/FormInput";
import {
    Button,
    Canvas,
    Container,
    Form,
} from "components";

function EditAvatar(props) {
    const { setEditAvatar, userData } = { ...props };

    const [avatar, setAvatar] = useState("");
    const [colorChoices, setColorChoices] = useState(["black", "red", "blue"]);
    const [penSizeChoices, setPenSizeChoices] = useState([10, 50]);

    const canvasRef = useRef();
    const submitButtonRef = useRef();

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

        const equippedPerk = JSON.parse(localStorage.getItem("equippedPerk"));
        if (equippedPerk) {
            setColorChoices(equippedPerk["colors"]);
            setPenSizeChoices(
                equippedPerk["pen_sizes"].sort(function (a, b) {
                    return a - b;
                })
            );
        }
    }, []);

    const handleEditAvatar = (e) => {
        e.preventDefault();
        const body = {
            currency: 0,
            avatar,
        };
        const options = {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        };
        axios
            .post(`/profile/${userData.id}`, body, options)
            .then((res) => {
                setEditAvatar(false);
            });
        
        userData.avatar = avatar;
        localStorage.setItem("userData", JSON.stringify(userData));


        window.location.reload(true);
    };

    const handleBack = (e) => {
        setEditAvatar(false);
    };

    return (
        <>
            <Container>
                <Form className="flex-form">
                    <StyledLabel>Avatar</StyledLabel>
                    <Canvas 
                        ref={canvasRef} 
                        noContainer
                        penSizeChoices={penSizeChoices}
                        colorChoices={colorChoices}
                    />
                    <br />
                    <Button
                        column
                        onClick={handleEditAvatar}
                        ref={submitButtonRef}
                        type="submit"
                        secondary
                    >
                        Confirm
                    </Button>
                    <Button
                        column
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                </Form>
            </Container>
        </>
    );
}

export default EditAvatar;