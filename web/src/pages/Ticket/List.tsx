import { useNavigate } from "react-router";
import { useApiQuery } from "../../hooks/api";

import { classMerge } from "../../utils/classMerge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";

import { Header } from "../../components/Header/Index";
import { PenLine } from "lucide-react";
import { Table } from "../../components/Table/Index";
import { Tag } from "../../components/Tag";
import { ProfileIcon } from "../../components/ProfileIcon";
import { Button } from "../../components/Button";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loading } from "../../components/Loading";
import { useCallback } from "react";

const TABLE_HEADERS = [
  { label: "Atualizado em", inResponsive: true },
  { label: "Id" },
  { label: "Título e serviço", inResponsive: true },
  { label: "Valor total" },
  { label: "Cliente" },
  { label: "Técnico" },
  { label: "Status", inResponsive: true },
  { label: "", inResponsive: true },
];

export function TicketList() {
  const selectTickets = useCallback(
    (responseData: { tickets: TicketAPIResponse[] }) => responseData.tickets,
    []
  );
  const {
    data: tickets,
    error,
    isLoading,
  } = useApiQuery<TicketAPIResponse[]>("/tickets", selectTickets);
  
  const navigate = useNavigate();

  return (
    <div className="grid gap-6">
      <Header.Root>
        <Header.Head>Chamados</Header.Head>
      </Header.Root>

      <Table.Root>
        <Table.Head>
          {TABLE_HEADERS.map((header, index) => (
            <th
              key={index}
              className={classMerge(
                header.inResponsive
                  ? "table-cell lg:w-auto"
                  : "hidden lg:table-cell",
                header.label === "" || header.label === "Status"
                  ? "w-[12%]"
                  : "",
                "px-3"
              )}
            >
              {header.label}
            </th>
          ))}
        </Table.Head>

        <Table.Body>
          {tickets?.map((ticket) => (
            <Table.Row key={ticket.id}>
              <Table.Cell className="text-xs">
                {formatDateTime(ticket.updatedAt)}
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
                  <ProfileIcon
                    username={ticket.client.name}
                    sizeVariant="small"
                  />
                  <h2 className="text-sm">{ticket.client.name}</h2>
                </div>
              </Table.Cell>

              <Table.Cell className="hidden lg:table-cell">
                <div className="flex gap-2">
                  <ProfileIcon
                    username={ticket.expert.name}
                    sizeVariant="small"
                  />
                  <h2 className="text-sm">{ticket.expert.name}</h2>
                </div>
              </Table.Cell>

              <Table.Cell>
                <Tag styleVariant={ticket.status}>
                  <h2 className="hidden lg:flex mr-1 capitalize">
                    {ticket.status.replace("_", " ")}
                  </h2>
                </Tag>
              </Table.Cell>

              <Table.Cell>
                <Button
                  color="secondary"
                  size="iconSmall"
                  onClick={() => navigate(`/tickets/${ticket.id}/detail`)}
                >
                  <PenLine className="h-3.5 w-3.5" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <ErrorMessage message={error} />

      <Loading isLoading={isLoading} />
    </div>
  );
}
