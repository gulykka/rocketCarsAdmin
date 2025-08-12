import Header from "./components/Header";
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from "./components/router/AppRouter";

function App() {
    return (
        <Router>
            <div className="App">
                <Header/>
                <AppRouter />
            </div>
        </Router>
    );
}

export default App;
