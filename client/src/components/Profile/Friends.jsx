import React from "react";
import styled from "styled-components";

const FriendsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(auto-fill);
    padding: 0.5rem;
    grid-gap: 0.5rem;
    height: 100%;
    overflow-y: auto;
    // border: 1px solid red;
`;

const FriendCard = styled.div`
    display: grid;
    grid-template-columns: 0.5fr 2fr;
    align-items: left;
    text-align: left;
    vertical-align: middle;

    background-color: var(--white);
    border-radius: 1rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
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

    const { friendList } = { ...props };
    // console.log(friendList);

    return (
        <>
        <FriendsGrid>
            {friendList.map(({ id, username, avatar }) => (
                    <FriendCard
                        key={id}
                    >
                        <UserImageDiv>
                            <UserImage src={avatar} />
                        </UserImageDiv>
                        <p>
                            {username}<br/>
                        </p>
                    </FriendCard>
                )
            )}
        </FriendsGrid>
        </>
    )
}

export default Friends;