import React, { useRef, useEffect } from 'react'
import { useTheme } from '@mui/styles';
import Chart from "chart.js/auto";
import _ from 'lodash'

export default React.memo(function PropPreview(props) {
  const x = _.values(props.x)
  const prob = _.values(props.prob)
  const coords = props.coords
  const cellTypeAuto = props.cellTypeAuto
  const canvasRef = useRef()
  const theme = useTheme();
 
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d")
    const probChart = new Chart(ctx, {
      type: cellTypeAuto ? 'line' : 'bar',
      data: {
        labels: x.map(v => v.toFixed(4)),
        datasets: [{
          data: cellTypeAuto ? coords : prob,
          borderColor: theme.palette.text.primary,
          backgroundColor: theme.palette.text.primary,
          borderWidth: cellTypeAuto ? 1 : 0,
          pointRadius: 2,
          pointHoverRadius: 4,
        }]
      },
      options: {
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

    return () => {
      probChart.destroy()
    }
  }, [x, prob, coords, cellTypeAuto])

  return (
    <canvas ref={canvasRef}></canvas>
  );
})