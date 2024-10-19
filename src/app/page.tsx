"use client"
import { useState } from 'react';

export default function Home() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setAPIError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');  // State to store user input

  const generateNewImage = async () => {
    setLoading(true);
    setAPIError(null);

    try {
      const response = await fetch('http://localhost:5000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,  // Send the user prompt to the API
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setImageUrl(data.image_url);
      } else {
        setAPIError(data.message);
      }
    } catch (err) {
      setAPIError('An error occurred while fetching the image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Fantasy Football Mascot Generator</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateNewImage();
        }}
      >
        <label>
          Enter a prompt for the mascot:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}  // Update state as the user types
          />
        </label>
        <button type="submit">Generate New Image</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        imageUrl && <img src={imageUrl} alt="Generated Fantasy Football Mascot" style={{ width: '256px', height: '256px' }} />
      )}
    </div>
  );
}
