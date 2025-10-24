import { useFormik } from "formik";
import Link from "next/link";
import Input from "../../components/form/Input";
import Title from "../../components/ui/Title";
import { loginSchema } from "../../schema/login";
import * as Yup from "yup";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [currentUser, setCurrentUser] = useState();

  const onSubmit = async (values, actions) => {
    const { username, phoneNumber, password, isAdmin } = values;
    if (isAdmin) {
      try {
        console.log("Attempting admin login with:", { username });
        // Try admin login
        const res = await axios.post("/api/admin", {
          username,
          password,
        });
        console.log("Admin login response:", res.status);
        if (res.status === 200) {
          toast.success("Admin login successful", { position: "bottom-left", theme: "colored" });
          // Redirect directly to admin dashboard
          push('/admin/profile');
          return;
        }
      } catch (err) {
        console.error("Admin login error:", err.response?.data || err);
        toast.error(err.response?.data?.message || "Admin login failed");
        return;
      }
    }
    // Regular user login (by phone number)
    try {
      console.log("Attempting login with phone:", phoneNumber);
      const res = await signIn("credentials", {
        redirect: false,
        phoneNumber: phoneNumber.trim(),
        password
      });
      
      if (res?.error) {
        console.error("Login error:", res.error);
        toast.error(res.error);
      } else if (res?.ok) {
        actions.resetForm();
        toast.success("Login successful!");
        push("/"); // First redirect to home
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (!session) return; // Don't do anything if there's no session
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
        setCurrentUser(
          res.data?.find((user) => user.email === session?.user?.email)
        );
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [session]);

  const { values, errors, touched, handleSubmit, handleChange, handleBlur } =
    useFormik({
      initialValues: {
        username: "",
        phoneNumber: "",
        password: "",
        isAdmin: false,
      },
      onSubmit,
      validationSchema: Yup.object().shape({
        username: Yup.string().when('isAdmin', {
          is: true,
          then: () => Yup.string().required('Admin username is required'),
          otherwise: () => Yup.string(),
        }),
        phoneNumber: Yup.string().when('isAdmin', {
          is: false,
          then: () => Yup.string()
            .required("Phone number is required.")
            .matches(/^[0-9+]{6,15}$/, "Phone number is invalid."),
          otherwise: () => Yup.string(),
        }),
        password: Yup.string()
          .required("Password is required.")
          .min(8, "Password must be at least 8 characters."),
        isAdmin: Yup.boolean(),
      }),
    });

  const firstInput = values.isAdmin
    ? {
        id: 1,
        name: "username",
        type: "text",
        placeholder: "Enter Admin Username",
        value: values.username,
        errorMessage: errors.username,
        touched: touched.username,
      }
    : {
        id: 1,
        name: "phoneNumber",
        type: "text",
        placeholder: "Your Phone Number (e.g. +628123...)",
        value: values.phoneNumber,
        errorMessage: errors.phoneNumber,
        touched: touched.phoneNumber,
      };

  const inputs = [
    firstInput,
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: values.isAdmin ? "Enter Admin Password" : "Your Password",
      value: values.password,
      errorMessage: errors.password,
      touched: touched.password,
    },
  ];

  return (
    <div className="container mx-auto">
      <form
        className="flex flex-col items-center my-20 md:w-1/2 w-full mx-auto"
        onSubmit={handleSubmit}
      >
        <Title addClass="text-[40px] mb-6">Login</Title>
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
          <label className="flex items-center gap-x-2">
            <input
              type="checkbox"
              name="isAdmin"
              onChange={handleChange}
              checked={values.isAdmin}
            />
            <span className="text-sm text-gray-700">Login as Admin</span>
          </label>
          
          <button className="btn-primary" type="submit">
            {values.isAdmin ? 'ADMIN LOGIN' : 'LOGIN'}
          </button>
          
          {!values.isAdmin && (
            <Link href="/auth/register">
              <span className="text-sm underline cursor-pointer text-secondary">
                Don&#39;t have an account?
              </span>
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  // Simply return empty props without any redirection
  return {
    props: {},
  };
}

export default Login;
