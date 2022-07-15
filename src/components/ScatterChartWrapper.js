import React, { useState } from 'react'
import Chart from "chart.js/auto";
import zoomPlugin from 'chartjs-plugin-zoom';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ControlButton from './ControlButton';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ScatterChart from './ScatterChart';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

Chart.register(zoomPlugin);


export default function ScatterChartWrapper(props) {
  const scatterSelected = props.scatterSelected
  const plotKey = props.plotKey
  const setLastRemoveReq = props.setLastRemoveReq
  const labels = props.labels
  const coords = props.coords
  const theme = props.theme
  const [chart, setChart] = useState()

  const handleClickZoomReset = (e) => {
    e.preventDefault()
    chart.resetZoom()
  }

  const handleClickSave = (e) => {
    e.preventDefault()

    if (chart !== undefined) {
      const a = document.createElement('a');
      a.href = chart.toBase64Image();
      a.download = 'CellStorm_' + labels.x + ';' + labels.y + '.png';
      a.click()
    }
  }

  const handleClickRemove = () => {
    setLastRemoveReq(plotKey)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" justifyContent="flex-start">
            {scatterSelected === plotKey ?
              <ControlButton connStatus={0} iconComponent={
                <CenterFocusStrongIcon fontSize="small" sx={{ color: "text.secondary" }} />
              } />
              : null
            }
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <ControlButton connStatus={1} handleClick={handleClickZoomReset} iconComponent={
              <ZoomOutMapIcon fontSize='small' sx={{ color: "text.secondary" }} />
            } />
            <ControlButton connStatus={1} handleClick={handleClickSave} iconComponent={
              <SaveIcon fontSize='small' sx={{ color: "text.secondary" }} />
            } />
            <ControlButton connStatus={1} handleClick={handleClickRemove} iconComponent={
              <HighlightOffIcon fontSize="small" sx={{ color: "text.secondary" }} />
            } />
          </Stack>
        </Stack>
        <ScatterChart chart={chart} setChart={setChart} plotKey={plotKey} setLastRemoveReq={setLastRemoveReq} labels={labels} coords={coords} theme={theme} />
      </Grid>
    </Grid>
  );
}

