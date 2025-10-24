import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import dbConnect from "../../../util/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Phone & Password",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          if (!credentials?.phoneNumber || !credentials?.password) {
            throw new Error("Phone number and password are required");
          }

          // Find user by phone
          const user = await User.findOne({ 
            phoneNumber: credentials.phoneNumber.trim() 
          });
          
          if (!user) {
            throw new Error("No account found with this phone number");
          }

          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Invalid password");
          }

          // Return user data for session
          return {
            id: user._id.toString(),
            name: user.fullName,
            phone: user.phoneNumber,
            email: user.email || null
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.phone) {
        session.user.phone = token.phone;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
};