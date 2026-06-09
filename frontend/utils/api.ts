const getBaseUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (!baseUrl && typeof window !== 'undefined') {
        console.warn("NEXT_PUBLIC_API_URL environment variable is missing on the client side.");
    }
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

const getCleanUrl = (endpoint: string) => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${getBaseUrl()}${cleanEndpoint}`;
};

export async function apiGet<T>(endpoint: string, token?: string | null): Promise<T> {
    const headers: HeadersInit = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    const res = await fetch(getCleanUrl(endpoint), {
        headers,
        next: { revalidate: 60 }
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export async function apiPost<T>(endpoint: string, body: unknown, token?: string | null): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    const res = await fetch(getCleanUrl(endpoint),
        {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        }
    )
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export async function apiDelete<T>(endpoint: string, token?: string | null): Promise<T> {
    const headers: HeadersInit = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    const res = await fetch(getCleanUrl(endpoint),
        {
            method: 'DELETE',
            headers,
        }
    )
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

