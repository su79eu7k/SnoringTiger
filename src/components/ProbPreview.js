import React, { useRef, useState, useEffect } from 'react'
import Chart from "chart.js/auto";
import _ from 'lodash'


export default React.memo(function PropPreview(props) {
  const cellTypeAuto = props.cellTypeAuto
  const x = _.values(props.x)
  const prob = _.values(props.prob)
  const coords = props.coords
  const decimal = props.decimal

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
      }
    }
  }

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")
    const config = {
      type: cellTypeAuto ? 'line' : 'bar',
      data: _data,
      options: _options,
    }
    setChart(new Chart(ctx, config))
  
    return () => {
      if (chart !== undefined) {
        chart.destroy()
        console.log('Destroyed!')
      }
    }
  }, [])
  
  useEffect(() => {
    if (chart !== undefined) {
      chart.data = _data
      chart.update()
      setChart(chart)
    }
  }, [x, decimal, prob, coords, cellTypeAuto, theme])

  useEffect(() => {
    if (chart !== undefined) {
      chart.options = _options
      chart.update()
      setChart(chart)
    }
  }, [theme])

  return (
    <canvas ref={canvasRef}></canvas>
  );
}, (prevProps, nextProps) => (
  JSON.stringify(prevProps.cellTypeAuto) === JSON.stringify(nextProps.cellTypeAuto)
  && JSON.stringify(prevProps.coords) === JSON.stringify(nextProps.coords)
  && JSON.stringify(prevProps.decimal) === JSON.stringify(nextProps.decimal)
  && prevProps.theme.palette.mode === nextProps.theme.palette.mode
))