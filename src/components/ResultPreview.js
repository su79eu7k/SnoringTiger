import { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CableIcon from '@mui/icons-material/Cable';
import axios from 'axios';
import _ from 'lodash'
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ElemSelection from './ElemSelection';
import ResultPreviewChart from './ResultPreviewChart';
import { useTheme } from '@mui/styles'


export default function ResultPreview(props) {
  const connStatus = props.connStatus
  const randomCells = props.randomCells
  const monitoringCells = props.monitoringCells

  const [asndRandCells, setAsndRandCells] = useState([])
  const [asndMonitCells, setAsndMonitCells] = useState([])

  const [toggledCells, setToggledCells] = useState([])

  const [previewAvailable, setPreviewAvailable] = useState(false)

  const [coords, setCoords] = useState([])

  const theme = useTheme()

  useEffect(() => {
    setAsndRandCells(_.filter(_.values(randomCells), ['assigned', true]))
    setAsndMonitCells(_.filter(_.values(monitoringCells), ['assigned', true]))
  }, [setAsndRandCells, setAsndMonitCells, randomCells, monitoringCells])

  useEffect(() => {
    _.values(toggledCells).filter(b => b === true).length === 2 ? setPreviewAvailable(true) : setPreviewAvailable(false)
  }, [setPreviewAvailable, toggledCells])

  const handleClickPreview = (e) => {
    e.preventDefault()
    const [_x, _y] = _.keys(_.pickBy(toggledCells))

    const url = 'http://127.0.0.1:8000/preview_data';
    const data = { x: _x, y: _y }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url, data, config).then((response) => {
      setCoords(response.data.xy)
    });
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Result Preview
            </Typography>
          </Grid>
          <Grid item xs={12} container spacing={2} justifyContent="center">
            {asndRandCells.map((e, i) => (
              <Grid item>
                <ElemSelection key={"R-" + i} connStatus={connStatus} addressSheet={e.addressSheet} addressCell={e.addressCell} type={'rand'} setToggledCells={setToggledCells} />
              </Grid>
            ))}
            {asndMonitCells.map((e, i) => (
              <Grid item>
                <ElemSelection key={"M-" + i} connStatus={connStatus} addressSheet={e.addressSheet} addressCell={e.addressCell} type={'monit'} setToggledCells={setToggledCells} />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Divider variant="middle" />
          </Grid>
          <Grid item xs={12}>
            <ResultPreviewChart coords={coords} theme={theme} decimal={null} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <Button variant="outlined" startIcon={<CableIcon />} onClick={handleClickPreview} disabled={connStatus !== 1 || !previewAvailable}>
                Preview
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
