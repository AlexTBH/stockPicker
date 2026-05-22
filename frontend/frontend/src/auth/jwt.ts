import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  name: string;
  role: "User" | "Admin";
};

export function decodeToken(token: string) {
  const decoded = jwtDecode<any>(token);
  return {
    name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as "User" | "Admin"
  };
}