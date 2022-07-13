import React, { useRef, useEffect, useState } from 'react'
import Chart from "chart.js/auto";
import zoomPlugin from 'chartjs-plugin-zoom';
import _ from 'lodash'
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ControlButton from './ControlButton';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

Chart.register(zoomPlugin);


export default React.memo(function ScatterChart(props) {
  const dataPoint = props.dataPoint
  const hash_params = props.hash_params

  const [coords, setCoords] = useState()
  const [loading, setLoading] = useState(false)

  const canvasRef = useRef()

  const theme = props.theme

  const [chart, setChart] = useState()

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
          text: dataPoint.x
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
          text: dataPoint.y
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
    setLoading(true)
    const url = 'http://127.0.0.1:8000/get_scoped_data';
    const data = {
      hash_params: hash_params, 
      x_cell_type: dataPoint.x.split(': ')[0].toLowerCase(),
      x_cell_address: dataPoint.x.split(': ')[1],
      y_cell_type: dataPoint.y.split(': ')[0].toLowerCase(),
      y_cell_address: dataPoint.y.split(': ')[1],
    }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url, data, config).then((response) => {
      setCoords(response.data)
      setLoading(false)
    });
  }, [dataPoint])

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
      a.download = 'CellStorm_' + dataPoint.x + ';' + dataPoint.y + '.png';
      a.click()
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end">
          <ControlButton connStatus={1} handleClick={handleClickZoomReset} iconComponent={
            <ZoomOutMapIcon fontSize='small' sx={{ color: "text.secondary" }} />
          } />
          <ControlButton connStatus={1} handleClick={handleClickSave} iconComponent={
            <SaveIcon fontSize='small' sx={{ color: "text.secondary" }} />
          } />
        </Stack>
        <canvas ref={canvasRef}></canvas>
      </Grid>
    </Grid>
  );
}, (prevProps, nextProps) => (
  JSON.stringify(prevProps.dataPoint) === JSON.stringify(nextProps.dataPoint)
  && prevProps.theme.palette.mode === nextProps.theme.palette.mode
))
