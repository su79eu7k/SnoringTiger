import React, { useRef, useEffect, useState } from 'react'
import Chart from "chart.js/auto";
import _ from 'lodash'


export default React.memo(function ResultPreviewChart(props) {
  const coords = props.coords
  const setCoords = props.setCoords
  const decimal = props.decimal
  const toggledCells = props.toggledCells
  const [xlab, setXlab] = useState('')
  const [ylab, setYlab] = useState('')

  const canvasRef = useRef()

  const theme = props.theme

  useEffect(() => {
    setCoords([])
    setXlab(_.keys(_.pickBy(toggledCells, _.identity))[0])
    setYlab(_.keys(_.pickBy(toggledCells, _.identity))[1])
  }, [setCoords, setXlab, setYlab, toggledCells])

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")
    const previewChart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          labels: 'Scatter Dataset',
          data: coords,
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .2)' : 'rgba(229, 229, 229, .2)',
        }]
      },
      options: {
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
    })

    return () => {
      previewChart.destroy()
    }
  }, [coords, theme, decimal, xlab, ylab])

  return (
    <canvas ref={canvasRef}></canvas>
  );
}, (prevProps, nextProps) => (
  JSON.stringify(prevProps.coords) === JSON.stringify(nextProps.coords)
  && JSON.stringify(prevProps.decimal) === JSON.stringify(nextProps.decimal)
  && JSON.stringify(prevProps.toggledCells) ===  JSON.stringify(nextProps.toggledCells)
  && prevProps.theme.palette.mode === nextProps.theme.palette.mode
))