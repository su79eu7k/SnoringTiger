import React, { useRef, useEffect } from 'react'
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

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")
    const probChart = new Chart(ctx, {
      type: cellTypeAuto ? 'line' : 'bar',
      data: {
        labels: x.map(v => v.toFixed(decimal)),
        datasets: [{
          data: cellTypeAuto ? coords : prob,
          borderColor: theme.palette.text.secondary,
          backgroundColor: theme.palette.text.secondary,
          borderWidth: cellTypeAuto ? 1 : 0,
          pointRadius: 2,
          pointHoverRadius: 4,
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
    })
    console.log(probChart)

    return () => {
      probChart.destroy()
    }
  }, [x, prob, coords, cellTypeAuto, theme, decimal])

  return (
    <canvas ref={canvasRef}></canvas>
  );
}, (prevProps, nextProps) => (
  JSON.stringify(prevProps.coords) === JSON.stringify(nextProps.coords)
  && JSON.stringify(prevProps.decimal) === JSON.stringify(nextProps.decimal)
  && prevProps.theme.palette.mode === nextProps.theme.palette.mode
))