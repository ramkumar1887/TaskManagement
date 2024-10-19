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
                console.log('User signed up:', user);
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
            console.log('Google Sign Up:', user);
            setCurrentPage('Dashboard');  // Redirect to dashboard after Google signup
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
            <Card sx={{ maxWidth: 400, width: '100%' }}>
                <CardContent>
                    {/* Back Button */}
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => setCurrentPage('Landing')}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="h4" align="center" gutterBottom>Create an Account</Typography>

                    {/* First Name */}
                    <TextField 
                        fullWidth 
                        label="First Name" 
                        margin="normal" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        error={Boolean(firstNameError)}
                        helperText={firstNameError}
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
                    />

                    {/* General Error */}
                    {error && <Typography color="error" align="center">{error}</Typography>}

                    {/* Sign Up Button */}
                    <Button fullWidth variant="contained" color="primary" onClick={handleSignUp} sx={{ mt: 2 }}>
                        Sign Up
                    </Button>

                    {/* Google Sign Up */}
                    <Button fullWidth variant="outlined" color="secondary" startIcon={<Google />} onClick={handleGoogleSignUp} sx={{ mt: 2 }}>
                        Sign Up with Google
                    </Button>

                    {/* Redirect to Login */}
                    <Button fullWidth color="primary" onClick={() => setCurrentPage('Login')} sx={{ mt: 2 }}>
                        Already have an account? Log In
                    </Button>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default Signup;
