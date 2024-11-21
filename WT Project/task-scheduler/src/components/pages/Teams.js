import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from "@mui/material";
const Teams = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [teams, setTeams] = useState([]);
  const [people, setPeople] = useState([]);
  return (
    <div className="page-container">
      <div
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 64px 16px 16px",
        }}
      >
        <h1 className="page-title">People and Teams</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "var(--primary)",
              color: "var(--text-color)",
            }}
          >
            Create Team
          </Button>
          <Button
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              backgroundColor: "var(--secondary)",
              color: "var(--text-color)",
            }}
          >
            Add People
          </Button>
        </div>
      </div>
      {/* Sections: People and Teams */}
      <div style={{ padding: "16px", marginBottom: "32px" }}>
        <h2 style={{ marginBottom: "24px", color: "var(--text-color)" }}>
          People
        </h2>

        {/* People Section */}
        <Grid container spacing={2} paddingBottom="32px">
          {/* User Profile Card */}
          <Grid item xs={12} sm={2.5} md={4}>
            <Card
              style={{
                backgroundColor: "var(--primary)",
              }}
            >
              <CardMedia
                component="img"
                alt="Profile Picture"
                style={{
                  marginTop: "24px",
                  marginBottom: "8px",
                }}
                sx={{
                  width: 70, // Adjust the size as per requirement
                  height: 70, // Equal height and width to make the image circular
                  borderRadius: "50%", // Makes the image circular
                  objectFit: "cover", // Ensures the image covers the circle area without distortion
                  margin: "auto auto", // Center the image horizontally
                }}
                image={user.photoURL} // Replace with actual profile picture URL
              />
              <CardContent style={{ padding: "0px" }}>
                <Typography
                  variant="h6"
                  align="center"
                  fontSize="15px"
                  color="var(--text-color)"
                  paddingBottom="64px"
                >
                  {user.displayName} {/* Replace with user's name */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <h2 style={{color: "var(--text-color)"}}>Teams</h2>
        {/* Teams Section (can be dynamically populated with teams data) */}
        <Grid container spacing={2}>
          {/* Example of team display (customize as needed) */}
        </Grid>
      </div>
    </div>
  );
};

export default Teams;
