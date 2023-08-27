import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import MessageSystem from "./pages/MessageSystem";
import { useSelector } from "react-redux";

const App = () => {
  const { authenticated } = useSelector((state) => state.user);

  if (!authenticated) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<MessageSystem />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
