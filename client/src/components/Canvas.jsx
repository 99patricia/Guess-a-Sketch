import React from "react";
import styled from "styled-components";

const StyledCanvas = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    border-radius: 1rem;
`;

function Canvas(props) {
    return <StyledCanvas>{props.children}</StyledCanvas>;
}

export default Canvas;
