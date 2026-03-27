
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import User from "./models/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  // auth options
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: 'email' },
        password: { label: "Password", type: "password" },
      },
      async authorize(request) {
        await connectDB()

        const email = request.email
        const password = request.password as string

        const user = await User.findOne({email})
        if(!user) throw new Error('Bhai, Invalid credentials!')

        const isMatch = bcrypt.compare(password, user.password)
        if(!isMatch) throw new Error('Bhai, Invalid credentials!')

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({user, account}) {
      if(account?.provider == 'google') {
        await connectDB()
        let db_user = await User.findOne({email: user.email})
        if(!db_user){
          db_user = await User.create({
            name: user.name,
            email: user.email,
            image: user.image
          })
        }
        user.id = db_user._id.toString()
        user.role = db_user.role
      }
      return true
    },

    // this callback is uded to add user info in the token after successful login
    jwt({token, user, trigger, session}) {
      if(user) {
        token.id = user.id,
        token.name = user.name,
        token.email = user.email,
        token.role = user.role
      }
      if(trigger == 'update') token.role = session.role
      return token
    },

    // this callback is used to send properties to the client, like an access_token from a provider. 
    session({session, token}) {
      if(session?.user) {
        session.user.id = token.id as string,
        session.user.name = token.name as string,
        session.user.email = token.email as string,
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 10*60*60*24*1000, // 10 day
  },
  secret: process.env.AUTH_SECRET
})