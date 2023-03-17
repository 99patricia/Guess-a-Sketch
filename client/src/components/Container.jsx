import React from "react";
import styled from "styled-components";
import { Mobile } from "service/mediaQueries";

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    top: ${(props) => (props.isMobile ? "80px" : "0")};
    position: absolute;
    z-index: 0;
`;

function Container(props) {
    const isMobile = Mobile();
    return (
        <StyledContainer isMobile={isMobile}>{props.children}</StyledContainer>
    );
}

export default Container;
