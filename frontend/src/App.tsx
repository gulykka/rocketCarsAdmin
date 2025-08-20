import Header from "./components/Header";
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from "./components/router/AppRouter";
import Footer from "./components/Footer";

function App() {
    return (
        <Router>
            <div className="App">
                <Header/>
                <Footer />
                <AppRouter />
            </div>
        </Router>
    );
}

export default App;
