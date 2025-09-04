

import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ShortenerForm from './components/ShortenerForm';
import StatsPage from './components/StatsPage';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   // screens < 600px

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    // <Box
    //   sx={{
    //     minHeight: '100vh',
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     bgcolor: '#f7f9fc',
    //     px: 2,
    //   }}
    // >
    //   <Paper
    //     elevation={3}
    //     sx={{
    //       width: '100%',
    //       maxWidth: isMobile ? '100%' : 800,
    //       borderRadius: 2,
    //       overflow: 'hidden',
    //     }}
    //   >

        <Box
          sx={{
            minHeight: '100vh',
            minWidth: '100vw',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f7f9fc',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              width: '100%',
              height: '100%',
              borderRadius: 0, // full screen, no rounded corners
              overflow: 'auto', // scroll if content is longer
              display: 'flex',
              flexDirection: 'column',
            }}
          >
        {/* Title */}
        <Box sx={{ bgcolor: '#19d25aff', p: isMobile ? 1.5 : 2 }}>
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            sx={{
              fontWeight: 600,
              color: 'white',
              textAlign: 'center',
              fontSize: isMobile ? '0.9rem' : '1.2rem',
            }}
          >
            URL Shortener App for the Affordmed Internship Challenge done by 22L31A5478
          </Typography>
        </Box>

        {/* Tabs Navigation */}
        <Tabs
          value={tab}
          onChange={handleChange}
          orientation={isMobile ? 'vertical' : 'horizontal'} // stack on mobile
          variant="fullWidth"
          sx={{
            '& .MuiTabs-flexContainer': {
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
            },
            '& .MuiTab-root': {
              flex: 1,
              textTransform: 'none',
              fontWeight: 500,
              border: '1px solid black',
              borderRadius: 0,
              color: 'white',
              bgcolor: '#19d25aff',
              fontSize: isMobile ? '0.8rem' : '1rem',
              py: isMobile ? 1 : 1.5,
            },
            '& .Mui-selected': {
              bgcolor: 'white',
              fontWeight: 600,
              color: 'black',
            },
          }}
          TabIndicatorProps={{ style: { display: 'none' } }}
        >
          <Tab label="Shorten URL" {...a11yProps(0)} />
          <Tab label="Statistics" {...a11yProps(1)} />
        </Tabs>

        {/* Content */}
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          {tab === 0 && <ShortenerForm />}
          {tab === 1 && <StatsPage />}
        </Box>
      </Paper>
    </Box>
  );
}

export default App;
