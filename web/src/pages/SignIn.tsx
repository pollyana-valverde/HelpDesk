import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

type FormData = {
  email: string;
  password: string;
};

const signInSchema = z.object({
  email: z.email("Email ou senha inválidos"),
  password: z.string().trim().min(1, "Informe a senha"),
});

export function SignIn() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "valverdepolly@gmail",
      password: "nn",
    },
    resolver: zodResolver(signInSchema),
  });

  function handleSignIn(data: FormData) {
    console.log(data);
  }

  return (
    <div className="w-full flex flex-col gap-3 md:max-w-xl">
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-8 md:p-7 md:gap-10"
      >
        <div>
          <h2 className="text-2xl text-gray-800 font-bold">Acesse o portal</h2>
          <p className="text-sm text-gray-500">
            Entre usando seu e-mail e senha cadastrados
          </p>
        </div>

        <div className="flex flex-col gap-4">
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
                helperText={errors.password?.message}
                inputError={!!errors.password}
              />
            )}
          />
            
        </div>

        <Button isLoading={false} type="submit">
          Entrar
        </Button>
      </form>

      <div className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-5 md:p-7 md:gap-6">
        <div>
          <h3 className="text-gray-800 text-base font-bold">
            Ainda não tem conta?
          </h3>
          <p className="text-gray-500 text-sm">Cadastre agora mesmo</p>
        </div>

        <Button
          isLoading={false}
          color="secondary"
          onClick={() => navigate("/signup")}
        >
          Criar conta
        </Button>
      </div>
    </div>
  );
}
