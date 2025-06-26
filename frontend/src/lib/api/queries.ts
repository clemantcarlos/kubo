export type GetResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    totalPages: number;
  };
};
export type Response<T> = {
  success: boolean;
  data: T;
};

export async function getQuery<T>(
  url: string, 
  signal?: AbortSignal
): Promise<GetResponse<T>> {
  const response = await fetch(url, { signal });

  const json = await response.json();

  if (!json.success) {
    throw new Error('Error en la respuesta del servidor');
  }

  return json as GetResponse<T>;
}
export async function postQueryJson<T,Body>(
  url: string, 
  body: Body, 
  signal?: AbortSignal
): Promise<Response<T>> {  
  const response = await fetch(url, { signal, method: 'POST', body: JSON.stringify(body) });

  const json = await response.json();

  return json as Response<T>;
}
export async function postQueryFormData<T>(
  url: string, 
  body: FormData, 
  signal?: AbortSignal
): Promise<GetResponse<T>> {  
  const response = await fetch(
    url, 
    { 
      signal, 
      method: 'POST', 
      body: body
    }
  );
  const json = await response.json();
  return json as GetResponse<T>;
}
export async function putQueryFormData<T>(
  url: string, 
  body: FormData, 
  signal?: AbortSignal
): Promise<GetResponse<T>> {  
  const response = await fetch(
    url, 
    { 
      signal, 
      method: 'PUT', 
      body: body
    }
  );
  const json = await response.json();
  return json as GetResponse<T>;
}
export async function putQueryJson<T, Body>(
  url: string, 
  body: Body,
  signal?: AbortSignal
): Promise<GetResponse<T>> {  

  const response = await fetch(
    url, 
    { 
      headers: {
        'Content-Type': 'application/json'
      },
      signal, 
      method: 'PUT', 
      body: JSON.stringify(body)
    }
  );
  const json = await response.json();
  return json as GetResponse<T>;
}
export async function deleteQuery<T>(
  url: string, 
  signal?: AbortSignal
): Promise<Response<T>> {
  const response = await fetch(url, { signal, method: 'DELETE' });
  const json = await response.json();
  return json as Response<T>;
}
