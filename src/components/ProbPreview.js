import { useRef, useEffect } from 'react'
import Chart from "chart.js/auto";
import _ from 'lodash'

let probChart
export default function PropPreview(props) {
  const id = props.id
  const x = _.values(props.x)
  const prob = _.values(props.prob)
  const coords = props.coords
  const cellTypeAuto = props.cellTypeAuto
  const canvasRef = useRef(document.getElementById('canv_' + id))
  
  useEffect(() => {
    if (typeof probChart !== "undefined") probChart.destroy();

    const ctx = canvasRef.current.getContext("2d")
    probChart = new Chart(ctx, {
      type: cellTypeAuto ? 'line' : 'bar',
      data: {
        labels: x.map(v => v.toFixed(4)),
        datasets: [{
          data: cellTypeAuto ? coords : prob
        }]
      }
    })
  }, [x, prob, coords, cellTypeAuto])

  return (
    <canvas id={'canv_' + id} ref={canvasRef}></canvas>
  );
}
