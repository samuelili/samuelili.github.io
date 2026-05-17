import { HashRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import InstaGenerator from './pages/InstaGenerator'
import PayMeBack from './apps/pay-me-back/components/PayMeBack'

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/insta-generator"} element={<InstaGenerator />} />
          <Route path={"/pay-me-back"} element={<PayMeBack />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
