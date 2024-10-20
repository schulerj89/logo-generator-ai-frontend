'use server'

import { NextApiRequest } from "next";

export async function GET(request: NextApiRequest) {
    const url = request.url;
    if (!url) {
        return new Response('Invalid request URL', {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    // Parse the query string to get the page and limit
    const query = url.split('?')[1];
    const paramsArray = query.split('&');
    const page = paramsArray[0].split('=')[1];
    const limit = paramsArray[1].split('=')[1];


    try {
        const response = await fetch(`${process.env.BACKEND_URL}/images?page=${page}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching images: ${response.statusText}`);
        }
    
        const { status, images, total_pages } = await response.json();

        return new Response(JSON.stringify({ status, images, total_pages }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        return new Response('Error fetching images', {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

}