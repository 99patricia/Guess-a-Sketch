import React from "react";

function Home() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="Home">
      <header className="Home-header">
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default Home;
