import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const signInSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome"),
  email: z.email("Email inválido").trim().min(1, "Informe o e-mail"),
  password: z.string().trim().min(6, "A senha deve ter no mínimo 6 dígitos"),
});

export function SignUp() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  function handleSignUp(data: FormData) {
    console.log(data);
  }

  return (
    <div className="w-full flex flex-col gap-3 md:max-w-xl">
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-8 md:p-7 md:gap-10"
      >
        <div>
          <h2 className="text-2xl text-gray-800 font-bold">Crie sua conta</h2>
          <p className="text-sm text-gray-500">
            Informe seu nome, e-mail e senha
          </p>
        </div>

        <div className="flex flex-col gap-4">
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
                inputError={!!errors.name}
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
                inputError={!!errors.email}
              />
            )}
          />

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
                inputError={!!errors.password}
              />
            )}
          />
        </div>

        <Button isLoading={false} type="submit">Cadastrar</Button>
      </form>

      <div className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-5 md:p-7 md:gap-6">
        <div>
          <h3 className="text-gray-800 text-base font-bold">Já tem conta?</h3>
          <p className="text-gray-500 text-sm">Entre agora mesmo</p>
        </div>

        <Button
          isLoading={false}
          color="secondary"
          onClick={() => navigate("/")}
        >
          Acessar conta
        </Button>
      </div>
    </div>
  );
}
