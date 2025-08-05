export interface RegisterPostData {
  fullName: string;
  email: string;
  password: string;
}

export interface User {
  fullName: string;
  email: string;
}

export interface User extends RegisterPostData {
  id: string;
}
