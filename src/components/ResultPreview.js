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


export default function ResultPreview(props) {
  const connStatus = props.connStatus
  const randomCells = props.randomCells
  const monitoringCells = props.monitoringCells

  const [asndRandCells, setAsndRandCells] = useState([{addressSheet: 'sheet1', addressCell: 'A5'}, {addressSheet: 'sheet2', addressCell: 'K11'}])
  const [asndMonitCells, setAsndMonitCells] = useState([{addressSheet: 'thisIsMonitSheetandLong', addressCell: 'D29'}, {addressSheet: 'notRandSheet', addressCell: 'K11'}])

  const [toggledCells, setToggledCells] = useState([])

  const [previewAvailable, setPreviewAvailable] = useState(false)
  
  // useEffect(() => {
  //   setAsndRandCells(_.filter(_.values(randomCells), ['assigned', true]))
  //   setAsndMonitCells(_.filter(_.values(monitoringCells), ['assigned', true]))
  // }, [setAsndRandCells, setAsndMonitCells, randomCells, monitoringCells])

  useEffect(() => {
    _.values(toggledCells).filter(b => b === true).length === 2 ? setPreviewAvailable(true) : setPreviewAvailable(false) 
  }, [setPreviewAvailable, toggledCells])


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
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              <Button variant="outlined" startIcon={<CableIcon />} onClick={null} disabled={connStatus !== 1 || !previewAvailable}>
                Preview
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
