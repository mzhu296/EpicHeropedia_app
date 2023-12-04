import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";

function App() {
  const user = localStorage.getItem("token");

  return (
    <>
      <Routes>
        {user && <Route path="/" element={<Home />} />}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
      {<ToastContainer /> }
    </>
  );
}

export default App;
