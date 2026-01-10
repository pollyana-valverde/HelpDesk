import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function SignIn() {
  return (
    <div className="w-full flex flex-col gap-3">
      <form
        action=""
        className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-8"
      >
        <div>
          <h2 className="text-2xl text-gray-800 font-bold">Acesse o portal</h2>
          <p className="text-sm text-gray-500">
            Entre usando seu e-mail e senha cadastrados
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            required
            legend="E-mail"
            type="email"
            placeholder="seu@email.com"
          />
          <Input
            required
            legend="Senha"
            type="password"
            placeholder="********"
            helperText="Mínimo 6 dígitos"
          />
        </div>

        <Button isLoading={false}>Entrar</Button>
      </form>

      <div className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
        <div>
          <h3 className="text-gray-800 text-base font-bold">
            Ainda não tem conta?
          </h3>
          <p className="text-gray-500 text-sm">Cadastre agora mesmo</p>
        </div>

        <Button />
      </div>
    </div>
  );
}
