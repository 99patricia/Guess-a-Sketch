import React from "react";
import styled from "styled-components";
import axios from "axios";

const FriendsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    padding: 0.5rem;
    grid-gap: 0.5rem;
    height: 100%;
    overflow-y: auto;
    // border: 1px solid red;
`;

const FriendCard = styled.div`
    display: grid;
    grid-template-columns: 0.5fr 2fr;
    align-items: center;
    text-align: left;
    vertical-align: middle;

    background-color: var(--white);
    border-radius: 1rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

const FriendRequestCard = styled.div`
    display: grid;
    grid-template-columns: 0.5fr 0.75fr 0.75fr 0.75fr;
    align-items: center;
    text-align: left;
    vertical-align: middle;

    background-color: var(--white);
    border-radius: 1rem;
    border: 1px solid var(--primary);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

const RequestButton = styled.button`
    background-color: ${(props) =>
        props.secondary ? "var(--secondary)" : "var(--primary)"};
    font-family: var(--font);
    font-size: 1rem;
    text-transform: uppercase;
    color: var(--white);
    cursor: pointer;
    width: auto;

    margin: 0rem 0.25rem;
    padding: 0.5rem 0rem;
    display: block;
    border: 0;
    border-radius: 1rem;
    box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.2);

    -webkit-transition: background-color 0.05s ease-out;
    -moz-transition: background-color 0.05s ease-out;
    -o-transition: background-color 0.05s ease-out;
    transition: background-color 0.05s ease-out;

    :active {
        background-color: ${(props) =>
            props.secondary ? "var(--primary)" : "var(--secondary)"};
    }
`;

const UserImageDiv = styled.div`
    margin: 0.5rem;
    display: flex;
    align-items: center;
`;

const UserImage = styled.img`
    display: block;
    width: 40px;
    border-radius: 50%;

    box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.2);
`;

function Friends(props) {
    const { viewingOwnProfile, friendRequestList, friendList, forceUpdate } = {
        ...props,
    };

    async function accept(id, sender_id, recipient_id) {
        const body = {
            request_id: id,
            sender_id,
            recipient_id,
        };
        console.log(body);
        const options = {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        };

        axios.post("/friend_request/accept", body, options).then((res) => {
            forceUpdate();
        });
    }

    async function decline(id) {
        const body = {
            request_id: id,
        };
        const options = {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        };

        axios.post("/friend_request/reject", body, options).then((res) => {
            forceUpdate();
        });
    }

    return (
        <>
            <FriendsGrid>
                {viewingOwnProfile &&
                    friendRequestList.map(
                        ({
                            request_id,
                            sender_id,
                            recipient_id,
                            direction,
                            status,
                        }) => (
                            <>
                                {direction === "outgoing" &&
                                    status === "pending" && (
                                        <FriendRequestCard key={request_id}>
                                            <UserImageDiv>
                                                <UserImage
                                                    src={sender_id.avatar}
                                                />
                                            </UserImageDiv>
                                            <a
                                                href={`/profile/${sender_id.sender_id}`}
                                            >
                                                {sender_id.username}
                                            </a>
                                            <RequestButton
                                                onClick={() =>
                                                    accept(
                                                        request_id,
                                                        sender_id.sender_id,
                                                        recipient_id
                                                    )
                                                }
                                            >
                                                <i className="bi bi-check-lg" />
                                            </RequestButton>
                                            <RequestButton
                                                secondary
                                                onClick={() =>
                                                    decline(request_id)
                                                }
                                            >
                                                <i className="bi bi-x-lg" />
                                            </RequestButton>
                                        </FriendRequestCard>
                                    )}
                            </>
                        )
                    )}
                {friendList.map(({ id, username, avatar }) => (
                    <FriendCard key={id}>
                        <UserImageDiv>
                            <UserImage src={avatar} />
                        </UserImageDiv>
                        <a href={`/profile/${id}`}>{username}</a>
                    </FriendCard>
                ))}
            </FriendsGrid>
        </>
    );
}

export default Friends;
