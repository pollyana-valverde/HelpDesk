import { useApiQuery } from "../../hooks/api";

import { PenLine } from "lucide-react";
import { classMerge } from "../../utils/classMerge";

import { Header } from "../../components/Header/Index";
import { Table } from "../../components/Table/Index";
import { ProfileIcon } from "../../components/ProfileIcon";
import { Tag } from "../../components/Tag";
import { Button } from "../../components/Button";
import { Plus } from "lucide-react";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loading } from "../../components/Loading";

const TABLE_HEADERS = [
  { label: "Nome", inResponsive: true },
  { label: "Email" },
  { label: "Disponibilidade", inResponsive: true },
  { label: "", inResponsive: true },
];

export function ExpertList() {
  const { data: experts, error, isLoading } = useApiQuery<UserAPIResponse["user"][]>("/experts");

  return (
    <div className="grid gap-6">
      <Header.Root className="flex">
        <Header.Head>Técnicos</Header.Head>
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
          {experts?.map((expert) => (
            <Table.Row key={expert.id}>
              <Table.Cell>
                <div className="flex gap-3 items-center">
                  <ProfileIcon sizeVariant="medium" username={expert.name} />
                  <h2 className="text-sm font-bold">{expert.name}</h2>
                </div>
              </Table.Cell>

              <Table.Cell className="text-sm hidden lg:table-cell">
                {expert.email}
              </Table.Cell>

              <Table.Cell>
                <div className="flex truncate">
                  {expert.availableHours?.map((hour) => (
                    <Tag key={hour} className="mr-1" styleVariant="disabled">
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

      <ErrorMessage message={error} />

      <Loading isLoading={isLoading} />
    </div>
  );
}
