import "./App.css";
import bootstrap from "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homescreen from "./screens/Homescreen";
import Loginscreen from "./screens/Loginscreen";
import Registerscreen from "./screens/Registerscreen";
import Footer from "./components/Footer";
import { useSelector } from "react-redux";
import Errorscreen from "./screens/Errorscreen";
import Apodscreen from "./screens/Apodscreen";
import MarsRoverscreen from "./screens/MarsRoverscreen";

import Earthscreen from "./screens/Earthscreen";
import Asteroidscreen from "./screens/Asteroidscreen";

function App() {
  const userstate = useSelector((state) => state.loginUserReducer);

  const { currentUser } = userstate;

  return (
    <div className="App">
      <Navbar />

      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Homescreen />} />
          <Route path="/login" exact element={<Loginscreen />} />
          <Route path="/register" exact element={<Registerscreen />} />
          <Route path="/mars" exact element={<MarsRoverscreen />} />
          <Route path="/apod" exact element={<Apodscreen />} />
          <Route path="/epic" exact element={<Asteroidscreen />} />
          <Route path="/earth" exact element={<Earthscreen />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
