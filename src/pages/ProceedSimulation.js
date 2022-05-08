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
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop';
import axios from 'axios';
import _ from 'lodash';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ResultPreview from '../components/ResultPreview';


export default function ProceedSimulation(props) {
  const connStatus = props.connStatus
  const randomCells = props.randomCells
  const monitoringCells = props.monitoringCells
  const simConfig = props.simConfig
  const setSimConfig = props.setSimConfig

  const [valueTrials, setValueTrials] = useState(!_.isEmpty(simConfig) ? simConfig.valueTrials : 1000)
  const [valueNumTrials, setValueNumTrials] = useState(!_.isEmpty(simConfig) ? simConfig.valueNumTrials : true)
  const [trialsAboveZero, setTrialsAboveZero] = useState(!_.isEmpty(simConfig) ? simConfig.trialsAboveZero : true)

  const [dataReady, setDataReady] = useState(!_.isEmpty(simConfig) ? simConfig.dataReady : false)

  const [progress, setProgress] = useState(!_.isEmpty(simConfig) ? simConfig.progress : null)
  const [progressDelay, setProgressDelay] = useState(!_.isEmpty(simConfig) ? simConfig.progressDelay : null)

  const [paused, setPaused] = useState(!_.isEmpty(simConfig) ? simConfig.paused : false)

  const handleChangeTrials = (e) => {
    e.preventDefault()
    
    setValueTrials(e.target.value)
    setValueNumTrials(!isNaN(e.target.value))
  };

  const handleClickStart = (e) => {
    e.preventDefault()

    setProgress(0)
    if (dataReady) {
      const url = 'http://127.0.0.1:8000/proc_sim';
      const data = { num_trials: valueTrials }
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

  const handleClickCancel = (e) => {
    e.preventDefault()

    setPaused(false)
    axios.get("http://127.0.0.1:8000/cancel_sim").then((response) => {
      setProgress(null)
    });
  }

  const handleClickPause = (e) => {
    e.preventDefault()

    setPaused(true)
    axios.get("http://127.0.0.1:8000/pause_sim").then((response) => { })
  }

  const handleClickResume = (e) => {
    e.preventDefault()

    setPaused(false)
    axios.get("http://127.0.0.1:8000/resume_sim").then((response) => { })
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
  }, progressDelay)

  useEffect(() => {
    progress >= 0 && progress < 100 ? setProgressDelay(500) : setProgressDelay(null)
  }, [progress])

  useEffect(() => {
    connStatus === 1 &&
      _.filter(randomCells, { assigned: true }).length >= 1 &&
      _.filter(monitoringCells, { assigned: true }).length >= 1 ?
      setDataReady(true) : setDataReady(false)
  }, [connStatus, randomCells, monitoringCells])

  useEffect(() => {
    setSimConfig(prevState => ({
      ...prevState, valueTrials: valueTrials, valueNumTrials: valueNumTrials, trialsAboveZero: trialsAboveZero,
      dataReady: dataReady, progress: progress, progressDelay: progressDelay, paused: paused
    }))
  }, [valueTrials, valueNumTrials, trialsAboveZero, dataReady, progress, progressDelay, paused, setSimConfig])


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">
            Proceed Simulation
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Configuration
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={!valueNumTrials || !trialsAboveZero}
                    helperText={!valueNumTrials ? "Trials value is not a number." : !trialsAboveZero ? "Trials value is not above zero." : ""}
                    size="small"
                    id="outlined-helperText"
                    label="Trials"
                    value={valueTrials}
                    onChange={handleChangeTrials}
                    disabled={!dataReady}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Progress
                  </Typography>
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                    <Button variant="outlined" startIcon={<CalculateIcon />} onClick={handleClickStart} disabled={!(valueTrials && valueNumTrials && trialsAboveZero) || !dataReady || (progress > 0 && progress < 100)}>
                      Start
                    </Button>
                    {paused ?
                      <Button variant="outlined" startIcon={<PlayArrowIcon />} onClick={handleClickResume} disabled={!progress || progress === 100}>
                        Resume
                      </Button> :
                      <Button variant="outlined" startIcon={<PauseIcon />} onClick={handleClickPause} disabled={!progress || progress === 100}>
                        Pause
                      </Button>
                    }
                    <Button variant="outlined" startIcon={<StopIcon />} onClick={handleClickCancel} disabled={!progress || progress === 100}>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <ResultPreview connStatus={connStatus} randomCells={randomCells} monitoringCells={monitoringCells} />
        </Grid>
      </Grid>
    </>
  )
}
