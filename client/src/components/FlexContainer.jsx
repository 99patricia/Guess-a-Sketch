import React from "react";
import styled from "styled-components";

const StyledFlexContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    min-height: 70vh;
    max-height: 70vh;

    > div {
        margin: 0.5rem;
    }
`;

function FlexContainer(props) {
    return <StyledFlexContainer>{props.children}</StyledFlexContainer>;
}

export default FlexContainer;
