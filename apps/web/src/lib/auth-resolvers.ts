import { RegisterRequest, LoginRequest } from "@flow/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const registerResolver = zodResolver(RegisterRequest);
export const loginResolver = zodResolver(LoginRequest);

export type RegisterFormData = z.infer<typeof RegisterRequest>;
export type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export type LoginResolverInput = z.infer<typeof LoginRequest>;