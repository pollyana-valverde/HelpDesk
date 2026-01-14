import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { api } from "../services/api";

export function TicketDetail() {
  const { id } = useParams();

  const [stateError, setStateError] = useState<{ message: string } | null>(
    null
  );
  const [ticket, setTicket] = useState<TicketAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchTicketDetail() {
    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await api.get(`/tickets/${id}/show`);

      setTicket(response.data);
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        return setStateError({ message: error.response?.data.message });
      }

      return setStateError({
        message: "Não foi possível carregar os chamados",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTicketDetail();
  }, [id]);

  return (
    <div>
      <div>
        {ticket && (
          <div>
            <h2>{ticket.title}</h2>
            <p>{ticket.description}</p>
            {/* Add more ticket details as needed */}
          </div>
        )}
      </div>

      {stateError && (
        <p className="text-lg text-red-600  ">{stateError?.message}</p>
      )}

      {isLoading && (
        <p className="text-sm font-bold w-full flex justify-center text-gray-800 ">
          Carregando...
        </p>
      )}
    </div>
  );
}
