import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { PenLine } from "lucide-react";
import { classMerge } from "../utils/classMerge";
import { api } from "../services/api";

import { Table } from "../components/Table";
import { Tag } from "../components/Tag";
import { ProfileIcon } from "../components/ProfileIcon";
import { Button } from "../components/Button";

const TABLE_HEADERS = [
  { label: "Nome", inResponsive: true },
  { label: "Email" },
  { label: "Disponibilidade", inResponsive: true },
  { label: "", inResponsive: true },
];

export function Experts() {
  const [stateError, setStateError] = useState<{ message: string } | null>(
    null
  );
  const [experts, setExperts] = useState<UserAPIResponse["user"][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchExperts() {
    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await api.get("/experts");

      setExperts(response.data);
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
    fetchExperts();
  }, []);

  return (
    <div className="grid gap-6">
      <h1 className="text-indigo-800 text-2xl font-bold">Técnicos</h1>
      <Table.Root>
        <Table.Head>
          {TABLE_HEADERS.map((header, index) => (
            <th
              key={index}
              className={classMerge(
                header.inResponsive
                  ? "table-cell lg:w-auto"
                  : "hidden lg:table-cell ",
                  header.label === "" && "w-[12%] lg:w-[1%]",
                "px-3"
              )}
            >
              {header.label}
            </th>
          ))}
        </Table.Head>

        <Table.Body>
          {experts.map((expert) => (
            <Table.Row key={expert.id}>
              <Table.Cell>
                <div className="flex gap-3 items-center">
                  <ProfileIcon variant="medium" username={expert.name} />
                  <h2 className="text-sm font-bold">{expert.name}</h2>
                </div>
              </Table.Cell>

              <Table.Cell className="text-sm hidden lg:table-cell">
                {expert.email}
              </Table.Cell>

              <Table.Cell>
                <div className="flex truncate">
                  {expert.availableHours?.map((hour) => (
                    <Tag key={hour} className="mr-1" variant="disabled">
                      {hour}
                    </Tag>
                  ))}
                </div>
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
