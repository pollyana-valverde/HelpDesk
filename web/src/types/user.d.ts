type UserAPIRole = "admin"| "client"| "expert";

type UserAPIResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserAPIRole
  };
};
