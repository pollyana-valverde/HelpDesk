import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { PenLine } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";
import { classMerge } from "../utils/classMerge";
import { api } from "../services/api";

import { Table } from "../components/Table";
import { Tag } from "../components/Tag";
import { ProfileIcon } from "../components/ProfileIcon";
import { Button } from "../components/Button";

const TABLE_HEADERS = [
  { label: "Atualizado em", inResponsive: true },
  { label: "Id" },
  { label: "Título e serviço", inResponsive: true },
  { label: "Valor total" },
  { label: "Cliente" },
  { label: "Técnico" },
  { label: "Status", inResponsive: true },
];

export function Tickets() {
  const [stateError, setStateError] = useState<{ message: string } | null>(
    null
  );
  const [tickets, setTickets] = useState<TicketAPIResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchTickets() {
    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await api.get("/tickets");

      setTickets(response.data.tickets);
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
    fetchTickets();
  }, []);

  return (
    <div className="grid gap-6">
      <h1 className="text-indigo-800 text-2xl font-bold">Chamados</h1>
      <Table.Root>
        <Table.Head>
          {TABLE_HEADERS.map((header, index) => (
            <th
              key={index}
              className={classMerge(
                header.inResponsive
                  ? "table-cell w-[29%] lg:w-auto"
                  : "hidden lg:table-cell",
                "px-3"
              )}
            >
              {header.label}
            </th>
          ))}
        </Table.Head>

        <Table.Body>
          {tickets.map((ticket) => (
            <Table.Row key={ticket.id}>
              <Table.Cell className="text-xs">
                {new Date(ticket.updatedAt)
                  .toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .split(",")}
              </Table.Cell>

              <Table.Cell className="text-xs font-bold hidden lg:table-cell">
                {ticket.id}
              </Table.Cell>

              <Table.Cell>
                <h2 className="text-sm font-bold truncate">{ticket.title}</h2>
                <p className="text-xs truncate">{ticket.services[0].name}</p>
              </Table.Cell>

              <Table.Cell className="text-sm hidden lg:table-cell">
                R${formatCurrency(ticket.totalPrice)}
              </Table.Cell>

              <Table.Cell className="lg:table-cell hidden">
                <div className="flex gap-2">
                  <ProfileIcon username={ticket.client.name} variant="small" />
                  <h2 className="text-sm">{ticket.client.name}</h2>
                </div>
              </Table.Cell>

              <Table.Cell className="hidden lg:table-cell">
                <div className="flex gap-2">
                  <ProfileIcon username={ticket.expert.name} variant="small" />
                  <h2 className="text-sm">{ticket.expert.name}</h2>
                </div>
              </Table.Cell>

              <Table.Cell>
                <Tag variant={ticket.status} >
                    <h2 className="hidden lg:flex mr-1">{ticket.status.replace("_", " ")}</h2>
                </Tag>
              </Table.Cell>

              <Table.Cell>
                <Button color="secondary" size="iconSmall">
                  <PenLine className="h-3.5 w-3.5" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

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
