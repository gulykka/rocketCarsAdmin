import Header from "./components/Header";
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from "./components/router/AppRouter";
import Footer from "./components/Footer";
import React from "react";

function App() {
    return (
        <Router>
            <div className="App">
                <Header/>
                <AppRouter />
                <Footer />
            </div>
        </Router>
    );
}

export default App;
