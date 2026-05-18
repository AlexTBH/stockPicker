import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  name: string;
  role: "User" | "Admin";
};

export function decodeToken(token: string): DecodedToken {
  return jwtDecode<DecodedToken>(token);
}