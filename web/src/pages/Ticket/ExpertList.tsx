import { useApiQuery, useApiMutation } from "../../hooks/api";
import { useMemo, useCallback } from "react";

import { Header } from "../../components/Header/Index";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loading } from "../../components/Loading";
import { TicketLane } from "../../components/TicketPage/TicketLane";

const STATUS_LANES: { title: string; status: TicketAPIStatus }[] = [
  { title: "Em atendimento", status: "in_progress" },
  { title: "Aberto", status: "open" },
  { title: "Encerrado", status: "closed" },
];

export function TicketExpertList() {
  const selectTickets = useCallback(
    (responseData: { tickets: TicketAPIResponse[] }) => responseData.tickets,
    [],
  );
  const {
    data: tickets,
    error,
    isLoading,
    refetchData,
  } = useApiQuery<TicketAPIResponse[]>("/tickets/expert", selectTickets);
  const { mutate } = useApiMutation();

  async function updateTicketStatus(id: string, status: TicketAPIStatus) {
    await mutate(`/tickets/${id}/update-status`, "PATCH", { status });

    await refetchData();
  }

  const groupedTicketsByStatus = useMemo(() => {
    if (!tickets) {
      return {} as Record<TicketAPIStatus, TicketAPIResponse[]>;
    }
    return tickets.reduce(
      (ticketsByStatus, ticket) => {
        if (!ticketsByStatus[ticket.status]) {
          ticketsByStatus[ticket.status] = [];
        }
        ticketsByStatus[ticket.status].push(ticket);
        return ticketsByStatus;
      },
      {} as Record<TicketAPIStatus, TicketAPIResponse[]>,
    );
  }, [tickets]);

  return (
    <div className="grid gap-6">
      <Header.Root>
        <Header.Head>Meus chamados</Header.Head>
      </Header.Root>

      <div className="overflow-hidden grid gap-6">
        {STATUS_LANES.map(({ title, status }) => (
          <TicketLane
            key={status}
            title={title}
            status={status}
            tickets={groupedTicketsByStatus[status] || []}
            onUpdateStatus={updateTicketStatus}
          />
        ))}
      </div>

      <Loading isLoading={isLoading} />
      <ErrorMessage message={error} />
    </div>
  );
}
