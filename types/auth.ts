export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}


export interface ILoginRequest {
  email: string;
  password: string;
}


export interface VerfySession {
  isValid:  boolean;
  token:    string;
  userInfo: IUser;
}


export interface PatientDto {
  name: string;
  email: string;
  gender: string;
  phone: string;
  documentNumber: string;
  dateOfBirth: string;
  address: string;
  eps: string;
  bloodType: string;
  clinic: string;
}



