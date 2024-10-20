'use server'

export async function GET(request: Request, { params }: { params: { filename: string }}) {
    const { filename } = params;

    try {
        const response = await fetch(`http://localhost:5000/images/${filename}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching image: ${response.statusText}`);
        }
    
        // Stream the image content back to the client
        const imageBuffer = await response.arrayBuffer();

        return new Response(Buffer.from(imageBuffer), {
            headers: {
                'Content-Type': 'image/png',
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