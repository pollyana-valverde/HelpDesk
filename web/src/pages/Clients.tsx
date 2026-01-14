import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { PenLine, Trash } from "lucide-react";
import { classMerge } from "../utils/classMerge";
import { api } from "../services/api";

import { Table } from "../components/Table";
import { ProfileIcon } from "../components/ProfileIcon";
import { Button } from "../components/Button";

const TABLE_HEADERS = [{ label: "Nome" }, { label: "Email" }, { label: "" }];

export function Clients() {
  const [stateError, setStateError] = useState<{ message: string } | null>(
    null
  );
  const [clients, setClients] = useState<UserAPIResponse["user"][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchClients() {
    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        return setStateError({ message: error.response?.data.message });
      }

      return setStateError({
        message: "Não foi possível carregar os técnicos",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="grid gap-6">
      <h1 className="text-indigo-800 text-2xl font-bold">Clientes</h1>
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
