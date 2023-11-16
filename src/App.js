import {
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import InstaGenerator from "./pages/InstaGenerator";
import PayMeBack from "./pages/PayMeBack.tsx";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path={"/"} exact element={<Home />} />
          <Route path={"/insta-generator"} exact element={<InstaGenerator />} />
          <Route path={"/pay-me-back"} exact element={<PayMeBack />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
