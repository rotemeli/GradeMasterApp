export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  institution: string;
}

export interface IChangePasswordData {
  email: string;
  currentPassword: string;
  newPassword: string;
}
