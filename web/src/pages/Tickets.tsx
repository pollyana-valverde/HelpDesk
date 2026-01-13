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

  async function fetchTickets() {
    try {
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
    }
  }

  useEffect(() => {
    fetchTickets();
  }, [tickets]);

  return (
    <div className="grid gap-6">
      <h1 className="text-indigo-800 text-2xl font-bold">Chamados</h1>
      <Table.Root>
        <Table.Head>
          {TABLE_HEADERS.map((header) => (
            <th
              key={header.label}
              className={classMerge(
                header.inResponsive
                  ? "table-cell w-[29%] lg:w-auto"
                  : "hidden lg:table-cell",
                "px-3 truncate"
              )}
            >
              {header.label}
            </th>
          ))}
        </Table.Head>

        <Table.Body>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-t border-gray-300 text-gray-800 h-16"
            >
              <td className="px-3 text-xs">
                {new Date(ticket.updatedAt)
                  .toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .split(",")}
              </td>

              <td className="px-3 text-xs font-bold hidden lg:table-cell truncate">
                {ticket.id}
              </td>

              <td className="px-3">
                <h2 className="text-sm font-bold truncate">{ticket.title}</h2>
                <p className="text-xs truncate">{ticket.services[0].name}</p>
              </td>

              <td className="px-3 text-sm hidden lg:table-cell">
                R${formatCurrency(ticket.totalPrice)}
              </td>

              <td className="px-3 truncate lg:table-cell hidden">
                <div className="flex gap-2">
                  <ProfileIcon username={ticket.client.name} variant="small" />
                  <h2 className="text-sm">{ticket.client.name}</h2>
                </div>
              </td>

              <td className="px-3 hidden truncate lg:table-cell">
                <div className="flex gap-2">
                  <ProfileIcon username={ticket.expert.name} variant="small" />
                  <h2 className="text-sm">{ticket.expert.name}</h2>
                </div>
              </td>

              <td className="px-3 truncate">
                <Tag variant={ticket.status} label={ticket.status} />
              </td>

              <td className="px-3">
                <Button color="secondary" size="iconSmall">
                  <PenLine className="h-3.5 w-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </Table.Body>
      </Table.Root>

      {stateError && (
        <p className="text-sm text-red-600  ">{stateError?.message}</p>
      )}
    </div>
  );
}
