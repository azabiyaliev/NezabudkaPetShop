export interface RegisterMutation {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface LogInMutation {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  firstName: string;
  secondName: string;
  email: string;
  role: string;
  token: string;
  phone: string;
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
