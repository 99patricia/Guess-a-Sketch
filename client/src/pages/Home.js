import React from "react";
import Header from "../components/Header.js";
import axios from "axios";

function Home() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        axios.get("/api")
            .then((res) => setData(res.data.message));
    }, []);

    return (
        <div className="Home">
            <Header />
            <p>{!data ? "Loading..." : data}</p>
        </div>
    );
}

export default Home;
