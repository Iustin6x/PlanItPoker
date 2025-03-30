
import { UUID } from "../../types";
import { User } from "../user";

export interface AuthUser extends User {
    token: string;
    refreshToken: string;
  }

export interface GuestSession {
    id: string;
    name: string;
    tempToken: string;
  }

