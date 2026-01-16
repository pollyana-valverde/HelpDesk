import { useState, useCallback, useEffect } from "react";
import { api } from "../../services/api";
import { AxiosError } from "axios";

export function useApiQuery<T = unknown>(
  endpoint: string,
  dataSelector?: (responseData: any) => T
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null); // Limpa erros anteriores

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await api.get<T>(endpoint);

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
  }, [endpoint, dataSelector]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetchData: fetchData };
}
