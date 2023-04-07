import React from "react";
import styled from "styled-components";

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

    box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.2);
`;

const UserInfoText = styled.p`
    padding-left: 1.5rem;
    margin: 0;
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
    box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.2);

    -webkit-transition: background-color 0.05s ease-out;
    -moz-transition: background-color 0.05s ease-out;
    -o-transition: background-color 0.05s ease-out;
    transition: background-color 0.05s ease-out;

    :active {
        background-color: var(--primary);
    }
    
    :not(:last-child) {
        margin: ${(props) => (props.column ? "1rem 0" : "0 1rem")};
    }
`;

function ProfileInfo(props) {

    const { userData, addFriendButtonRef } = { ...props };

    return (
        <>
            <UserInfoContainer>
                <UserImage src={userData.avatar} />
                <div>
                    <UserInfoText>
                        {userData.username} <br/>
                        WINS: {userData.win} <br/> 
                        POINTS: {userData.currency} <br/>
                        <AddFriendButton ref={addFriendButtonRef}>
                            ADD FRIEND
                        </AddFriendButton>
                    </UserInfoText>
                </div>
            </UserInfoContainer>
        </>
    )
}

export default ProfileInfo