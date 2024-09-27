export interface Message {
  id: number;
  senderId: string;
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export const USERS = [
  {
    id: "2",
    image: "/avatars/user2.png",
    name: "John Doe",
    email: "johndoe@gmail.com",
  },
  {
    id: "3",
    image: "/avatars/user3.png",
    name: "Elizabeth Smith",
    email: "elizabeth@gmail.com",
  },
  {
    id: "4",
    image: "/avatars/user4.png",
    name: "John Smith",
    email: "johnsmith@gmail.com",
  },
  {
    id: "5",
    image: "/avatars/user4.png",
    name: "Jane Doe",
    email: "janedoe@gmail.com",
  },
];

export const messages = [
  {
    id: 7,
    senderId: USERS[0].id,
    message: "Cool",
  },
  {
    id: 8,
    senderId: USERS[1].id,
    message: "Yeah",
  },
  {
    id: 9,
    senderId: USERS[0].id,
    message: "Bye",
  },
  {
    id: 10,
    senderId: USERS[1].id,
    message: "Bye",
  },
];
