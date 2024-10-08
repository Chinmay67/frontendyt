import  { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Stack, TextField, styled, Box, Typography, Paper, Button, GlobalStyles, CircularProgress, Snackbar, Alert as MuiAlert } from '@mui/material';
import { useRecoilState } from 'recoil';
import { checkUser, userAtom } from '../../Store/atoms/userAtoms';
import { loginUser } from '../../api/userService';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Logout from '../logout/Logout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Blue
    },
    secondary: {
      main: '#34a853', // Green
    },
    text: {
      primary: '#202124', // Dark gray for text labels
    },
  },
});

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: '56px',
  },
  '& input': {
    padding: '0 10px',
    height: '100%',
    boxSizing: 'border-box',
    border: 'none',
    color: theme.palette.text.primary,
  },
  width: "100%",
}));

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentUser, setCurrentUser] = useRecoilState(userAtom);
  const [userStatus,setUserStatus]=useRecoilState(checkUser)
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const loggedUser = await loginUser(email, password);
      console.log(loggedUser)
      if(loggedUser.status===400){
        setErrorMessage("username and email are required");
        setUserStatus(false)
      
      }
      else if(
        loggedUser.status===404
      ){
        setErrorMessage("user does not exist")
      }
      else if(loggedUser.status===401){
        setErrorMessage("wrong password")
      }
      else{
        const loggedUserData = loggedUser.data.user;

        setCurrentUser(loggedUserData);
        setSuccessMessage('Logged in successfully');
        localStorage.setItem('userID', loggedUserData._id);
        setUserStatus(true);
        setLoading(false);
        setEmail('');
        setPassword('');
        navigate('/channel')

      }
      

      
      
      // window.location.reload()
      
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || 'Login failed');
      setUserStatus(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      {userStatus===false ?
      (
        <>
          <ThemeProvider theme={theme}>
          <GlobalStyles styles={{ body: { overflow: 'hidden' } }} />
          <Box sx={{
            background: 'linear-gradient(to bottom, #e8f0fe, #ffffff)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Paper sx={{
              width: "40%",
              padding: 4,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              borderRadius: 3,
              background: '#ffffff'
            }}>
              <Stack spacing={2} margin='auto' width='100%'>
                <Typography variant="h4" align="center" color="primary">Login Form</Typography>
                <CustomTextField
                  id="email"
                  label="Email"
                  variant="standard"
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <CustomTextField
                  id="password"
                  label="Password"
                  variant="standard"
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 4, borderRadius: '20px' }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
                {/* <Logout/> */}
                <Typography>New User? <Button component={Link} to='/signup'>Signup</Button></Typography>

              </Stack>
            </Paper>
          </Box>
        </ThemeProvider>

        <Snackbar
          open={!!successMessage}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
              <MuiAlert elevation={6} variant="filled" onClose={() => setSuccessMessage('')} severity="success">
                {successMessage}
              </MuiAlert>
            </Snackbar>
            <Snackbar
              open={!!errorMessage}
              onClose={() => setErrorMessage('')}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <MuiAlert elevation={6} variant="filled" onClose={() => setErrorMessage('')} severity="error">
                {errorMessage}
              </MuiAlert>
        </Snackbar>
      </>
      ):(
        <Button> <Logout/></Button>
      )
    
    }
    </>
  );
}

export default Login;
