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
import { API_SERVER } from '../helpers/url';

export default function ResultPreview(props) {
  const theme = useTheme()
  const id = props.id
  const connStatus = props.connStatus
  const setPreviewCount = props.setPreviewCount
  const asndRandCells = props.asndRandCells
  const asndMonitCells = props.asndMonitCells
  const resultPreviews = props.resultPreviews
  const resultPreview = resultPreviews[id]
  const setResultPreviews = props.setResultPreviews

  const [added, setAdded] = useState(resultPreview ? resultPreview.added : false)
  const [toggledCells, setToggledCells] = useState(resultPreview ? resultPreview.toggledCells : [])
  const [coords, setCoords] = useState(resultPreview ? resultPreview.coords : [])
  const [previewAvailable, setPreviewAvailable] = useState(resultPreview ? resultPreview.previewAvailable : false)

  useEffect(() => {
    _.values(toggledCells).filter(b => b === true).length === 2 ? setPreviewAvailable(true) : setPreviewAvailable(false)
  }, [setPreviewAvailable, toggledCells])

  useEffect(() => {
    setResultPreviews(prevState => ({
      ...prevState, [id]: {
        ...prevState[id],
        added: added, 
        toggledCells: toggledCells,
        coords: coords,
        previewAvailable: previewAvailable,
      }
    }))
  }, [setResultPreviews, id, added, toggledCells, coords, previewAvailable])

  const handleClickPreview = (e) => {
    e.preventDefault()

    const [_x, _y] = _.keys(_.pickBy(toggledCells))

    const url = API_SERVER + '/run_sim_preview';
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

  const handleClickAdd = (e) => {
    e.preventDefault()

    setAdded(true)
    setPreviewCount(v => v + 1)
  }

  return (
    <Card sx={{ minWidth: 445 }}>
      {added ?
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Result Preview
              </Typography>
            </Grid>
            <Grid item xs={12} container spacing={2} justifyContent="center">
              {asndRandCells.map((e, i) => (
                <Grid item key={"Rand-" + i}>
                  <ElemSelection connStatus={connStatus} addressSheet={e.addressSheet} addressCell={e.addressCell} type={'rand'} setToggledCells={setToggledCells} />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Divider variant="middle" />
              </Grid>
              {asndMonitCells.map((e, i) => (
                <Grid item key={"Monit-" + i}>
                  <ElemSelection connStatus={connStatus} addressSheet={e.addressSheet} addressCell={e.addressCell} type={'monit'} setToggledCells={setToggledCells} />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <ResultPreviewChart connStatus={connStatus} coords={coords} setCoords={setCoords} theme={theme} toggledCells={toggledCells} />
            </Grid>
          </Grid>
        </CardContent> : null}
      <CardActions>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
              {added ?
                <Button variant="outlined" startIcon={<CableIcon />} onClick={handleClickPreview} disabled={connStatus !== 1 || !previewAvailable}>
                  Preview
                </Button> :
                <Button data-testid="BtnAddPreview" variant="outlined" startIcon={<CableIcon />} onClick={handleClickAdd} disabled={connStatus !== 1}>
                  Add Preview
                </Button>}
            </Stack>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
