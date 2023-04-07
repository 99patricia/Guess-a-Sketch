import React from "react";
import styled from "styled-components";

import { ProfileInfo } from "components/Profile/"

const ProfileContainer = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    padding-top: 0.5rem;
    border-radius: 1rem;
    width: 500px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-flow: row;
`;

function Profile(props) {

    const { userData, addFriendButtonRef } = { ...props };

    return (
        <>
            <ProfileContainer>
                <ProfileInfo 
                    userData={userData}
                    addFriendButtonRef={addFriendButtonRef}
                />
            </ProfileContainer>
        </>
    )
}

export default Profile