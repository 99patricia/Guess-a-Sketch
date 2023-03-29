import "./App.css";
import { Routes, Route } from "react-router-dom";

import { ChangePassword, Home, Login, Room } from "pages";

import axios from "axios";

// prod
// axios.defaults.baseURL = "https://guess-a-sketch-cloud-run-nimbe3rria-uc.a.run.app/"
axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded";

function App() {
    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/signup" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/changePassword" element={<ChangePassword />} />
            <Route exact path="/room/:roomId" element={<Room />} />
        </Routes>
    );
}

export default App;
