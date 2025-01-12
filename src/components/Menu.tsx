import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function Menu() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Fantasy Sports Logos
        </Typography>
        <Button color="inherit" component={Link} href="/">
          Home
        </Button>
        <Button color="inherit" component={Link} href="/about">
          About Us
        </Button>
      </Toolbar>
    </AppBar>
  );
}
