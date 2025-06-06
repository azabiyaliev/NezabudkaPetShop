export const apiUrl = import.meta.env.VITE_API_URL;
export const GOOGLE_CLIENT_ID =
  "189315158471-154cdadde184phelm6qsv3vnqq3g152n.apps.googleusercontent.com";

export const regPhone = /^(\+996|0)\s?\d{3}\s?\d{3}\s?\d{3}$/;
export const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const reqPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
export const userRoleClient = "client";
export const userRoleAdmin = "admin";
export const userRoleSuperAdmin = "superAdmin";