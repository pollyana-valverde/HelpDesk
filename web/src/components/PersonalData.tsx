import { type Control, Controller,type FieldErrors } from "react-hook-form";
import { Card } from "../components/Card/Index";
import { Input } from "./Input";
import { ProfileIcon } from "./ProfileIcon";

type PersonalDataProps = {
  id?: string;
  control: Control<UserData>;
  errors: FieldErrors<UserData>;
  expertData?: UserData | null;
}

export function PersonalData({
  id,
  control,
  errors,
  expertData,
}: PersonalDataProps) {
  return (
    <Card.Root className="gap-5 md:gap-6 flex-1">
      <Card.Head className="gap-1">
        <h2 className="font-bold text-gray-800">Dados pessoais</h2>
        <p className="text-xs text-gray-500">
          Defina as informações do perfil de técnico
        </p>
      </Card.Head>

      {id && <ProfileIcon username={expertData?.name} sizeVariant="medium" />}

      <form>
        <Card.Body className="gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                required
                legend="Nome"
                placeholder="Digite o nome completo"
                {...field}
                helperText={errors.name?.message}
                hasValidationError={Boolean(errors.name)}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                required
                legend="E-mail"
                type="email"
                placeholder="example@email.com"
                {...field}
                helperText={errors.email?.message}
                hasValidationError={Boolean(errors.email)}
              />
            )}
          />

          {!id && (
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  required
                  legend="Senha"
                  type="password"
                  placeholder="Digite sua senha"
                  {...field}
                  helperText={errors.password?.message ?? "Mínimo de 6 dígitos"}
                  hasValidationError={Boolean(errors.password)}
                />
              )}
            />
          )}
        </Card.Body>
      </form>
    </Card.Root>
  );
}
