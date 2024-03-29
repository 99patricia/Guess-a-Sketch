import React from "react";
import { Desktop } from "service/mediaQueries";
import styled from "styled-components";

const StyledFlexContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: ${(props) => (props.isDesktop ? "row" : "column")};

    > div {
        margin: 0 0.5rem;
    }
`;

function FlexContainer(props) {
    const isDesktop = Desktop();
    return (
        <StyledFlexContainer isDesktop={isDesktop}>
            {props.children}
        </StyledFlexContainer>
    );
}

export default FlexContainer;
