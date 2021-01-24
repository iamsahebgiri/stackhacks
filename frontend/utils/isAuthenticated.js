import { isJWT } from "validator";

const isAuthenticted = () => {
  const token = localStorage.getItem("token");
  if (token && isJWT(token)) {
    return true;
  }
  return false;
};

export default isAuthenticted;
