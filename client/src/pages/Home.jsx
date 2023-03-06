import React from "react";
import axios from "axios";

import { Button, Header, FlexContainer, Form, FormInput } from "components";

function Home() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        axios.get("/api").then((res) => setData(res.data.message));
    }, []);

    return (
        <>
            <Header />
            <FlexContainer>
                <Form>
                    <FormInput
                        label="Join a room"
                        placeholder="Enter room code"
                        type="text"
                    ></FormInput>
                    <FormInput
                        label="Nickname"
                        placeholder="Enter nickname"
                        type="text"
                    ></FormInput>
                    <Button column>Join</Button>
                    <Button column secondary>
                        Create a new room
                    </Button>
                </Form>
            </FlexContainer>
        </>
    );
}

export default Home;
