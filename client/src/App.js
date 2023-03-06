import "./App.css";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { Routes, Route } from "react-router-dom";

import axios from "axios";

// prod
// axios.defaults.baseURL = "https://server-nimbe3rria-uc.a.run.app/"
axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";

function App() {
    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/chat/:chatId" element={<Room />} />
        </Routes>
    );
}

export default App;
