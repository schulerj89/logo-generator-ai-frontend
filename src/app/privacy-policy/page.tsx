"use client";
import { Container, Typography } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="lg" sx={{ paddingTop: "20px", minHeight: "700px", paddingBottom: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1" color="textPrimary" paragraph>
        Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information when you use our Fantasy Sports Logos platform.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Information Collection and Use
      </Typography>
      <Typography variant="body1" color="textPrimary" paragraph>
        We collect prompts entered by users to generate custom fantasy sports logos. These prompts are used to further enhance our prompt database to ensure high quality and consistent imagery. We do not share these prompts with third parties.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Cookies and Tracking
      </Typography>
      <Typography variant="body1" color="textPrimary" paragraph>
        We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.
      </Typography>
      <Typography variant="body1" color="textPrimary" paragraph>
        We use Google Analytics to monitor and analyze the use of our service. Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our service. This data is shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.
      </Typography>
      <Typography variant="body1" color="textPrimary" paragraph>
        You can opt-out of having made your activity on the service available to Google Analytics by installing the Google Analytics opt-out browser add-on. The add-on prevents the Google Analytics JavaScript (ga.js, analytics.js, and dc.js) from sharing information with Google Analytics about visits activity.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Changes to This Privacy Policy
      </Typography>
      <Typography variant="body1" color="textPrimary" paragraph>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
      </Typography>
      <Typography variant="body1" color="textPrimary" paragraph>
        This Privacy Policy was last updated on January 12, 2025.
      </Typography>
    </Container>
  );
}
