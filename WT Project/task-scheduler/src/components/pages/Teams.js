import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { getFirestore, collection, query, where, getDocs, startAt, endAt, orderBy } from 'firebase/firestore';
import { auth } from "./firebase";
const db = getFirestore();

const Teams = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [teams, setTeams] = useState([]);
  const [people, setPeople] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avatars] = useState([
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}&backgroundColor=b6e3f4`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}&backgroundColor=c0aede`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}&backgroundColor=d1d4f9`,
  ]);
  const [cachedAvatar, setCachedAvatar] = useState(null);

  useEffect(() => {
    const loadUserAvatar = () => {
      if (!user?.photoURL) {
        setImageError(true);
        return;
      }

      // Set the photoURL directly without trying to cache it
      setCachedAvatar(user.photoURL);
    };

    loadUserAvatar();
  }, [user?.photoURL]);

  const getRandomAvatar = () => {
    // Option 1: avataaars - Cartoon-style human avatars (recommended)
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

    // Option 2: personas - Abstract human faces
    //return `https://api.dicebear.com/7.x/personas/svg?seed=${Math.random()}`;

    // Option 3: lorelei - Artistic human avatars
    //return `https://api.dicebear.com/7.x/lorelei/svg?seed=${Math.random()}`;
  };

  const defaultProfileImage = getRandomAvatar();
  const getAvatarGroup = () => {
    return (
      <div
        style={{
          display: "flex",
          width: 70,
          height: 70,
          position: "relative",
        }}
      >
        {avatars.map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid var(--primary)",
              position: "absolute",
              left: `${index * 20}px`,
              backgroundColor: "white",
            }}
          />
        ))}
      </div>
    );
  };

  const handleEmailSearch = async (value) => {
    setEmail(value);
    if (value.length > 2) {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        // First, let's check if we can get any users
        const snapshot = await getDocs(usersRef);
        console.log("Total users found:", snapshot.size); // Debug log

        // Now let's get filtered users
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        const users = [];
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log("User data:", userData); // Debug log
          
          // Check if the email includes the search value (case insensitive)
          if (userData.email && 
              userData.email.toLowerCase().includes(value.toLowerCase())) {
            console.log("Adding user:", userData); // Debug log
            users.push({
              id: doc.id,
              email: userData.email,
              displayName: userData.displayName || userData.email,
              photoURL: userData.photoURL
            });
          }
        });
        
        console.log("Filtered users:", users); // Debug log
        setFilteredUsers(users);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredUsers([]);
    }
  };

  const handleAddPerson = async () => {
    if (!email) {
      console.log('No email provided'); // Debug log
      return;
    }
    
    try {
      // Find the selected user from filteredUsers
      const selectedUser = filteredUsers.find(user => user.email === email);
      if (!selectedUser) {
        console.log('No matching user found'); // Debug log
        return;
      }

      console.log('Adding user:', selectedUser); // Debug log

      // Add to local state
      setPeople(prev => [...prev, selectedUser]);

      // Update in MongoDB
      const response = await fetch(`http://localhost:5000/addPerson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.uid,
          personId: selectedUser.id
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear the dialog
      setEmail('');
      setOpenDialog(false);
      setFilteredUsers([]);

    } catch (error) {
      console.error('Error adding person:', error);
      // Optionally add user feedback here
      alert('Failed to add person. Please try again.');
    }
  };

  // Add this useEffect to load people on component mount
  useEffect(() => {
    const loadPeople = async () => {
      try {
        // First get people IDs from MongoDB
        const response = await fetch(`http://localhost:5000/people?username=${user.uid}`);
        const { peopleIds } = await response.json();

        // Then fetch full details from Firebase
        const usersRef = collection(db, 'users');
        const peopleDetails = [];
        
        for (const id of peopleIds) {
          const q = query(usersRef, where('uid', '==', id));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            peopleDetails.push({
              id: doc.id,
              ...doc.data()
            });
          });
        }
        
        setPeople(peopleDetails);
      } catch (error) {
        console.error('Error loading people:', error);
      }
    };

    loadPeople();
  }, [user.uid]);

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
          <>
            <Button
              variant="contained"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--opText)",
                textTransform: "none",
                padding: "8px 8px",
              }}
              onClick={() => setOpenDialog(true)}
            >
              Add People
            </Button>

            <Dialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              PaperProps={{
                style: {
                  //minWidth: "90vw",
                  backgroundColor: "var(--primary)",
                  borderRadius: "8px",
                  position: "relative",
                  top: "-20vh",
                },
              }}
              BackdropProps={{
                style: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <DialogTitle
                style={{
                  paddingBottom: "8px",
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  paddingTop: "0px",
                  borderLeft: "16px solid transparent",
                  borderRight: "16px solid transparent",
                  borderTop: "8px solid transparent",
                  backgroundColor: "var(--background-color)",
                  color: "var(--text-color)",
                  borderBottom: "2px solid var(--text-color)",
                }}
              >
                Add People
              </DialogTitle>
              <DialogContent
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px',
                  backgroundColor: 'var(--background-color)',
                  gap: '0px'
                }}
              >
                <TextField
                  autoFocus
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => handleEmailSearch(e.target.value)}
                  style={{
                    marginBottom: "0px",
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--secondary)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--secondary)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--secondary)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "var(--text-color)",
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--text-color)",
                      "&.Mui-focused": {
                        color: "var(--secondary)",
                      },
                    },
                  }}
                />

                {loading && (
                  <Typography
                    variant="body2"
                    color="var(--text-color)"
                    align="center"
                  >
                    Searching...
                  </Typography>
                )}

                {filteredUsers.length > 0 && (
                  <List 
                    style={{
                      backgroundColor: "white",
                      padding: "0px",
                      //borderRadius: "8px",
                      //maxHeight: '200px',
                      overflowY: 'auto',

                    }}
                  >
                    {filteredUsers.map((user) => (
                      <ListItem
                        key={user.id}
                        button
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setEmail(user.email);
                          setFilteredUsers([]); // Clear the list
                          document.querySelector('input[type="email"]').focus(); // Re-focus the TextField
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.photoURL || getAvatarGroup()} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.displayName || user.email}
                          secondary={user.email}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </DialogContent>
              <DialogActions
                style={{
                  backgroundColor: "var(--background-color)",
                  border: "None",
                  paddingBottom: "8px",
                  paddingTop: "6px",
                  paddingRight: "0px",
                  paddingLeft: "0px",
                  borderTop: "2px solid var(--text-color)",
                  borderRight: "16px solid transparent",
                  borderLeft: "16px solid transparent",
                }}
              >
                <Button
                  onClick={() => setOpenDialog(false)}
                  style={{ color: "var(--text-color)" }}
                >
                  Cancel
                </Button>
                <Button
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--text-color)",
                  }}
                  onClick={handleAddPerson}
                >
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </>
        </div>
      </div>
      {/* Sections: People and Teams */}
      <div style={{ padding: "16px", marginBottom: "32px" }}>
        <h2 style={{ marginBottom: "24px", color: "var(--text-color)" }}>
          People
        </h2>

        {/* People Section */}
        <Grid container spacing={2} paddingBottom="32px">
          {/* Team Members Cards */}
          <Grid item xs={12} sm={4} md={1.25}>
            <Card
              style={{
                backgroundColor: "var(--primary)",
                height: "100%",
                //cursor: "pointer",
              }}
            >
              <CardMedia
                component="div"
                alt="Profile Picture"
                style={{
                  marginTop: "24px",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {getAvatarGroup()}
              </CardMedia>
              <CardContent
                style={{
                  padding: "0px",
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: "24px",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--opText)",
                    textTransform: "none",
                    //borderRadius: "8px",
                    padding: "8px 8px",
                  }}
                  onClick={() => setOpenDialog(true)}
                >
                  Add People
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Your profile card */}
          <Grid item xs={12} sm={4} md={1.25}>
            <Card
              style={{
                backgroundColor: "var(--primary)",
                height: "100%",
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
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "auto auto",
                }}
                image={cachedAvatar || defaultProfileImage}
                onError={() => {
                  console.error("Failed to load image:", cachedAvatar);
                  setImageError(true);
                  setCachedAvatar(defaultProfileImage);
                }}
              />
              <CardContent style={{ padding: "0px" }}>
                <Typography
                  variant="h6"
                  align="center"
                  fontSize="15px"
                  color="var(--text-color)"
                  paddingBottom="64px"
                >
                  {user.displayName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* People cards */}
          {people.map((person) => (
            <Grid item xs={12} sm={4} md={1.25} key={person.id}>
              <Card style={{
                backgroundColor: "var(--primary)",
                height: "100%",
              }}>
                <CardMedia
                  component="img"
                  alt="Profile Picture"
                  style={{
                    marginTop: "24px",
                    marginBottom: "8px",
                  }}
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "auto auto",
                  }}
                  image={person.photoURL || getRandomAvatar()}
                  onError={(e) => {
                    e.target.src = getRandomAvatar();
                  }}
                />
                <CardContent style={{ padding: "0px" }}>
                  <Typography
                    variant="h6"
                    align="center"
                    fontSize="15px"
                    color="var(--text-color)"
                    paddingBottom="64px"
                  >
                    {person.displayName || person.email}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <h2 style={{ color: "var(--text-color)" }}>Teams</h2>
        {/* Teams Section (can be dynamically populated with teams data) */}
        <Grid container spacing={2}>
          {/* Example of team display (customize as needed) */}
        </Grid>
      </div>
    </div>
  );
};

export default Teams;
