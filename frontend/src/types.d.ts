export interface RegisterMutation {
  firstName: string;
  secondName: string;
  email: string;
  password: string;
  phone: string;
}

export interface LogInMutation {
  email: string;
  password: string;
}

export interface User {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  role: string;
  token: string;
  phone: string;
}

export interface AdminRefactor {
  firstName: string;
  secondName: string;
  email: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
      name: string;
    };
  };
  name: string;
  message: string;
}

export interface GlobalError {
  error: string;
}

export interface EditSiteMutation {
  id: number;
  instagram: string;
  whatsapp: string;
  schedule: string;
  address: string;
  email: string;
  phone: string;
  logo: File | null;
}

export interface SiteMutation {
  instagram: string;
  whatsapp: string;
  schedule: string;
  address: string;
  email: string;
  phone: string;
  logo: File | null;
}

export interface ICategories {
  id: number;
  title: string;
  parentId: boolean;
}
