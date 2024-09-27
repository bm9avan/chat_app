import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { fetchHelperForRedis } from "./redis";

function getGoogleCridentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (typeof clientId !== "string" || clientId.length === 0) {
    throw new Error("Inalid Google clientId");
  }
  if (typeof clientSecret !== "string" || clientSecret.length === 0) {
    throw new Error("Inalid Google clientSecret");
  }
  return {
    clientId,
    clientSecret,
  };
}

function getGithubCridentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (typeof clientId !== "string" || clientId.length === 0) {
    throw new Error("Inalid Github clientId");
  }
  if (typeof clientSecret !== "string" || clientSecret.length === 0) {
    throw new Error("Inalid Github clientSecret");
  }
  return {
    clientId,
    clientSecret,
  };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  // pages: { signIn: "/" },
  providers: [
    Google(getGoogleCridentials()),
    Github(getGithubCridentials()),
    Credentials({
      name: "Cridentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "Email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        // const user = await db.get("users").get(credentials?.email).value();
        const user = { id: "", email: "", password: "" };
        // const user = (await db.get("user:email:" + credentials?.email)) as User | null;
        if (user) {
          return user.password === credentials?.password ? user : null;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      //console.log("auth.ts user: ", user, "token:", token.jti);

      const userFromDB = (await fetchHelperForRedis(
        "get",
        `user:${token.id}`
      )) as string | null;
      //console.log("auth.ts userFromDB1: ", userFromDB);
      if (!userFromDB) {
        //console.log("auth.ts userFromDB2 in if... ");
        if (user) {
          token.id = user!.id;
        }

        return token;
      }
      const dbUser = JSON.parse(userFromDB) as User;

      //console.log("auth.ts userFromDB2: ", userFromDB);
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ token, session }) {
      //console.log("auth.ts token id:", token.id);
      if (token) {
        if (typeof token.id === "string") {
          //console.log("ys itid og token is stonm");
          session.user.id = token.id;
        }
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      //console.log("auth.ts session:", session);
      return session;
    },
    // redirect() {
    //   return "/chat";
    // },
  },
};
