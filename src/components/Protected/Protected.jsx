import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function Protected() {
  const token = localStorage.getItem("token");
  const uid = localStorage.getItem("uid");
  return token && uid ? <Outlet /> : <Navigate to="/login" />;
}

export default Protected;
