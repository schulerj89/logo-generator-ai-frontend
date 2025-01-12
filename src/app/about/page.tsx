"use client";
import { Container, Typography } from "@mui/material";

export default function About() {
  return (
    <Container maxWidth="lg" sx={{ paddingTop: "20px", minHeight: "700px", paddingBottom: "20px" }}>
      <Typography variant="h4" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body1" color="textPrimary">
        Welcome to Fantasy Sports Logos! Our platform allows you to generate custom fantasy sports logos for your team. Whether you are into football, basketball, or any other sport, our tool helps you create unique and personalized logos to represent your team.
      </Typography>
    </Container>
  );
}
