import React, { useRef, useEffect } from "react";
import axios from "axios";

import { useUserData } from "hooks";

import {
    Container,
    FlexContainer,
    Header,
    Profile,
} from "components";

function UserProfile(props) {

    const { userData, loggedInAsGuest } = useUserData();

    const addFriendButtonRef = useRef();

    useEffect(() => {
        const button = addFriendButtonRef.current;

        axios.get("/profile")

        function addFriend(e) {
            console.log("click");
        }

        button.addEventListener("click", addFriend);

        return () => {
            button.removeEventListener("click", addFriend);
        };
    });

    return (
        <>
            <Header />
            <Container>
                <FlexContainer>
                    <Profile 
                        userData={userData}
                        addFriendButtonRef={addFriendButtonRef}
                    />
                </FlexContainer>
            </Container>
        </>
    )
}

export default UserProfile;
