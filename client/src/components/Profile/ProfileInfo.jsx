import React from "react";
import styled from "styled-components";

import { IconButton } from "components";

const UserInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: top;
    padding: 1rem;
    padding-left: 0;
    margin: 1rem;
    height: 8rem;
`;

const UserImage = styled.img`
    display: block;
    border-radius: 50%;
    width: 105px;
    height: 105px;
    overflow: auto;

    box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.2);
`;

const UserInfoText = styled.p`
    padding-left: 1.5rem;
    font-size: 1rem;
    line-height: 1.3rem;
    margin: 0;
`;

const EditButton = styled.button`
    border-radius: 100%;
    border: none;
    color: var(--primary);
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
    cursor: pointer;
    position: absolute;
    margin: 1rem;
    margin-top: 1.5rem;
    background-color: RGB(0, 0, 0, 0.05);

    :active {
        color: var(--secondary);
    }
`;

const AddFriendButton = styled.button`
    background-color: var(--secondary);
    font-family: var(--font);
    font-size: 1rem;
    text-transform: uppercase;
    color: var(--white);
    cursor: pointer;
    width: 130px;

    margin-top: 0.5rem;
    padding: 0.5rem 0.5rem;
    display: block;
    border: 0;
    border-radius: 1rem;
    box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.2);

    -webkit-transition: background-color 0.05s ease-out;
    -moz-transition: background-color 0.05s ease-out;
    -o-transition: background-color 0.05s ease-out;
    transition: background-color 0.05s ease-out;

    :active {
        background-color: var(--primary);
    }
`;

function ProfileInfo(props) {

    const { userData, profileData, loggedInAsGuest, addFriendButtonRef } = { ...props };

    return (
        <>
            <EditButton>
                <i className="bi-pencil-fill"/>
            </EditButton>
            <UserInfoContainer>
                <UserImage src={userData.avatar} />
                <div>
                    <UserInfoText>
                        {loggedInAsGuest ? (
                            <>
                            Guest user: {userData.username} <br/><br/>
                            Create an account to see your profile...
                            </>
                        ) : (
                            <>
                            {userData.username} <br/>
                            WINS: {profileData.win} <br/> 
                            POINTS: {profileData.currency} <br/>
                            <AddFriendButton ref={addFriendButtonRef}>
                                ADD FRIEND
                            </AddFriendButton>
                            </>
                        ) }
                    </UserInfoText>
                </div>
            </UserInfoContainer>
        </>
    )
}

export default ProfileInfo