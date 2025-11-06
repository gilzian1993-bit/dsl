// /emails/TripOrderEmail.tsx
import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Img,
  Text,
  Heading,
  Button,
  Hr,
} from "@react-email/components";

interface Stop {
  label: string;
  value: string;
}

interface TripOrderEmailProps {
  carImage: string;
  stops: Stop[];
  viewOrderLink: string;
}

export function NewBookingEmailTemplate({
  carImage,
  stops,
  viewOrderLink,
  
}: TripOrderEmailProps) {
    const logoImage = "https://dsllimoservice.com/Logo.png";
  return (
    <Html>
      <Head />
      <Preview>Your Trip Details</Preview>

      <Body style={main}>
        <Container style={container}>
          {/* Logo Section */}
          <Section style={logoSection}>
            <Img
              src={logoImage}
              alt="Company Logo"
              width={120}
              height={45}
              style={logoStyle}
            />
          </Section>

          {/* Heading */}
          <Heading style={heading}>Your Trip Details</Heading>

          {/* Car Image */}
          <Section style={imageSection}>
            <Img src={carImage} alt="Car Image" width="100%" style={carImageStyle} />
          </Section>

          {/* Stops Info */}
          <Section>
            <Text style={subheading}>Stops Information:</Text>
            <Hr style={divider} />
            {stops.map((stop, index) => (
              <Section key={index} style={stopSection}>
                <Text style={stopLabel}>{stop.label}</Text>
                <Text style={stopValue}>{stop.value}</Text>
              </Section>
            ))}
          </Section>

          {/* View Order Button */}
          <Section style={buttonSection}>
            <Button style={button} href={viewOrderLink}>
              View Order
            </Button>
          </Section>

          <Hr style={divider} />
          <Text style={footerText}>
            Thank you for choosing us — have a great trip!
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  padding: "20px",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  padding: "30px",
  margin: "0 auto",
  maxWidth: "520px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const logoSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "20px",
};

const logoStyle: React.CSSProperties = {
  display: "inline-block",
  maxWidth: "120px",
  height: "auto",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  textAlign: "center",
  color: "#333",
  marginBottom: "20px",
};

const imageSection: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "20px",
};

const carImageStyle: React.CSSProperties = {
  borderRadius: "8px",
  maxHeight: "220px",
  objectFit: "cover",
};

const subheading: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#333",
};

const stopSection: React.CSSProperties = {
  marginBottom: "10px",
};

const stopLabel: React.CSSProperties = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "2px",
};

const stopValue: React.CSSProperties = {
  fontSize: "16px",
  color: "#000",
  fontWeight: "500",
};

const buttonSection: React.CSSProperties = {
  textAlign: "center",
  marginTop: "30px",
};

const button: React.CSSProperties = {
  backgroundColor: "#0070f3",
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600",
  display: "inline-block",
};

const divider: React.CSSProperties = {
  borderTop: "1px solid #eee",
  margin: "16px 0",
};

const footerText: React.CSSProperties = {
  textAlign: "center",
  color: "#999",
  fontSize: "12px",
  marginTop: "16px",
};
