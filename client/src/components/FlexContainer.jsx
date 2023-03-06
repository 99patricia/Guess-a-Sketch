import React from "react";
import styled from "styled-components";

const StyledFlexContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;

    > div {
        margin: 1rem;
    }
`;

function FlexContainer(props) {
    return (
        <StyledFlexContainer>
            {props.children}
        </StyledFlexContainer>
    );
}

export default FlexContainer;
