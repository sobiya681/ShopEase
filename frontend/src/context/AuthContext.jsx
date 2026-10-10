import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem("token", data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    localStorage.setItem("token", data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
