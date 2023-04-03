import React from "react";
import styled from "styled-components";
import { Mobile } from "service/mediaQueries";

const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 100px);
`;

function Container(props) {
    const isMobile = Mobile();
    return (
        <StyledContainer isMobile={isMobile}>{props.children}</StyledContainer>
    );
}

export default Container;
