import React, { useRef, useEffect, useState } from 'react'
import Chart from "chart.js/auto";
import zoomPlugin from 'chartjs-plugin-zoom';
import _ from 'lodash'
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ControlButton from './ControlButton';
import SaveIcon from '@mui/icons-material/Save';

Chart.register(zoomPlugin);


export default React.memo(function ResultPreviewChart(props) {
  const theme = props.theme
  const connStatus = props.connStatus
  const toggledCells = props.toggledCells
  const coords = props.coords

  const [chart, setChart] = useState()
  const [xlab, setXlab] = useState('init')
  const [ylab, setYlab] = useState('init')

  const canvasRef = useRef()

  const _data = {
    datasets: [{
      labels: 'Scatter Dataset',
      data: coords,
      backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .2)' : 'rgba(229, 229, 229, .2)',
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
        title: {
          display: true,
          text: xlab ? xlab : "N/A",
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
        title: {
          display: true,
          text: ylab ? ylab : "N/A",
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
    setXlab(_.keys(_.pickBy(toggledCells, _.identity))[0])
    setYlab(_.keys(_.pickBy(toggledCells, _.identity))[1])
  }, [setXlab, setYlab, toggledCells])

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")
    const config = {
      type: 'scatter',
      data: _data,
      options: _options,
    }
    setChart(new Chart(ctx, config))
  }, [])

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

  const handleClickZoomReset = (e) => {
    e.preventDefault()
    chart.resetZoom()
  }

  const handleClickSave = (e) => {
    e.preventDefault()

    if (chart !== undefined) {
      const a = document.createElement('a');
      a.href = chart.toBase64Image();
      a.download = 'CellStorm_' + xlab + ';' + ylab + '.png';
      a.click()
    }
  }


  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end">
          <ControlButton connStatus={connStatus} handleClick={handleClickZoomReset} iconComponent={
            <ZoomOutMapIcon fontSize='small' sx={{ color: "text.secondary" }} />
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
  JSON.stringify(prevProps.coords) === JSON.stringify(nextProps.coords)
  && JSON.stringify(prevProps.toggledCells) === JSON.stringify(nextProps.toggledCells)
  && prevProps.theme.palette.mode === nextProps.theme.palette.mode
))
