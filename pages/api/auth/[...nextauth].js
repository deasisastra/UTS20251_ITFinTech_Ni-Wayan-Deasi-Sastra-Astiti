import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import dbConnect from "../../../util/dbConnect";
import bcrypt from "bcryptjs";

dbConnect();

export default NextAuth({
  /*  adapter: MongoDBAdapter(clientPromise), */
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text", placeholder: "+1234567890" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          await dbConnect();
          
          const { phoneNumber, password } = credentials;
          
          const user = await User.findOne({ phoneNumber });
          
          if (!user) {
            throw new Error("You haven't registered yet!");
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            name: user.fullName,
            phone: user.phoneNumber,
            email: user.email
          };
        } catch (err) {
          console.error("Auth error:", err);
          throw err;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.phone = token.phone;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key"
});

const signInUser = async ({ user, password }) => {
  if (!user || !password) {
    console.log("Missing user or password");
    return false;
  }
  
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", user.phoneNumber);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Password comparison error:", err);
    return false;
  }
};
