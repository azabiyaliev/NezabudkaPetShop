import { AppDispatch, RootState } from "./store.ts";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { User } from '../types';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const usePermission = (user: User | null) => {
  return (roles: string[]): boolean => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };
};