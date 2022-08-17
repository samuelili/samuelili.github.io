import './App.css';
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import InstaGenerator from "./pages/InstaGenerator";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path={"/"} exact element={<Home/>}/>
          <Route path={"/insta-generator"} exact element={<InstaGenerator/>}/>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
