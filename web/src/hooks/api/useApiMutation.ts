import { useState, useCallback } from "react";
import { api, type Method } from "../../services/api";
import { AxiosError } from "axios";

export function useApiMutation<T = unknown>() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (endpoint: string, method: Method, body?: T) => {
      try {
        setIsLoading(true);
        setError(null); // Limpa erros anteriores

        const response = await api.request({
          method,
          url: endpoint,
          data: body,
        });

        return response.data;
      } catch (error) {
        console.log(error);

        if (error instanceof AxiosError && error.response?.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Ocorreu um erro ao executar a ação.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { mutate, error, isLoading };
}
