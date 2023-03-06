import React from "react";
import styled from "styled-components";

const StyledCanvas = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    border-radius: 1rem;
    width: 500px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

function Canvas(props) {
    return <StyledCanvas>{props.children}</StyledCanvas>;
}

export default Canvas;
