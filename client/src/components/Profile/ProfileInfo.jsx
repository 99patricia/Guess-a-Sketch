import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

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

const StyledInputContainer = styled.div`
    background-color: var(--white);
    border-radius: 0.5rem;
    display: flex;
    // flex-direction: column;
    align-items: center;
    vertical-align: middle;
    // padding: 1rem 0.5rem;
    height: 50px;
    width: 250px;
    margin-left: 1rem;
    margin-top: -100px;
    position: absolute;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

const AddFriendForm = styled.form`
    display: flex;
    align-items: center;
    vertical-align: middle;
    // width: 50%;
    padding: 0rem 0.5rem;
`;

const StyledInput = styled.input`
    // padding: 0.7rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--beige);
    font-size: 1.2rem;
    color: var(--primary);

    padding: 0rem 0.25rem;
    width: 70%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    :focus {
        border: 1px solid var(--primary);
        outline: 0;
    }

    ::placeholder {
        color: var(--beige);
    }
`;

const StyledFormButton = styled.button`
    background-color: var(--primary);
    font-family: var(--font);
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--white);
    cursor: pointer;
    width: 60px;

    margin-left: 0.5rem;
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
        background-color: var(--secondary);
    }
`;

const ErrorMessage = styled.div`
    position: absolute;
    font-size: 0.75rem;
    color: var(--error);
    text-align: center;
    margin-top: -3rem;
`;

function ProfileInfo(props) {
    const { viewingOwnProfile, userData, profileData, setEditAvatar } = {
        ...props,
    };

    const addFriendButtonRef = useRef();
    const [addFriend, setAddFriend] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const containerElement = document.querySelector("#addFriendContainer");
    const buttonElement = document.querySelector("#addFriendButton");
    const [addFriendName, setAddFriendName] = useState("");

    function showAddFriend() {
        setAddFriend(true);
    }

    function hideAddFriend(event) {
        if (
            !containerElement.contains(event.target) &&
            !buttonElement.contains(event.target)
        ) {
            setAddFriend(false);
            setErrorMessage("");
        }
    }

    function handleEditAvatar(event) {
        setEditAvatar(true);
    }

    const handleAddFriend = (e) => {
        e.preventDefault();

        const body = {
            sender_id: userData.id,
            recipient_username: addFriendName,
            direction: "outgoing",
            status: "pending",
        };
        const options = {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        };

        axios
            .post("/friend_request", body, options)
            .then((res) => {
                setErrorMessage("Friend request sent");
            })
            .catch((err) => {
                setErrorMessage(err.response.data.error);
            });
    };

    useEffect(() => {
        if (addFriend) {
            document.addEventListener("click", hideAddFriend);
        }

        return () => {
            document.removeEventListener("click", hideAddFriend);
        };
    }, [addFriend]);

    return (
        <>
            {viewingOwnProfile && (
                <EditButton>
                    <i className="bi-pencil-fill" onClick={handleEditAvatar} />
                </EditButton>
            )}
            <UserInfoContainer>
                <UserImage src={userData.avatar} />
                <div>
                    <UserInfoText>
                        <>
                            {userData.username} <br />
                            WINS: {profileData.win} <br />
                            POINTS: {profileData.currency} <br />
                            {viewingOwnProfile && (
                                <AddFriendButton
                                    id="addFriendButton"
                                    ref={addFriendButtonRef}
                                    onClick={showAddFriend}
                                >
                                    ADD FRIEND
                                </AddFriendButton>
                            )}
                        </>
                    </UserInfoText>
                    {addFriend ? (
                        <StyledInputContainer id="addFriendContainer">
                            {errorMessage && (
                                <ErrorMessage>{errorMessage}</ErrorMessage>
                            )}
                            <AddFriendForm onSubmit={handleAddFriend}>
                                <StyledInput
                                    type="text"
                                    placeholder="username"
                                    onChange={(e) =>
                                        setAddFriendName(e.target.value)
                                    }
                                />
                                <StyledFormButton type="submit">
                                    ADD
                                </StyledFormButton>
                            </AddFriendForm>
                        </StyledInputContainer>
                    ) : (
                        <StyledInputContainer
                            id="addFriendContainer"
                            style={{ display: "none" }}
                        ></StyledInputContainer>
                    )}
                </div>
            </UserInfoContainer>
        </>
    );
}

export default ProfileInfo;
