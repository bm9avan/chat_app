import { User } from "next-auth";

type UserId = string;

// Remove this block if you aren't extending the JWT
// declare module "next-auth/jwt" {
//   interface JWT {
//     // id: UserId;
//   }
// }

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
    };
  }
}
