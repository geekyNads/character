import React from "react";
import ThreeCanvas from "./components/ThreeCanvas";
import Portfolio from "./components/Portfolio";
import Navbar, { ScrollProgress } from "./components/Navbar";

function App() {
    return (
        <div className="app-wrapper">
            {/* Top scroll progress loader indicator */}
            <ScrollProgress />

            {/* Top floating navigation bar */}
            <Navbar />

            {/* The fixed 3D canvas rendering in the background */}
            <ThreeCanvas />

            {/* Scrollable portfolio sections in the foreground */}
            <Portfolio />
        </div>
    );
}

export default App;
