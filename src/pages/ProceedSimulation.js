import { useState, useEffect } from 'react'
import { useInterval } from '../components/useInterval'
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CalculateIcon from '@mui/icons-material/Calculate';
import axios from 'axios';
import _ from 'lodash'

export default function ProceedSimulation(props) {
  const [valueTrials, setValueTrials] = useState("")
  const [valueNumTrials, setValueNumTrials] = useState(null)
  const [trialsAboveZero, setTrialsAboveZero] = useState(null)

  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(null)
  const [delay, setDelay] = useState(null)

  const handleChangeTrials = (e) => {
    setValueTrials(e.target.value)
    setValueNumTrials(!isNaN(e.target.value))
  };

  const handleClickStart = (e) => {
    e.preventDefault()

    setProgress(0)
    if (ready) {
      const url = 'http://127.0.0.1:8000/proc_sim';
      const data = { num_trial: valueTrials }
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

  useEffect(() => {
    if (valueNumTrials) {
      Number(valueTrials) > 0 ? setTrialsAboveZero(true) : setTrialsAboveZero(false)
    } else {
      setTrialsAboveZero(null)
    }
  }, [valueTrials, valueNumTrials])

  useInterval(() => {
    if (progress != null) {
      axios.get("http://127.0.0.1:8000/get_progress").then((response) => {
        setProgress(response.data.progress * 100)
      })
    }
  }, delay)

  useEffect(() => {
    progress >= 0 && progress < 100 ? setDelay(1000) : setDelay(null)
  }, [progress])

  useEffect(() => {
    props.conn === 1 &&
    _.filter(props.randomCells, { assigned: true }).length >= 1 &&
      _.filter(props.monitoringCells, { assigned: true }).length >= 1 ?
      setReady(true) : setReady(false)
  }, [props.conn, props.randomCells, props.monitoringCells])

  return (
    <>
      <Typography variant="h6">
        Proceed Simulation
      </Typography>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
            Configuration
          </Typography>
        <TextField
              error={!valueNumTrials || !trialsAboveZero}
              helperText={!valueNumTrials ? "Trials value is not a number." : !trialsAboveZero ? "Trials value is not above zero." : ""}
              size="small"
              id="outlined-helperText"
              label="Trials"
              value={valueTrials}
              onChange={handleChangeTrials}
            />
          <Typography variant="subtitle2" color="text.secondary">
            Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate" value={progress} sx={{ 
                height: 10,
                borderRadius: 5,
               }} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          <Button variant="outlined" startIcon={<CalculateIcon />} onClick={handleClickStart} disabled={!ready}>
            Start
          </Button>
        </CardActions>
      </Card>
    </>
  )
}
