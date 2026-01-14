import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { api } from "../services/api";

import { Clock2, CircleCheckBig } from "lucide-react";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Tag } from "../components/Tag";
import { ProfileIcon } from "../components/ProfileIcon";
import { formatCurrency } from "../utils/formatCurrency";

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
    <div className="grid gap-4 md:gap-6 max-w-250 m-auto">
      <Header.Root>
        <Header.Head goBack>Chamado detalhado</Header.Head>
        <Header.Action>
          <Button color="secondary">
            <Clock2 className="h-4.5 w-4.5" /> Em atendimento
          </Button>
          <Button color="secondary">
            <CircleCheckBig className="h-4.5 w-4.5" /> Encerrado
          </Button>
        </Header.Action>
      </Header.Root>

      {ticket && (
        <div className="grid md:flex gap-6">
          <div className="rounded-xl border border-gray-200 grid p-5 md:p-6 gap-5 flex-2">
            <div className="grid gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">
                  {ticket.id}
                </span>
                <Tag variant={ticket.status}>
                  {ticket.status.replace("_", " ")}
                </Tag>
              </div>
              <h2 className="font-bold text-gray-800">{ticket.title}</h2>
            </div>

            <div className="grid gap-0.5">
              <span className="text-xs text-gray-400 font-bold">Descrição</span>
              <p className="text-sm text-gray-800">{ticket.description}</p>
            </div>

            <div className="grid gap-0.5">
              <span className="text-xs text-gray-400 font-bold">Categoria</span>
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
                  {new Date(ticket.createdAt)
                    .toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .split(",")}
                </p>
              </div>

              <div className="grid gap-0.5 flex-1">
                <span className="text-xs text-gray-400 font-bold">
                  Atualizado em
                </span>

                <p className="text-xs text-gray-800">
                  {new Date(ticket.updatedAt)
                    .toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .split(",")}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <span className="text-xs text-gray-400 font-bold">Cliente</span>
              <div className="flex gap-2">
                <ProfileIcon username={ticket.client.name} variant="small" />
                <p className="text-sm text-gray-800">{ticket.client.name}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 grid p-5 md:p-6 gap-5 flex-1 h-fit">
            <div className="grid gap-2">
              <span className="text-xs text-gray-400 font-bold">
                Técnico responsável
              </span>
              <div className="flex gap-2 items-center">
                <ProfileIcon username={ticket.expert.name} variant="medium" />
                <div>
                  <p className="text-sm text-gray-800">{ticket.expert.name}</p>
                  <p className="text-xs text-gray-500">{ticket.expert.email}</p>
                </div>
              </div>
            </div>

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
          </div>
        </div>
      )}

      {stateError && (
        <p className="text-lg text-red-600">{stateError?.message}</p>
      )}

      {isLoading && (
        <p className="text-sm font-bold w-full flex justify-center text-gray-800 ">
          Carregando...
        </p>
      )}
    </div>
  );
}
