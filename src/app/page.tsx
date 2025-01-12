"use client";
import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Pagination,
  Box,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setAPIError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<{ filename: string; user_prompt: string }[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const limit = 9;
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
    setTimeout(() => {
      setAlertOpen(false);
    }, 2000);
  };

  const fetchPrompts = async () => {
    try {
      const response = await fetch("api/prompts/generate", {
        method: "GET",
      });
      const data = await response.json();

      if (data.status === "success") {
        setPromptSuggestions(data.prompts);
      } else {
        setAPIError("Error fetching prompts");
      }
    } catch (err) {
      setAPIError("An error occurred while fetching the prompts: " + err);
    }
  };

  // Fetch paginated images from the database
  const fetchImages = async (currentPage: number) => {
    try {
      const response = await fetch(
        `api/images?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setImages(data.images);
        setTotalPages(data.total_pages);
      } else {
        setAPIError("Error fetching images");
      }
    } catch (err) {
      setAPIError("An error occurred while fetching the images: " + err);
    }
  };

  // Call fetchPrompts when the component mounts
  useEffect(() => {
    fetchPrompts();
  }, []);

  // Call fetchImages when the component mounts or when the page changes
  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const generateNewImage = async () => {
    setLoading(true);
    setAPIError(null);

    try {
      const response = await fetch("api/images/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setImageUrl(data.filename);
        fetchImages(page);
      } else {
        setAPIError(data.message);
      }
    } catch (err) {
      setAPIError("An error occurred while fetching the image: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const copyImageUrl = (url: string) => {
    const fullUrl = `${window.location.origin}/${url}`;
    navigator.clipboard.writeText(fullUrl);
    showAlert('Image URL copied to clipboard!');
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ paddingTop: "20px", minHeight: "700px", paddingBottom: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Fantasy Sports Logo Generator
        </Typography>

        <Typography variant="body1" color="textPrimary" sx={{ marginBottom: "20px" }}>
          Create your own fantasy sports mascot logo in 256x256 pixels resolution.
          The generated logo will be less than 500KB in size, ensuring fast loading and
          optimal performance for use across various platforms.
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateNewImage();
          }}
          style={{ marginBottom: "20px" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Enter a prompt for the mascot"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ marginBottom: "10px" }}
          />

          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ marginBottom: "10px" }}
            >
              {error}
            </Typography>
          )}

          {/* Suggestion Cards with light gray background */}
          <Box sx={{ display: "flex", gap: 2, marginBottom: "20px" }}>
            {promptSuggestions.map((suggestion, index) => (
              <Card
                key={index}
                sx={{ cursor: "pointer", flex: 1, backgroundColor: "#f5f5f5" }}  // Light gray background
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <CardContent>
                  <Typography variant="body2" align="center">
                    {suggestion}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ marginBottom: "20px" }}
          >
            Generate New Image
          </Button>
        </form>

        {loading && <CircularProgress />}

        {imageUrl && (
          <Card sx={{ maxWidth: 256, margin: "20px auto" }}>
            <CardMedia
              component="img"
              image={`api/images/${imageUrl}`}
              alt="Generated Fantasy Football Mascot"
              sx={{
                height: 256,
                width: 256,
                objectFit: "contain",
                margin: "auto",
                padding: "10px",
              }}
            />
            <CardContent>
              <Button
                variant="contained"  // Changed from "outlined" to "contained"
                color="primary"
                onClick={() => copyImageUrl(`api/images/${imageUrl}`)}
                fullWidth
                sx={{ color: "#fff" }}  // Set text color to white
              >
                Copy Image URL
              </Button>
            </CardContent>
          </Card>
        )}

        <Typography variant="h5" gutterBottom>
          User Generated Images
        </Typography>

        <Collapse in={alertOpen}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpen(false);
                }}
              />
            }
            sx={{ mb: 2 }}
          >
            {alertMessage}
          </Alert>
        </Collapse>

        <Box sx={{ maxHeight: "400px", overflowY: "auto", paddingBottom: "10px" }}>
          <Grid
            container
            spacing={3}
            justifyContent={images.length === 1 ? "center" : "flex-start"}
          >
            {images.length > 0 ? (
              images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: 2,
                      minHeight: 450,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`api/images/${image.filename}`}
                      alt={`Generated image for ${image.user_prompt}`}
                      sx={{
                        height: 256,
                        width: 256,
                        objectFit: "contain",
                        margin: "auto",
                        padding: "10px",
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
                        sx={{ minHeight: 75 }}
                      >
                        {image.user_prompt}
                      </Typography>
                      <Button
                        variant="contained"  // Changed from "outlined" to "contained"
                        color="primary"
                        onClick={() => copyImageUrl(`api/images/${image.filename}`)}
                        fullWidth
                        sx={{ color: "#fff" }}  // Set text color to white
                      >
                        Copy Image URL
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1">No images found</Typography>
            )}
          </Grid>
        </Box>

        <Grid container justifyContent="center" sx={{ marginTop: "20px" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Grid>
      </Container>
    </>
  );
}
