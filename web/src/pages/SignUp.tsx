import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";

export function SignUp() {
const navigate = useNavigate()

  return (
    <div className="w-full flex flex-col gap-3 md:max-w-xl">
      <form
        action=""
        className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-8 md:p-7 md:gap-10"
      >
        <div>
          <h2 className="text-2xl text-gray-800 font-bold">Crie sua conta</h2>
          <p className="text-sm text-gray-500">
            Informe seu nome, e-mail e senha
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            required
            legend="Nome"
            placeholder="Digite o nome completo"
          />
          <Input
            required
            legend="E-mail"
            type="email"
            placeholder="example@email.com"
          />
          <Input
            required
            legend="Senha"
            type="password"
            placeholder="Digite sua senha"
            helperText="Mínimo 6 dígitos"
          />
        </div>

        <Button isLoading={false}>Cadastrar</Button>
      </form>

      <div className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-5 md:p-7 md:gap-6">
        <div>
          <h3 className="text-gray-800 text-base font-bold">
            Já tem conta?
          </h3>
          <p className="text-gray-500 text-sm">Entre agora mesmo</p>
        </div>

        <Button isLoading={false} color="secondary" onClick={() => navigate("/")}>Acessar conta</Button>
      </div>
    </div>
  );
}
