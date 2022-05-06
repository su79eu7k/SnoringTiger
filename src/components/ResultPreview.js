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
  const [asndMonitCells, setAsndMonitCells] = useState([{addressSheet: 'thisIsMonitSheet', addressCell: 'D29'}, {addressSheet: 'notRandSheet', addressCell: 'K11'}])

  // useEffect(() => {
  //   setAsndRandCells(_.filter(_.values(randomCells), ['assigned', true]))
  //   setAsndMonitCells(_.filter(_.values(monitoringCells), ['assigned', true]))
  // }, [setAsndRandCells, setAsndMonitCells, randomCells, monitoringCells])


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
              <ElemSelection key={"R-" + i} addressSheet={e.addressSheet} addressCell={e.addressCell} type={'rand'} />
            </Grid>
            ))}
            {asndMonitCells.map((e, i) => (
            <Grid item>
              <ElemSelection key={"M-" + i} addressSheet={e.addressSheet} addressCell={e.addressCell} type={'monit'} />
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
              <Button variant="outlined" startIcon={<CableIcon />} onClick={null} disabled={connStatus !== 1}>
                Preview
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
