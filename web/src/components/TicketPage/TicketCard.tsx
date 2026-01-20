import { useNavigate } from "react-router";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";

import { Card } from "../Card/Index";
import { Tag } from "../Tag";
import { ProfileIcon } from "../ProfileIcon";
import { Button } from "../Button";
import { PenLine, CircleCheck, Clock2 } from "lucide-react";

type TicketCardProps = {
  ticket: TicketAPIResponse;
  onUpdateStatus?: (id: string, status: TicketAPIStatus) => Promise<void>;
};

export function TicketCard({ ticket, onUpdateStatus }: TicketCardProps) {
  const navigate = useNavigate();

  return (
    <Card.Root className="w-fit " key={ticket.id}>
      <Card.Head className="gap-1">
        <div className="flex justify-between items-center gap-2.5 min-w-85.5">
          <span className="text-xs font-bold text-gray-400 truncate">
            {ticket.id}
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="iconSmall"
              color="secondary"
              onClick={() => navigate(`/tickets/${ticket.id}/detail`)}
            >
              <PenLine className="h-3.5 w-3.5" />
            </Button>
            {ticket.status === "in_progress" && (
              <Button size="small" onClick={() => onUpdateStatus && onUpdateStatus(ticket.id, "closed")}>
                <CircleCheck className="h-3.5 w-3.5" />
                Encerrar
              </Button>
            )}

            {ticket.status === "open" && (
              <Button size="small" onClick={() => onUpdateStatus && onUpdateStatus(ticket.id, "in_progress")}>
                <Clock2 className="h-3.5 w-3.5" />
                Iniciar
              </Button>
            )}
          </div>
        </div>
        <h2 className="font-bold text-gray-900 truncate">{ticket.title}</h2>
        <p className="text-xs text-gray-800 truncate">
          {ticket.services[0].name}
        </p>
      </Card.Head>
      <Card.Body>
        <div className="flex justify-between items-center pb-4">
          <h3 className="text-xs text-gray-800">
            {formatDateTime(ticket.updatedAt)}
          </h3>
          <div className="flex items-baseline">
            <p className="text-xxs font-bold text-gray-800">R$</p>
            <p className="text-sm text-gray-800">
              {formatCurrency(ticket.totalPrice)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-1.5">
            <ProfileIcon username={ticket.client.name} sizeVariant="small" />
            <h3 className="text-xs font-bold text-gray-800">
              {ticket.client.name}
            </h3>
          </div>
          <Tag styleVariant={ticket.status} />
        </div>
      </Card.Body>
    </Card.Root>
  );
}
