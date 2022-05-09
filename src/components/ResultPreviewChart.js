import React, { useRef, useEffect, useState } from 'react'
import Chart from "chart.js/auto";
import _ from 'lodash'


export default React.memo(function ResultPreviewChart(props) {
  const coords = props.coords
  const setCoords = props.setCoords
  const decimal = props.decimal
  const toggledCells = props.toggledCells
  const [xlab, setXlab] = useState('init')
  const [ylab, setYlab] = useState('init')

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
      }
    }
  }

  useEffect(() => {
    setCoords([])
    setXlab(_.keys(_.pickBy(toggledCells, _.identity))[0])
    setYlab(_.keys(_.pickBy(toggledCells, _.identity))[1])
  }, [setCoords, setXlab, setYlab, toggledCells])

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")
    const config = {
      type: 'scatter',
      data: _data,
      options: _options,
    }
    setChart(new Chart(ctx, config))
  
    return () => {
      if (chart !== undefined) {
        chart.destroy()
      }
    }
  }, [])
  
  useEffect(() => {
    if (chart !== undefined) {
      chart.data = _data
      chart.update()
      setChart(chart)
    }
  }, [coords, theme])

  useEffect(() => {
    if (chart !== undefined) {
      chart.options = _options
      chart.update()
      setChart(chart)
    }
  }, [xlab, ylab, theme])

  return (
    <canvas ref={canvasRef}></canvas>
  );
}, (prevProps, nextProps) => (
  JSON.stringify(prevProps.coords) === JSON.stringify(nextProps.coords)
  && JSON.stringify(prevProps.decimal) === JSON.stringify(nextProps.decimal)
  && JSON.stringify(prevProps.toggledCells) ===  JSON.stringify(nextProps.toggledCells)
  && prevProps.theme.palette.mode === nextProps.theme.palette.mode
))
