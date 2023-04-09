import React from "react";
import styled from "styled-components";
import { useUserData } from "hooks";

const InventoryContainer = styled.div`
    display: grid;
`;

const InventoryItem = styled.div`
    background-color: var(--beige);
`;

function Inventory(props) {
    return (
        <InventoryContainer>
            <InventoryItem>Item</InventoryItem>
            <InventoryItem>Item</InventoryItem>
            <InventoryItem>Item</InventoryItem>
            <InventoryItem>Item</InventoryItem>
        </InventoryContainer>
    );
}

export default Inventory;
