import { PenLine, Trash } from "lucide-react";
import { classMerge } from "../../utils/classMerge";

import { Table } from "../../components/Table/Index";
import { ProfileIcon } from "../../components/ProfileIcon";
import { Button } from "../../components/Button";

type ClientListProps = {
    clients: UserAPIResponse["user"][];
    onModalDelete: (client: { id: string; name: string; }) => void;
    onModalEdit: (client: { id: string }) => void;
};

const TABLE_HEADERS = [{ label: "Nome" }, { label: "Email" }, { label: "" }];

export function ClientList({ clients, onModalDelete, onModalEdit }: ClientListProps) {
  return (
    <div className="grid gap-6">
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
          {clients?.map((client) => (
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
                  <Button color="secondary" size="iconSmall" onClick={() => onModalDelete({ id: client.id, name: client.name })}>
                    <Trash className="h-3.5 w-3.5 text-red-700" />
                  </Button>
                  <Button color="secondary" size="iconSmall" onClick={() => onModalEdit({ id: client.id })}>
                    <PenLine className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
