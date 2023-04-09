import React from "react";
import styled from "styled-components";
import { Desktop } from "service/mediaQueries";

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    min-height: ${(props) =>
        props.isDesktop ? "calc(100vh - 100px)" : "calc(100vh - 60px)"};
`;

function Container(props) {
    const isDesktop = Desktop();
    return (
        <StyledContainer isDesktop={isDesktop}>
            {props.children}
        </StyledContainer>
    );
}

export default Container;
