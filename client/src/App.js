import "./App.css";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/chat/:chatId" element={<Room />} />
        </Routes>
    );
}

export default App;
