import api from "./api";

export const loginUser = (data: { email: string; password: string }) =>
  api.post("/users/login", data);