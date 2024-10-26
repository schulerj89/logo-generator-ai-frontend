'use server'

export async function GET(request: Request, { params }: { params: { filename: string }}) {
    const { filename } = params;

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/images/${filename}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching image: ${response.statusText}`);
        }
    
        // Stream the image content back to the client
        const imageBuffer = await response.arrayBuffer();

        return new Response(Buffer.from(imageBuffer), {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return new Response('Error fetching image', {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}