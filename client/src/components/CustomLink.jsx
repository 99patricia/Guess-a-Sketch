import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
    color: var(--primary);
    text-align: center;
`;

function CustomLink(props) {
    return <StyledLink {...props}>{props.children}</StyledLink>;
}

export default CustomLink;
