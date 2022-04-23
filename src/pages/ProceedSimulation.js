import { useState, useEffect } from 'react'
import { useInterval } from '../components/useInterval'
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CalculateIcon from '@mui/icons-material/Calculate';
import axios from 'axios';
import _ from 'lodash'

export default function ProceedSimulation(props) {
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(null)
  const [delay, setDelay] = useState(null)

  const handleClickStart = (e) => {
    e.preventDefault()

    setProgress(0)
    if (ready) {
      const url = 'http://127.0.0.1:8000/proc_sim';
      const data = { num_trial: 500 }
      const config = {
        headers: {
          'content-type': 'application/json',
        },
      };
      axios.post(url, data, config).then((response) => {
        console.log(response.data)
      });
    } else {
      console.log('cells not ready')
    }
  }

  useInterval(() => {
    axios.get("http://127.0.0.1:8000/get_progress").then((response) => {
      setProgress(response.data.progress * 100)
    })
  }, delay)

  useEffect(() => {
    progress >= 0 && progress < 100 ? setDelay(1000) : setDelay(null)
  }, [progress])
  
  return (
    <>
      <Button variant="outlined" startIcon={<CalculateIcon />} onClick={handleClickStart} disabled={!ready}>
        Start
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
    </>
  )
}
