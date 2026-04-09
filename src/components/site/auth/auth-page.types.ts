export type AuthMode = "login" | "register";

export const emptyAuthForm = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
};

export type AuthFormState = typeof emptyAuthForm;
