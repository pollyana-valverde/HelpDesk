import { classMerge } from "../../utils/classMerge";
import { formatCurrency } from "../../utils/formatCurrency";

import { Table } from "../../components/Table/Index";
import { Tag } from "../../components/Tag";
import { Button } from "../../components/Button";
import { PenLine, Ban, CircleCheck } from "lucide-react";

type ServiceListProps = {
  services: ServiceApiResponse[];
  onToggleStatus: (serviceId: string, isActive: boolean) => void;
  onEdit: (service: ServiceApiResponse) => void;
};

const TABLE_HEADERS = [
  { label: "Título" },
  { label: "Valor" },
  { label: "Status" },
  { label: "" },
];

export function ServiceList({
  services,
  onToggleStatus,
  onEdit,
}: ServiceListProps) {
  return (
    <Table.Root>
      <Table.Head>
        {TABLE_HEADERS.map((header, index) => (
          <th
            key={index}
            className={classMerge(
              header.label === "" && "w-[22%] lg:w-[5%]",
              header.label === "Status" && "w-[12%] lg:w-[5%]",
              header.label === "Valor" && "lg:w-[37%]",
              "px-3",
            )}
          >
            {header.label}
          </th>
        ))}
      </Table.Head>

      <Table.Body>
        {services?.map((service) => (
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
                <Button
                  color="link"
                  size="small"
                  onClick={() => onToggleStatus(service.id, service.isActive)}
                >
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
                <Button
                  color="secondary"
                  size="iconSmall"
                  onClick={() => onEdit(service)}
                >
                  <PenLine className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
