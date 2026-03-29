import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const API_URL = import.meta.env.VITE_API_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Endpoints = {
  user: {
    signUp: `${API_URL}auth/sign-up`,
    signIn: `${API_URL}auth/sign-in`,
  },
  logbooks: {
    getAll: `${API_URL}logbooks/get-all`,
    getAllByUser: (email: string) => `${API_URL}logbooks/get-all-by-user?userEmail=${email}`,
    getOne: (id: string) => `${API_URL}logbooks/get-one?id=${id}`,
    create: `${API_URL}logbooks/create`,
    update: (id: string) => `${API_URL}logbooks/update?id=${id}`,
    delete: (id: string) => `${API_URL}logbooks/delete/${id}`,
  },
  logbookRecords: {
    getAll: `${API_URL}logbook-records/get-all`,
    getAllByLogbook: (id: string) => `${API_URL}logbook-records/get-all-by-logbook?id=${id}`,
    getOne: (id: string) => `${API_URL}logbook-records/get-one?id=${id}`,
    create: `${API_URL}logbook-records/create`,
    update: (id: string) => `${API_URL}logbook-records/update?id=${id}`,
    delete: (id: string) => `${API_URL}logbook-records/delete/${id}`,
  },
  wallet: {
    get: (email: string) => `${API_URL}wallet?userEmail=${email}`,
  }
}