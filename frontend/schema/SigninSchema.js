import * as Yup from "yup";

const SigninSchema = Yup.object().shape({
  email: Yup.string()
    .lowercase("Email has to all lowercase.")
    .email("Enter a valid email address.")
    .required("Email can't be blank."),
  password: Yup.string()
    .required("Password can't be blank")
    .min(8, "Password must be at least 8 characters long."),
});

export default SigninSchema;
