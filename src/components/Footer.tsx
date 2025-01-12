import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ padding: "20px", textAlign: "center", borderTop: "1px solid #ddd", marginTop: "20px" }}>
      <Typography variant="body2" color="inherit">
        &copy; {new Date().getFullYear()} Fantasy Sports Logos. All rights reserved.
      </Typography>
      <Link href="/privacy-policy" color="inherit" sx={{ display: "block", marginTop: "10px" }}>
        Privacy Policy
      </Link>
    </Box>
  );
}
