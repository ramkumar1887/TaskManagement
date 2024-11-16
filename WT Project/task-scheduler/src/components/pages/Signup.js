import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Card, CardContent } from '@mui/material';
import { auth, provider, createUserWithEmailAndPassword, signInWithPopup } from './firebase';
import { Google } from '@mui/icons-material';
import { ArrowBack } from '@mui/icons-material';

const Signup = ({ setCurrentPage }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    // Error states for individual fields
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleSignUp = async () => {
        // Clear all previous errors
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setError('');

        let valid = true;

        // Check if each field is filled
        if (!firstName) {
            setFirstNameError('First Name is required');
            valid = false;
        }
        if (!lastName) {
            setLastNameError('Last Name is required');
            valid = false;
        }
        if (!email) {
            setEmailError('Email is required');
            valid = false;
        }
        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        }
        if (!confirmPassword) {
            setConfirmPasswordError('Confirm Password is required');
            valid = false;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            valid = false;
        }

        // If all fields are valid, proceed with sign up
        if (valid) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                //console.log('User signed up:', user);
                localStorage.setItem('user', JSON.stringify(user));
                fetch("/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({uid: user.providerData[0].uid}),
                  });
                setCurrentPage('Dashboard');  // Redirect to dashboard after signup
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            //console.log('Google Sign Up:', user);
            localStorage.setItem('user', JSON.stringify(user));
            fetch("http://localhost:5000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({username: user.providerData[0].uid}),
              });
            setCurrentPage('Dashboard');  // Redirect to dashboard after Google signup
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Card sx={{ maxWidth: 400, width: '100%', backgroundColor: 'var(--primary)' }}>
                <CardContent>
                    {/* Back Button */}
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => setCurrentPage('Landing')}
                        sx={{ mb: 2, color: 'var(--secondary)' }}
                    />
                    <Typography variant="h4" align="center" fontFamily="Oxanium" color='var(--text-color)' gutterBottom>Create an Account</Typography>

                    {/* First Name */}
                    <TextField 
                        fullWidth 
                        label="First Name" 
                        margin="normal" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        error={Boolean(firstNameError)}
                        helperText={firstNameError}
                        sx={{
                            '& .MuiInputLabel-root': { 
                                color: 'var(--text-color)', // Default label color
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'var(--link-color)', // Label color when focused
                            },
                            '& .MuiInputLabel-root:hover': {
                                color: 'var(--link-color)', // Label color when hovered
                            }, // Label color
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'var(--text-color)', // Border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'var(--link-color)', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--link-color)', // Border color when focused
                                },
                                '& input': { color: 'var(--text-color)' }, // Text inside the box
                            },
                            '& .MuiFormHelperText-root': { color: 'white' }, // Helper text color
                        }}
                    />

                    {/* Last Name */}
                    <TextField 
                        fullWidth 
                        label="Last Name" 
                        margin="normal" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        error={Boolean(lastNameError)}
                        helperText={lastNameError}
                        sx={{
                            '& .MuiInputLabel-root': { 
                                color: 'var(--text-color)', // Default label color
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'var(--link-color)', // Label color when focused
                            },
                            '& .MuiInputLabel-root:hover': {
                                color: 'var(--link-color)', // Label color when hovered
                            }, // Label color
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'var(--text-color)', // Border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'var(--link-color)', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--link-color)', // Border color when focused
                                },
                                '& input': { color: 'var(--text-color)' }, // Text inside the box
                            },
                            '& .MuiFormHelperText-root': { color: 'white' }, // Helper text color
                        }}
                    />

                    {/* Email */}
                    <TextField 
                        fullWidth 
                        label="Email" 
                        margin="normal" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        error={Boolean(emailError)}
                        helperText={emailError}
                        sx={{
                            '& .MuiInputLabel-root': { 
                                color: 'var(--text-color)', // Default label color
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'var(--link-color)', // Label color when focused
                            },
                            '& .MuiInputLabel-root:hover': {
                                color: 'var(--link-color)', // Label color when hovered
                            }, // Label color
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'var(--text-color)', // Border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'var(--link-color)', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--link-color)', // Border color when focused
                                },
                                '& input': { color: 'var(--text-color)' }, // Text inside the box
                            },
                            '& .MuiFormHelperText-root': { color: 'white' }, // Helper text color
                        }}
                    />

                    {/* Password */}
                    <TextField 
                        fullWidth 
                        type="password" 
                        label="Password" 
                        margin="normal" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        error={Boolean(passwordError)}
                        helperText={passwordError}
                        sx={{
                            '& .MuiInputLabel-root': { 
                                color: 'var(--text-color)', // Default label color
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'var(--link-color)', // Label color when focused
                            },
                            '& .MuiInputLabel-root:hover': {
                                color: 'var(--link-color)', // Label color when hovered
                            }, // Label color
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'var(--text-color)', // Border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'var(--link-color)', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--link-color)', // Border color when focused
                                },
                                '& input': { color: 'var(--text-color)' }, // Text inside the box
                            },
                            '& .MuiFormHelperText-root': { color: 'white' }, // Helper text color
                        }}
                    />

                    {/* Confirm Password */}
                    <TextField 
                        fullWidth 
                        type="password" 
                        label="Confirm Password" 
                        margin="normal" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        error={Boolean(confirmPasswordError)}
                        helperText={confirmPasswordError}
                        sx={{
                            '& .MuiInputLabel-root': { 
                                color: 'var(--text-color)', // Default label color
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'var(--link-color)', // Label color when focused
                            },
                            '& .MuiInputLabel-root:hover': {
                                color: 'var(--link-color)', // Label color when hovered
                            }, // Label color
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'var(--text-color)', // Border color
                                },
                                '&:hover fieldset': {
                                    borderColor: 'var(--link-color)', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--link-color)', // Border color when focused
                                },
                                '& input': { color: 'var(--text-color)' }, // Text inside the box
                            },
                            '& .MuiFormHelperText-root': { color: 'white' }, // Helper text color
                        }}
                    />

                    {/* General Error */}
                    {error && <Typography color="error" align="center">{error}</Typography>}

                    {/* Sign Up Button */}
                    <Button fullWidth variant="contained" color="primary" onClick={handleSignUp} sx={{ mt: 2, backgroundColor:"var(--secondary)", color:'var(--text-color)' }}>
                        Sign Up
                    </Button>

                    {/* Google Sign Up */}
                    <Button fullWidth variant="outlined" color="secondary" startIcon={<Google />} onClick={handleGoogleSignUp} sx={{ mt: 2, backgroundColor:"var(--secondary)", color:'var(--text-color)' }}>
                        Sign Up with Google
                    </Button>

                    {/* Redirect to Login */}
                    <Button fullWidth color="primary" onClick={() => setCurrentPage('Login')} sx={{ mt: 2, color:'var(--link-color)' }}>
                        Already have an account? Log In
                    </Button>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default Signup;
