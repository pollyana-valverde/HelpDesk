import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { PenLine, Trash } from "lucide-react";
import { classMerge } from "../utils/classMerge";
import { api } from "../services/api";

import { Header } from "../components/Header/Index";
import { Table } from "../components/Table/Index";
import { ProfileIcon } from "../components/ProfileIcon";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";

const TABLE_HEADERS = [{ label: "Nome" }, { label: "Email" }, { label: "" }];

export function Clients() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clients, setClients] = useState<UserAPIResponse["user"][]>([]);
  const [isClientsLoaded, setIsClientsLoaded] = useState(true);

  async function fetchClientsData() {
    try {
      setIsClientsLoaded(false);
      setErrorMessage(null); // Limpa erros anteriores

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const clients = await api.get("/clients");

      setClients(clients.data);
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError && error.response?.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Não foi possível carregar os clientes. Tente novamente mais tarde."
        );
      }
    } finally {
      setIsClientsLoaded(true);
    }
  }

  useEffect(() => {
    fetchClientsData();
  }, []);

  return (
    <div className="grid gap-6">
      <Header.Root>
        <Header.Head>Clientes</Header.Head>
      </Header.Root>

      <Table.Root>
        <Table.Head>
          {TABLE_HEADERS.map((header, index) => (
            <th
              key={index}
              className={classMerge(
                header.label === "" && "w-[22%] lg:w-[5%]",
                "px-3"
              )}
            >
              {header.label}
            </th>
          ))}
        </Table.Head>

        <Table.Body>
          {clients.map((client) => (
            <Table.Row key={client.id}>
              <Table.Cell>
                <div className="flex gap-3 items-center">
                  <ProfileIcon sizeVariant="medium" username={client.name} />
                  <h2 className="text-sm font-bold">{client.name}</h2>
                </div>
              </Table.Cell>

              <Table.Cell className="text-sm lg:table-cell">
                {client.email}
              </Table.Cell>

              <Table.Cell>
                <div className="flex gap-2">
                  <Button color="secondary" size="iconSmall">
                    <Trash className="h-3.5 w-3.5 text-red-700" />
                  </Button>
                  <Button color="secondary" size="iconSmall">
                    <PenLine className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <ErrorMessage message={errorMessage} />

      <Loading isLoaded={isClientsLoaded} />
    </div>
  );
}
