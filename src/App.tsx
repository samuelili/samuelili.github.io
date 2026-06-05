import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import InstaGenerator from "./pages/InstaGenerator";
import FilmScanLight from "./apps/film-scan-light/FilmScanLight";

function PayMeBackRedirect() {
  useEffect(() => {
    window.location.replace("https://gimmemy.money");
  }, []);
  return null;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/film-scan-light"} element={<FilmScanLight />} />
          <Route path={"/insta-generator"} element={<InstaGenerator />} />
          <Route path={"/pay-me-back"} element={<PayMeBackRedirect />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
