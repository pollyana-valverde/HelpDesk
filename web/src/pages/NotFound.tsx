import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-black text-gray-800">404</h1>
      <p className="text-2xl md:text-3xl font-bold text-gray-400 mt-4">
        Página Não Encontrada
      </p>
      <p className="text-gray-600 mt-2 mb-8">
        Oops! Parece que você se perdeu. A página que você está procurando não
        existe.
      </p>

      <Button >
        <Link to="/">Voltar para o Início</Link>
      </Button>
    </div>
  );
}