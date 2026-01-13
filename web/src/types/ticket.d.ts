type TicketAPIStatus = "open" | "in_progress" | "closed";

type TicketAPIResponse = {
  id: string;
  title: string;
  description: string;
  status: TicketAPIStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  expertId: string | null;
  expert: {
    name: string;
    email: string;
  };
  client: {
    name: string;
    email: string;
  };
  services: [
    {
      name: string;
      price: number;
    }
  ];
};
