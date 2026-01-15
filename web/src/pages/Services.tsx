import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { classMerge } from "../utils/classMerge";
import { api } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";

import { Header } from "../components/Header/Index";
import { Table } from "../components/Table/Index";
import { Tag } from "../components/Tag";
import { Button } from "../components/Button";
import { PenLine, Ban, CircleCheck, Plus } from "lucide-react";
import { ErrorMessage } from "../components/ErrorMessage";
import { Loading } from "../components/Loading";

const TABLE_HEADERS = [
  { label: "Título" },
  { label: "Valor" },
  { label: "Status" },
  { label: "" },
];

export function Services() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchServicesData() {
    try {
      setIsLoading(true);
      setErrorMessage(null); // Limpa erros anteriores

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const services = await api.get("/services");

      console.log(services.data);
      setServices(services.data);
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError && error.response?.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Não foi possível carregar os serviços. Tente novamente mais tarde."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchServicesData();
  }, []);

  return (
    <div className="grid gap-6">
      <Header.Root className="flex">
        <Header.Head>Serviços</Header.Head>
        <Header.Action>
          <Button>
            <Plus className="h-4.5 w-4.5" />{" "}
            <h2 className="hidden md:flex">Novo</h2>
          </Button>
        </Header.Action>
      </Header.Root>

      <Table.Root>
        <Table.Head>
          {TABLE_HEADERS.map((header, index) => (
            <th
              key={index}
              className={classMerge(
                header.label === "" && "w-[22%] lg:w-[5%]",
                header.label === "Status" && "w-[12%] lg:w-[5%]",
                header.label === "Valor" && "lg:w-[37%]",
                "px-3"
              )}
            >
              {header.label}
            </th>
          ))}
        </Table.Head>

        <Table.Body>
          {services.map((service) => (
            <Table.Row key={service.id}>
              <Table.Cell className="text-sm font-bold">
                {service.name}
              </Table.Cell>

              <Table.Cell className="text-sm">
                R${formatCurrency(service.price)}
              </Table.Cell>

              <Table.Cell>
                {service.isActive ? (
                  <Tag className="text-lime-700 bg-lime-200 border-none md:px-2">
                    <div className="md:hidden">
                      <CircleCheck className="h-4 w-4" />
                    </div>
                    <h2 className="hidden lg:flex">Ativo</h2>
                  </Tag>
                ) : (
                  <Tag className="text-red-700 bg-red-200 border-none md:px-2">
                    <div className="md:hidden">
                      <Ban className="h-4 w-4" />
                    </div>
                    <h2 className="hidden lg:flex">Inativo</h2>
                  </Tag>
                )}
              </Table.Cell>

              <Table.Cell>
                <div className="flex items-center justify-end gap-2">
                  <Button color="link" size="small">
                    {service.isActive ? (
                      <div className="flex gap-2 items-center">
                        <Ban className="h-3.5 w-3.5" />
                        <span className="hidden md:flex">Desativar</span>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <CircleCheck className="h-3.5 w-3.5" />
                        <span className="hidden md:flex">Reativar</span>
                      </div>
                    )}
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

      <Loading isLoading={isLoading} />
    </div>
  );
}
