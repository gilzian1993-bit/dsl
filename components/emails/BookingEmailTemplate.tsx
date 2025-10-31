import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Heading,
} from "@react-email/components";
import { BookingData } from "@/app/actions/send-booking";

function formatCurrency(n?: number | null) {
  if (n === undefined || n === null) return "0.00";
  return Number(n).toFixed(2);
}

export default function BookingEmail(props: BookingData ) {
  const {
    name,
    email,
    phone_number,
    from_location,
    to_location,
    stops = [],
    pickup_date,
    pickup_time,
    return_date,
    return_time,
    passengers,
    luggage,
    car_type,
    tripType,
    hours,
    distance,
    rear_seats,
    booster_seats,
    infantSeat,
    return_rear_seats,
    return_booster_seats,
    return_infantSeat,
    base_price,
    gratuity,
    tax,
    discount,
    totalPrice,
    isMeetGreetPrice,
    rearSeatPrice,
    infantSeatPrice,
    boosterSeatPrice,
    returnPrice,
    isReturnMeetGreetPrice,
    returnRearSeatPrice,
    returnInfantSeatPrice,
    returnBoosterSeatPrice,
    category
  } = props;

  const logoUrl =
    "https://res.cloudinary.com/dyafh5fka/image/upload/v1758446802/Logo_hmxx7l.png";
  const primaryColor = "#F04C24";

  return (
    <Html>
      <Head>
        <title>DSL Limo Service - Booking Confirmation</title>
      </Head>
      <Body
        style={{
          fontFamily: "Montserrat, Arial, sans-serif",
          backgroundColor: "#ffffff",
          color: "#333",
          margin: 0,
          padding: 0,
        }}
      >
        <Container style={{ maxWidth: "680px", margin: "0 auto" }}>
          <Section
        style={{
          backgroundColor: "#000",
          color: "#fff",
          textAlign: "center",
          padding: "30px 20px",
          borderBottom: "4px solid #F04C24",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Heading
            style={{
              margin: 0,
              fontSize: 40,
              letterSpacing: "1px",
              fontWeight: "600",
            }}
          >
            Booking Details
          </Heading>
        </div>
      </Section>

          <Section style={{ padding: "20px" }}>
            <table
              width="100%"
              cellPadding={0}
              cellSpacing={0}
              style={{
                borderCollapse: "collapse",
                fontSize: "14px",
                width: "100%",
              }}
            >
              <tbody>
                {[
                  ["Pickup Location", from_location],
                  ["Dropoff Location", to_location],
                  ["Pickup Date", pickup_date],
                  ["Pickup Time", pickup_time || "N/A"],
                  ["Distance", `${distance ?? "N/A"} miles`],
                  ["Hours", category === "hourly" ? hours : "0"],
                  ["Trip Type", tripType],
                  ["Car Type", car_type],
                  ["Name", name],
                  ["Email", email],
                  ["Phone", phone_number],
                  ["Luggage", luggage ?? 0],
                  ["Passengers", passengers ?? 0],
                ].map(([label, value], i) => (
                  <tr
                    key={label}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fff" : "#f5f5f5",
                    }}
                  >
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      <strong>{label}</strong>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {value}
                    </td>
                  </tr>
                ))}

                {/* Stops */}
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <strong>Stops</strong>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {stops.length > 0
                      ? stops.map((s, i) => (
                          <div key={i}>{`Stop ${i + 1}: ${s}`}</div>
                        ))
                      : "No"}
                  </td>
                </tr>

                {/* Return Info */}
                {[
                  ["Return Date", return_date || "No"],
                  ["Return Time", return_time || "No"],
                  ["Rear Seats", rear_seats ?? 0],
                  ["Booster Seats", booster_seats ?? 0],
                  ["Infant Seat", infantSeat ?? "No"],
                  ["Return Rear Seats", return_rear_seats ?? 0],
                  ["Return Booster Seats", return_booster_seats ?? 0],
                  ["Return Infant Seat", return_infantSeat ?? "No"],
                ].filter(([label, _])=>{
                    if(Number(returnPrice) > 0){return true};
                    return !String(label).startsWith('Return')
                }).map(([label, value], i) => (
                  <tr
                    key={label}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fff" : "#f5f5f5",
                    }}
                  >
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      <strong>{label}</strong>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {value}
                    </td>
                  </tr>
                ))}

                {/* Invoice Header */}
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      background: "#f5f5f5",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: '24px' ,
                      padding: "12px",
                    }}
                  >
                    Price Breakdown
                  </td>
                </tr>

                {/* Price Details */}
                {[
                  ["Base Price", formatCurrency(Number(base_price))],
                  [
                    "Meet and Greet",
                    formatCurrency(Number(isMeetGreetPrice)
                    ),
                  ],
                  [
                    "Child Seats",
                    `Rear: $${formatCurrency(Number(rearSeatPrice))} | Booster: $${formatCurrency(
                     Number( boosterSeatPrice)
                    ) } | Infant: $${formatCurrency(Number(infantSeatPrice))} `,
                  ],
                  
                  ["Return Transfer", formatCurrency(Number(returnPrice))],
                  [
                    "Return Meet and Greet",
                    formatCurrency(Number(isReturnMeetGreetPrice)
                    ),
                  ],
                  [
                    "Return Child Seats",
                    `Rear: $${formatCurrency(Number(returnRearSeatPrice))} | Booster: $${formatCurrency(
                      Number(returnBoosterSeatPrice)
                    ) } | Infant: $${formatCurrency(Number(returnInfantSeatPrice))} `,
                  ],
                  ["Gratuity 20%", formatCurrency(Number(gratuity))],
                  ["Tax 5%", formatCurrency(Number(tax))],
                  ["Discount", `-${formatCurrency(Number(discount))}`],
                  
                 
                ].filter(([label, _])=>{
                    if(Number(returnPrice) > 0){return true};
                    return !String(label).startsWith('Return')
                }).map(([label, value], i) => (
                  <tr
                    key={label}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fff" : "#f5f5f5",
                    }}
                  >
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {label}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      ${value}
                    </td>
                  </tr>
                ))}

                {/* Total */}
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: primaryColor,
                      border: "1px solid #ddd",
                      padding: "12px",
                    }}
                  >
                    Total Price
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: primaryColor,
                      border: "1px solid #ddd",
                      padding: "12px",
                    }}
                  >
                    ${formatCurrency(Number(totalPrice))}
                  </td>
                </tr>
              </tbody>
            </table>

            <Text
              style={{
                textAlign: "center",
                marginTop: 12,
                fontSize: 14,
              }}
            >
              <em>Note:</em> Toll fee is <strong>not included</strong> in this
              trip.
            </Text>

            <Section
        style={{
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          borderTop: "2px solid #eee",
          padding: "30px 20px",
          marginTop: "20px",
        }}
      >
        <Img
          src={logoUrl}
          alt="DSL Logo"
          width="100"
          style={{ display: "block", margin: "0 auto 10px" }}
        />
        <Text style={{ color: "#555", fontSize: 12, margin: 0 }}>
          © {new Date().getFullYear()} DSL LIMO Services. All Rights Reserved.
        </Text>
        <Text
          style={{
            color: "#999",
            fontSize: 11,
            marginTop: "6px",
            fontStyle: "italic",
          }}
        >
          Thank you for choosing DSL Limo Service.
        </Text>
      </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
