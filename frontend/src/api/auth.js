import api from "./axios";

export const getMe = () => api.get("/auth/me").then((r) => r.data);

export const login = (email, password) =>
  api.post("/auth/login", { email, password }).then((r) => r.data);

export const signup = (email, password) =>
  api.post("/auth/signup", { email, password }).then((r) => r.data);

export const logout = () => api.post("/auth/logout").then((r) => r.data);

export const checkEmail = (email) =>
  api.post("/auth/check-email", { email }).then((r) => r.data);
