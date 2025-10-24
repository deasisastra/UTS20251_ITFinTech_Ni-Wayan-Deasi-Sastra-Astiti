import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import Input from "../../components/form/Input";
import Title from "../../components/ui/Title";
import { registerSchema } from "../../schema/register";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Register = () => {
  const { push } = useRouter();
  const onSubmit = async (values, actions) => {
    try {
      // Save pending registration in localStorage so verify page can create the user after OTP
      if (typeof window !== "undefined") {
        window.localStorage.setItem("pendingRegistration", JSON.stringify(values));
      }

      // Send OTP first (allow send endpoint to work for new phone numbers)
      console.log("Sending OTP to", values.phoneNumber);
      await axios.post(`/api/otp/send`, {
        phoneNumber: values.phoneNumber,
      });

      toast.success("OTP sent to your phone. Please verify.");
      push({ pathname: "/auth/verify", query: { phone: values.phoneNumber } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
      console.log(err);
    }
    actions.resetForm();
  };
  const { values, errors, touched, handleSubmit, handleChange, handleBlur } =
    useFormik({
      initialValues: {
        fullName: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      },
      onSubmit,
      validationSchema: registerSchema,
    });

  const inputs = [
    {
      id: 1,
      name: "fullName",
      type: "text",
      placeholder: "Your Full Name",
      value: values.fullName,
      errorMessage: errors.fullName,
      touched: touched.fullName,
    },
    {
      id: 2,
      name: "phoneNumber",
      type: "text",
      placeholder: "Your Phone Number (e.g. +628123...)",
      value: values.phoneNumber,
      errorMessage: errors.phoneNumber,
      touched: touched.phoneNumber,
    },
    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Your Password",
      value: values.password,
      errorMessage: errors.password,
      touched: touched.password,
    },
    {
      id: 4,
      name: "confirmPassword",
      type: "password",
      placeholder: "Your Password Again",
      value: values.confirmPassword,
      errorMessage: errors.confirmPassword,
      touched: touched.confirmPassword,
    },
  ];

  return (
    <div className="container mx-auto">
      <form
        className="flex flex-col items-center my-20 md:w-1/2 w-full mx-auto"
        onSubmit={handleSubmit}
      >
        <Title addClass="text-[40px] mb-6">Register</Title>
        <div className="flex flex-col gap-y-3 w-full">
          {inputs.map((input) => (
            <Input
              key={input.id}
              {...input}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}
        </div>
        <div className="flex flex-col w-full gap-y-3 mt-6">
          <button
            className="btn-primary"
            type="submit"
            onClick={(e) => {
              // extra log so we can tell if clicks reach the handler in browser
              console.log("REGISTER button clicked");
              // ensure Formik's submit handler runs
              handleSubmit(e);
            }}
          >
            REGISTER
          </button>
          <Link href="/auth/login">
            <span className="text-sm underline cursor-pointer text-secondary">
              Do you have an account?
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
