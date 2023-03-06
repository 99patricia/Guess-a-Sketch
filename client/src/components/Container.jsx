import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;

    > div {
        margin: 1rem;
    }
`;

function Container(props) {
    return <StyledContainer>{props.children}</StyledContainer>;
}

export default Container;
