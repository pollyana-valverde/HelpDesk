import { useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z, ZodError } from "zod";
import { AxiosError } from "axios";

import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

import { Input } from "../components/Input";
import { Button } from "../components/Button";

type FormData = {
  email: string;
  password: string;
};

const signInSchema = z.object({
  email: z.email("Email inválido").trim().min(1, "Informe o e-mail"),
  password: z.string().trim().min(1, "Informe a senha"),
});

export function SignIn() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [stateError, setStateError] = useState<{ message: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  async function handleSignIn(data: FormData) {
    try {
       setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await api.post("/sessions", data);

      auth.login(response.data);

      setStateError(null);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => err.message).join("\n");

        return setStateError({ message: errors });
      }

      if (error instanceof AxiosError) {
        console.log(error?.response?.data.message);
      }

      return setStateError({
        message: "Erro ao fazer login. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
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
                hasValidationError={!!errors.email}
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
                hasValidationError={!!errors.password}
              />
            )}
          />

          {stateError && (
            <p className="text-sm text-red-600 text-center ">
              {stateError?.message}
            </p>
          )}
        </div>

        <Button isLoading={isLoading} type="submit">
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
