import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import testData from '../components/assets/testData.json';
import backgroundImage from '../components/assets/space.jpg'; // Path to your background image

export default function Earthscreen() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get(
        //     'https://api.nasa.gov/planetary/earth/assets?lon=-95.33&lat=29.78&date=2018-01-01&&dim=0.10&api_key=niJ6tVmhdYqFRejIlV6SFPMd0APa3uIwHPcyP3TY'
        //   );
        setApodData(testData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      style={{
       
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={2} columns={16}>
        <Grid item xs={4}>
          <Typography variant="h3" marginLeft={20} marginRight={30} gutterBottom style={{ color: '#fff' }}>
            NASA Earth Image
          </Typography>
          <Typography variant="h6" marginLeft={20}  gutterBottom style={{ color: '#fff' }}>
            The satellite passes over each point on earth roughly once every sixteen days. This is an amazing
            visualization of the acquisition pattern for Landsat 8 imagery.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              <Card sx={{ maxWidth: 745 }}>
                <CardMedia
                  sx={{ height: 380 }}
                  image={apodData.url}
                  title={apodData.title}
                  onClick={handleOpen}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {apodData.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {apodData.explanation}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleOpen}>
                    Click here to view image
                  </Button>
                </CardActions>
              </Card>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ width: 600, bgcolor: 'background.paper', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleClose} startIcon={<CloseIcon />} variant="outlined">
                      Close
                    </Button>
                  </Box>
                  <img src={apodData.url} alt={apodData.title} style={{ width: '100%', height: 'auto' }} />
                </Box>
              </Modal>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
