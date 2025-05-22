export type Response<T> = {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    totalPages: number;
  };
};

export async function getQuery<T>(url: string, signal?: AbortSignal): Promise<Response<T>> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error('Error en la respuesta del servidor');
  }

  return json as Response<T>;
}
export async function deleteQuery<T>(url: string, signal?: AbortSignal): Promise<Response<T>> {
  const response = await fetch(url, { signal, method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error('Error en la respuesta del servidor');
  }
  return json as Response<T>;
}
