import React from "react";
import Header from "../components/Header.js";

function Home() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => setData(data.message));
    }, []);

    return (
        <div className="Home">
            <Header />
            <p>{!data ? "Loading..." : data}</p>
        </div>
    );
}

export default Home;
