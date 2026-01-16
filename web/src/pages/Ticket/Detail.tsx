import { useParams } from "react-router-dom";
import { useApiMutation, useApiQuery } from "../../hooks/api/";
import { useAuth } from "../../hooks/useAuth";

import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";

import { Clock2, CircleCheckBig } from "lucide-react";
import { Header } from "../../components/Header/Index";
import { Card } from "../../components/Card/Index";
import { Button } from "../../components/Button";
import { Tag } from "../../components/Tag";
import { ProfileIcon } from "../../components/ProfileIcon";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loading } from "../../components/Loading";

export function TicketDetail() {
  const { id } = useParams();
  const { session } = useAuth();
  const { mutate, error: mutationError } = useApiMutation();
  const {
    data: ticket,
    error: queryError,
    isLoading,
    refetchData,
  } = useApiQuery<TicketAPIResponse | null>(`/tickets/${id}/show-detail`);

  async function updateTicketStatus(status: string) {
    await mutate(`/tickets/${id}/update-status`, "PATCH", { status });

    await refetchData();
  }

  return (
    <div className="grid gap-4 md:gap-6 max-w-250 m-auto">
      <Header.Root>
        <Header.Head goBack>Chamado detalhado</Header.Head>
        <Header.Action>
          {session?.user.role === "admin" && (
            <>
              <Button
                color="secondary"
                onClick={() => updateTicketStatus("in_progress")}
              >
                <Clock2 className="h-4.5 w-4.5" /> Em atendimento
              </Button>
              <Button
                color="secondary"
                onClick={() => updateTicketStatus("closed")}
              >
                <CircleCheckBig className="h-4.5 w-4.5" /> Encerrado
              </Button>
            </>
          )}

          {session?.user.role === "expert" && (
            <>
              <Button
                color="secondary"
                onClick={() => updateTicketStatus("closed")}
              >
                <CircleCheckBig className="h-4.5 w-4.5" /> Encerrar
              </Button>
              <Button onClick={() => updateTicketStatus("in_progress")}>
                <Clock2 className="h-4.5 w-4.5" /> Iniciar atendimento
              </Button>
            </>
          )}
        </Header.Action>
      </Header.Root>

      {ticket && (
        <div className="grid md:flex gap-4 md:gap-6">
          <Card.Root className="flex-2 gap-5">
            <Card.Head className="gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">
                  {ticket.id}
                </span>
                <Tag styleVariant={ticket.status} className="capitalize">
                  {ticket.status.replace("_", " ")}
                </Tag>
              </div>
              <h2 className="font-bold text-gray-800">{ticket.title}</h2>
            </Card.Head>

            <Card.Body className="gap-5">
              <div className="grid gap-0.5">
                <span className="text-xs text-gray-400 font-bold">
                  Descrição
                </span>
                <p className="text-sm text-gray-800">{ticket.description}</p>
              </div>

              <div className="grid gap-0.5">
                <span className="text-xs text-gray-400 font-bold">
                  Categoria
                </span>
                <p className="text-sm text-gray-800">
                  {ticket.services?.map((service) => service.name)}
                </p>
              </div>

              <div className="flex gap-2">
                <div className="grid gap-0.5 flex-1">
                  <span className="text-xs text-gray-400 font-bold">
                    Criado em
                  </span>

                  <p className="text-xs text-gray-800">
                    {formatDateTime(ticket.createdAt)}
                  </p>
                </div>

                <div className="grid gap-0.5 flex-1">
                  <span className="text-xs text-gray-400 font-bold">
                    Atualizado em
                  </span>

                  <p className="text-xs text-gray-800">
                    {formatDateTime(ticket.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <span className="text-xs text-gray-400 font-bold">Cliente</span>
                <div className="flex gap-2">
                  <ProfileIcon
                    username={ticket.client.name}
                    sizeVariant="small"
                  />
                  <p className="text-sm text-gray-800">{ticket.client.name}</p>
                </div>
              </div>
            </Card.Body>
          </Card.Root>

          <Card.Root className="gap-8 flex-1 h-fit">
            <Card.Head className="gap-2">
              <span className="text-xs text-gray-400 font-bold">
                Técnico responsável
              </span>
              <div className="flex gap-2 items-center">
                <ProfileIcon
                  username={ticket.expert.name}
                  sizeVariant="medium"
                />
                <div>
                  <p className="text-sm text-gray-800">{ticket.expert.name}</p>
                  <p className="text-xs text-gray-500">{ticket.expert.email}</p>
                </div>
              </div>
            </Card.Head>

            <Card.Body className="gap-4">
              <div className="grid gap-0.5">
                <span className="text-xs text-gray-400 font-bold">Valores</span>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-800">Preço base</p>
                  <p className="text-xs text-gray-800">
                    R${" "}
                    {ticket.services?.map((service) =>
                      formatCurrency(service.price)
                    )}
                  </p>
                </div>
              </div>

              <div className="grid gap-0.5">
                <span className="text-xs text-gray-400 font-bold">
                  Adicionais
                </span>
                <div className="flex">
                  <p className="text-xs text-gray-800 flex-1">
                    {ticket.services?.map((service) => service.name)}
                  </p>
                  <p className="text-xs text-gray-800">
                    R${" "}
                    {ticket.services?.map((service) =>
                      formatCurrency(service.price)
                    )}
                  </p>
                </div>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3">
                <p className="text-sm font-bold text-gray-800">Total</p>
                <p className="text-sm font-bold text-gray-800">
                  R$ {formatCurrency(ticket.totalPrice)}
                </p>
              </div>
            </Card.Body>
          </Card.Root>
        </div>
      )}

      <ErrorMessage message={queryError || mutationError} />

      <Loading isLoading={isLoading} />
    </div>
  );
}
