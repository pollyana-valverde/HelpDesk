import { Tag } from "../Tag";
import { TicketCard } from "./TicketCard";

type TicketLaneProps = {
  title: string;
  status: TicketAPIStatus;
  tickets: TicketAPIResponse[];
};

export function TicketLane({ title, status, tickets }: TicketLaneProps) {
  if (tickets.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4">
      <Tag styleVariant={status}>{title}</Tag>
      <div className="flex gap-4 overflow-x-auto w-full">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}
