'use server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    const url = new URL(request.url);
    const response = await fetch(`${process.env.BACKEND_URL}/generate-prompts`, {
        method: "GET",
    });

    if (!response.ok) {
        const { message } = await response.json();
        console.log(message)
        return new Response(message, {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const { status, prompts } = await response.json();


    return new Response(JSON.stringify({ status, prompts }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}