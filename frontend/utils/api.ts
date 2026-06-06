
export async function apiGet<T>(endpoint: string, token?: string | null): Promise<T> {
    const headers: HeadersInit = {}
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        }
    )
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}
