import React, { useRef, useState, useEffect } from 'react'
import Chart from "chart.js/auto";
import zoomPlugin from 'chartjs-plugin-zoom';
import _ from 'lodash'
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ControlButton from './ControlButton';
import SaveIcon from '@mui/icons-material/Save';

Chart.register(zoomPlugin);


export default React.memo(function ProbPreview(props) {
  const connStatus = props.connStatus
  const addressSheet = props.addressSheet
  const addressCell = props.addressCell
  const cellTypeAuto = props.cellTypeAuto
  const x = _.values(props.x)
  const prob = _.values(props.prob)
  const coords = props.coords
  const decimal = props.decimal
  const setDecimal = props.setDecimal

  const canvasRef = useRef()

  const theme = props.theme

  const [chart, setChart] = useState()

  const _data = {
    labels: x.map(v => v.toFixed(decimal)),
    datasets: [{
      data: cellTypeAuto ? coords : prob,
      borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .2)' : 'rgba(229, 229, 229, .2)',
      backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .2)' : 'rgba(229, 229, 229, .2)',
      borderWidth: cellTypeAuto ? 1 : 0,
      pointRadius: 2,
      pointHoverRadius: 4,
    }]
  }

  const _options = {
    transitions: {
      'resize': {
        animation: {
          duration: 400
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.text.secondary,
          borderWidth: 1,
          borderColor: theme.palette.text.secondary,
          display: false,
          lineWidth: 0.3,
        },
      },
      y: {
        grid: {
          color: theme.palette.text.secondary,
          borderColor: theme.palette.text.secondary,
          borderWidth: 1,
          display: true,
          lineWidth: 0.3,
        },
      }
    },
    plugins: {
      legend: {
        display: false
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
          modifierKey: 'ctrl',
        },
        zoom: {
          mode: 'xy',
          drag: {
            enabled: true,
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            backgroundColor: 'rgba(54, 162, 235, 0.3)'
          }
        }
      },
    }
  }

  useEffect(() => {
    if (chart !== undefined) {
      chart.destroy()
    }

    const ctx = canvasRef.current.getContext("2d")
    const config = {
      type: cellTypeAuto ? 'bar' : 'bar',
      data: _data,
      options: _options,
    }
    setChart(new Chart(ctx, config))
  }, [cellTypeAuto])

  useEffect(() => {
    if (chart !== undefined) {
      if (chart.ctx) {
        chart.data = _data
        chart.update()
        setChart(chart)
      }
    }
  }, [_data])

  useEffect(() => {
    if (chart !== undefined) {
      if (chart.ctx) {
        chart.options = _options
        chart.update()
        setChart(chart)
      }
    }
  }, [_options])

  const handleClickSave = (e) => {
    e.preventDefault()

    if (chart !== undefined) {
      const a = document.createElement('a');
      a.href = chart.toBase64Image();
      a.download = "CellStorm_rand'" + addressSheet + '!' + addressCell + '.png';
      a.click()
    }
  }

  const handleClickZoomReset = (e) => {
    e.preventDefault()
    chart.resetZoom()
  }

  const handleClickDecimalLeft = (e) => {
    e.preventDefault()
    setDecimal(prevState => Math.max(prevState - 1, 0))
  }

  const handleClickDecimalRight = (e) => {
    e.preventDefault()
    setDecimal(prevState => prevState + 1)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end">
          <ControlButton connStatus={connStatus} handleClick={handleClickZoomReset} iconComponent={
            <ZoomOutMapIcon fontSize='small' sx={{ color: "text.secondary" }} />
          } />
          <ControlButton connStatus={connStatus} handleClick={handleClickDecimalLeft} iconComponent={
            <ArrowLeftIcon fontSize='small' sx={{ color: "text.secondary" }} />
          } />
          <ControlButton connStatus={connStatus} handleClick={handleClickDecimalRight} iconComponent={
            <ArrowRightIcon fontSize='small' sx={{ color: "text.secondary" }} />
          } />
          <ControlButton connStatus={connStatus} handleClick={handleClickSave} iconComponent={
            <SaveIcon fontSize='small' sx={{ color: "text.secondary" }} />
          } />
        </Stack>
        <canvas ref={canvasRef}></canvas>
      </Grid>
    </Grid>
  );
}, (prevProps, nextProps) => (
  JSON.stringify(prevProps.cellTypeAuto) === JSON.stringify(nextProps.cellTypeAuto)
  && JSON.stringify(prevProps.coords) === JSON.stringify(nextProps.coords)
  && JSON.stringify(prevProps.decimal) === JSON.stringify(nextProps.decimal)
  && prevProps.theme.palette.mode === nextProps.theme.palette.mode
))