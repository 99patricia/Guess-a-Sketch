import React from "react";
import styled from "styled-components";

const StyledIconButton = styled.button`
    border-radius: 100%;
    border: none;
    color: var(--secondary);
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
    cursor: pointer;
`;

const IconButton = React.forwardRef((props, ref) => {
    return (
        <StyledIconButton {...props} ref={ref}>
            <i className={`bi ${props.iconClassName}`}></i>
        </StyledIconButton>
    );
});

export default IconButton;
