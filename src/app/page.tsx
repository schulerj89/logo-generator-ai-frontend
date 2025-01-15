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
  Pagination,
  Box,
  Alert,
  Collapse,
  IconButton,
  Tooltip,
  IconButton as MuiIconButton,
} from "@mui/material";
import { FileCopy as FileCopyIcon } from "@mui/icons-material";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setAPIError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<{ filename: string; user_prompt: string }[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const limit = 16;
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

  const imageContainerStyle = {
    position: "relative",
    width: "200px", // Updated width
    height: "200px", // Updated height
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s",
    flexDirection: "column",
  };

  const imageContainerHoverStyle = {
    ...imageContainerStyle,
    "&:hover .overlay": {
      opacity: 1,
    },
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

        {/* New section "Why Choose Us?" */}
        <Box sx={{ marginTop: "40px" }}>
          <Typography variant="h5" gutterBottom>
            Why Choose Us?
          </Typography>
          <Typography variant="body1" paragraph>
            Unique AI-generated designs optimized for web and print.
          </Typography>
          <Typography variant="body1" paragraph>
            Logos under 500KB for fast loading.
          </Typography>
          <Typography variant="body1" paragraph>
            Perfect for fantasy sports leagues, merchandise, and more.
          </Typography>
        </Box>

        {loading && <CircularProgress />}

        {imageUrl && (
          <Box sx={imageContainerHoverStyle}>
            <img
              src={`api/images/${imageUrl}`}
              alt="Generated Fantasy Football Mascot"
              style={imageStyle as React.CSSProperties}
            />
            <Box className="overlay" sx={overlayStyle}>
              <Typography variant="body2" align="center" sx={{ marginBottom: "10px" }}>
                {prompt}
              </Typography>
              <Tooltip title="Copy Image URL">
                <MuiIconButton
                  color="inherit"
                  onClick={() => copyImageUrl(`api/images/${imageUrl}`)}
                >
                  <FileCopyIcon />
                </MuiIconButton>
              </Tooltip>
            </Box>
          </Box>
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

        <Box sx={{ overflowY: "auto", paddingBottom: "10px" }}>
          <Grid
            container
            spacing={1} // Reduced spacing
            justifyContent={images.length === 1 ? "center" : "flex-start"}
          >
            {images.length > 0 ? (
              images.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}> {/* Adjusted grid item size */}
                  <Box sx={imageContainerHoverStyle}>
                    <img
                      src={`api/images/${image.filename}`}
                      alt={`Generated image for ${image.user_prompt}`}
                      style={imageStyle as React.CSSProperties}
                    />
                    <Box className="overlay" sx={overlayStyle}>
                      <Typography variant="body2" align="center" sx={{ marginBottom: "10px" }}>
                        {image.user_prompt}
                      </Typography>
                      <Tooltip title="Copy Image URL">
                        <MuiIconButton
                          color="inherit"
                          onClick={() => copyImageUrl(`api/images/${image.filename}`)}
                        >
                          <FileCopyIcon />
                        </MuiIconButton>
                      </Tooltip>
                    </Box>
                  </Box>
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

        {/* Section explaining why the custom logo was created */}
        <Box sx={{ marginTop: "40px" }}>
          <Typography variant="h5" gutterBottom>
            Why We Created This Logo Generator
          </Typography>
          <Typography variant="body1" paragraph>
            We needed a custom logo for our fantasy sports websites that allows for a URL and needs to be 256x256 pixels in size. This ensures that the logo is optimized for fast loading and performance across various platforms.
          </Typography>
        </Box>

        {/* FAQs Section */}
        <Box sx={{ marginTop: "40px" }}>
          <Typography variant="h5" gutterBottom>
            How Does the Fantasy Sports Logo Generator Work?
          </Typography>
          <Typography variant="body1" paragraph>
            Step 1: Enter a short description of your mascot (e.g., &quot;A fierce dragon with blue scales and a football helmet&quot;).
          </Typography>
          <Typography variant="body1" paragraph>
            Step 2: Click &quot;Generate New Image.&quot;
          </Typography>
          <Typography variant="body1" paragraph>
            Step 3: View your unique mascot, and copy the image URL to share or download it for your team!
          </Typography>
        </Box>

        {/* Answer to "Will this website always be free?" */}
        <Box sx={{ marginTop: "40px" }}>
          <Typography variant="h5" gutterBottom>
            Will this website always be free?
          </Typography>
          <Typography variant="body1" paragraph>
            Yes, hopefully! We plan to keep this website free by supporting it with ads.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
