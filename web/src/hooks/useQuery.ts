import { useState, useCallback } from "react";
import { api } from "../services/api";
import { AxiosError } from "axios";

// T é um tipo genérico para que o hook funcione com qualquer tipo de dado
export function useQuery<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // useCallback para garantir que a função não seja recriada a cada renderização
  const request = useCallback(
    async (endpoint: string, dataSelector?: (responseData: any) => T) => {
      try {
        setIsLoading(true);
        setError(null); // Limpa erros anteriores

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await api.get(endpoint);

        if (dataSelector) {
          const selectedData = dataSelector(response.data);
          return setData(selectedData);
        } else {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);

        if (error instanceof AxiosError && error.response?.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Ocorreu um erro ao buscar os dados.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { data, error, isLoading, request };
}
