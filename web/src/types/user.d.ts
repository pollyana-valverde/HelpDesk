type UserAPIRole = "admin"| "client"| "expert";

type UserAPIResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    password?: string;
    availableHours: string[] | null;
    role: UserAPIRole
  };
};

 type UserData = {
  name: string;
  email: string;
  password?: string;
  availableHours: string[];
};
