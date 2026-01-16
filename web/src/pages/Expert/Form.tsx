import { useState } from "react";

import { Header } from "../../components/Header/Index";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card/Index";
import { Input } from "../../components/Input";
import { Tag } from "../../components/Tag";

import { AVAILABLE_HOURS } from "../../utils/availableHours";

export function ExpertForm() {
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  function handleHourSelection(hour: string) {
    if (selectedHours.includes(hour)) {
      setSelectedHours((prevState) => prevState.filter((h) => h !== hour));
    } else {
      setSelectedHours((prevState) => [...prevState, hour]);
    }
  }

  return (
    <div className="grid gap-4 md:gap-6 max-w-250 m-auto">
      <Header.Root>
        <Header.Head goBack>Perfil de técnico</Header.Head>

        <Header.Action>
          <Button color="secondary">Cancelar</Button>
          <Button>Salvar</Button>
        </Header.Action>
      </Header.Root>

      <div className="grid md:flex gap-4 md:gap-6">
        <Card.Root className="gap-5 md:gap-6 flex-1">
          <Card.Head className="gap-1">
            <h2 className="font-bold text-gray-800">Dados pessoais</h2>
            <p className="text-xs text-gray-500">
              Defina as informações do perfil de técnico
            </p>
          </Card.Head>

          <form>
            <Card.Body className="gap-4">
              <Input legend="Nome" name="name" placeholder="Nome completo" />

              <Input
                legend="Email"
                type="email"
                name="email"
                placeholder="example@mail.com"
              />

              <Input
                legend="Senha"
                type="password"
                name="password"
                placeholder="Defina a senha de acesso"
                helperText="Mínimo de 6 dígitos"
              />
            </Card.Body>
          </form>
        </Card.Root>

        <Card.Root className="gap-5 md:gap-6 flex-2">
          <Card.Head className="gap-1">
            <h2 className="font-bold text-gray-800">Horários de atendimento</h2>
            <p className="text-xs text-gray-500">
              Selecione os horários de disponibilidade do técnico para
              atendimento
            </p>
          </Card.Head>
          <Card.Body className="gap-4 md:gap-5">
            <div className="grid gap-2">
              <span className="uppercase text-xxs text-gray-500 font-bold">Manhã</span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_HOURS.morning.map((hour, index) => (
                  <Tag
                    key={index}
                    isSelected={selectedHours.includes(hour)}
                    onClick={() => handleHourSelection(hour)}
                  >
                    {hour}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <span className="uppercase text-xxs text-gray-500 font-bold">Tarde</span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_HOURS.afternoon.map((hour, index) => (
                  <Tag
                    key={index}
                    isSelected={selectedHours.includes(hour)}
                    onClick={() => handleHourSelection(hour)}
                  >
                    {hour}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <span className="uppercase text-xxs text-gray-500 font-bold">Noite</span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_HOURS.night.map((hour, index) => (
                  <Tag
                    key={index}
                    isSelected={selectedHours.includes(hour)}
                    onClick={() => handleHourSelection(hour)}
                  >
                    {hour}
                  </Tag>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card.Root>
      </div>
    </div>
  );
}
