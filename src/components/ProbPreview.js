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
          borderColor: theme.palette.text.secondary,
          backgroundColor: theme.palette.text.secondary,
        }]
      },
      options: {
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