import React, { useRef, useState, useEffect } from 'react'
import Chart from "chart.js/auto";
import _ from 'lodash'


export default React.memo(function ProbChartMini(props) {
  const theme = props.theme
  
  const x = _.values(props.x)
  const prob = _.values(props.prob)

  const [chart, setChart] = useState()
  
  const canvasRef = useRef()

  const _data = {
    labels: x,
    datasets: [{
      data: prob,
      borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .2)' : 'rgba(229, 229, 229, .2)',
      backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .2)' : 'rgba(229, 229, 229, .2)',
      borderWidth: 0,
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
    }
  }

  useEffect(() => {
    if (chart !== undefined) {
      chart.destroy()
    }

    const ctx = canvasRef.current.getContext("2d")
    const config = {
      type: 'bar',
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

  return (
    <canvas ref={canvasRef}></canvas>
  );
}, (prevProps, nextProps) => (
  prevProps.theme.palette.mode === nextProps.theme.palette.mode
))