import createService from "./base.service";

const instance = createService();
const securedInstance = createService(true);

export const login = async (username, password) => {
  const res = await instance.post("/auth/login", { username, password });
  const user = res.data;
  sessionStorage.setItem("auth", user.token);
  return { ...user, token: null };
};

export const logout = (username) =>
  securedInstance.post("/auth/logout", username);

export const getLoggedUsers = () => securedInstance.get("/auth/logged-users");

const userService = {
  login,
  logout,
  getLoggedUsers,
};

export default userService;
