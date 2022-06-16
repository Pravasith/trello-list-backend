import fetch from "node-fetch";

export interface fetchOptions {
    method: "get" | "put" | "post" | "delete";
    body?: string;
    headers?: string[][] | { [key: string]: string };
}

export const fetchData = <T>(
    url: string,
    options: fetchOptions
): Promise<T> => {
    return fetch(url, options).then(res => res.json() as Promise<T>);
};
