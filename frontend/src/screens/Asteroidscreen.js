import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import backgroundImage from "../components/assets/space.jpg"; // Import the background image

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function AsteroidScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY"
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginLeft: "10%",
          marginTop: "10%",
          marginBottom: "10%",
        }}
      >
        <Typography
          variant="h3"
          
          align="center"
          gutterBottom
          style={{ color: "#fff" }}
        >
          Asteroids - NeoWs
        </Typography>
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          style={{ color: "#fff" }}
        >
          NeoWs (Near Earth Object Web Service) is a RESTful web service for
          near earth Asteroid information. With NeoWs a user can: search for
          Asteroids based on their closest approach date to Earth, lookup a
          specific Asteroid with its NASA JPL small body id, as well as browse
          the overall data-set.
        </Typography>
        {data?.near_earth_objects.map((asteroid) => (
          <Card key={asteroid.id} variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Asteroid ID: {asteroid.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Name: {asteroid.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hazardous:{" "}
                {asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" href={asteroid.nasa_jpl_url} target="_blank">
                Learn More
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </div>
  );
}
