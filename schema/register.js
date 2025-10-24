import * as Yup from "yup";

export const registerSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required.")
    .min(3, "Full name must be at least 3 characters."),
  phoneNumber: Yup.string()
    .required("Phone number is required.")
    .matches(/^\+?[0-9]{6,15}$/, "Phone number must be between 6-15 digits and can start with +"),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters."),
  confirmPassword: Yup.string()
    .required("Confirm password is required.")
    .oneOf([Yup.ref("password")], "Passwords must match."),
});
