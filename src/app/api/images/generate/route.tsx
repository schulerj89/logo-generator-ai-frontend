'use server'

export async function POST(request: Request) {
    const { prompt } = await request.json();

    const response = await fetch(`${process.env.BACKEND_URL}/generate-image`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const { message } = await response.json();

        if (response.status === 429) {
            return new Response(JSON.stringify({ message: "Rate limit exceeded" }), {
                status: 429,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        return new Response(JSON.stringify({ message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const { filename, status } = await response.json();

    return new Response(JSON.stringify({ filename, status }), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}