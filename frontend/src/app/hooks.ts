import { AppDispatch, RootState } from "./store.ts";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { User } from '../types';
import { useCallback } from "react";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const usePermission = (user: User | null) => {
  return useCallback((roles: string[]): boolean => {
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  },[user]);
};