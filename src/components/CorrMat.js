import React, { useRef, useState, useEffect } from 'react'
import Chart from "chart.js/auto";
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import _ from 'lodash'

if (process.env.NODE_ENV !== 'test') {
  Chart.register(MatrixController, MatrixElement);
}


export default React.memo(function CorrMat(props) {
  const scatterSelected = props.scatterSelected
  const setScatters = props.setScatters
  const corrData = props.corrData

  const theme = props.theme

  const canvasRef = useRef()
  const [chart, setChart] = useState()

  const _data = {
    datasets: [{
      label: 'Correlation Matrix',
      data: corrData,
      backgroundColor(context) {
        const value = context.dataset.data[context.dataIndex].v;
        const alpha = value * .2
        return theme.palette.mode === 'light' ? 'rgba(0, 0, 0, ' + alpha + ')' : 'rgba(229, 229, 229, ' + alpha + ')';
      },
      // borderColor(context) {
      //   const value = context.dataset.data[context.dataIndex].v;
      //   const alpha = value * .5
      //   return theme.palette.mode === 'light' ? 'rgba(0, 0, 0, ' + alpha + ')' : 'rgba(229, 229, 229, ' + alpha + ')';
      // },
      // borderWidth: 1,
     
      width: ({chart}) => (chart.chartArea || {}).width / _.uniq(_.map(corrData, 'x')).length - 1,
      height: ({chart}) => (chart.chartArea || {}).height / _.uniq(_.map(corrData, 'x')).length - 1
    }]
  }

  const _options = {
    onClick: (e) => {
      setScatters(prevState => ({...prevState, [scatterSelected]: e.chart.tooltip.dataPoints[0].raw}))
    },
    animation: false,
    scales: {
      x: {
        type: 'category',
        labels: _.uniq(_.map(corrData, 'x')),
        ticks: {
          display: true
        },
        grid: {
          drawBorder: false,
          display: false
        }
      },
      y: {
        type: 'category',
        labels: _.uniq(_.map(corrData, 'x')),
        offset: true,
        ticks: {
          display: true
        },
        grid: {
          drawBorder: false,
          display: false
        }
      }
    },
    plugins: {
      legend: false,
      tooltip: {
        callbacks: {
          title() {
            return '';
          },
          label(context) {
            const v = context.dataset.data[context.dataIndex];
            return ['Correlation:' + v.v];
          }
        }
      }
    },
  }

  useEffect(() => {
    if (chart !== undefined) {
      chart.destroy()
    }

    const ctx = canvasRef.current.getContext("2d")
    const config = {
      type: 'matrix',
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
  JSON.stringify(prevProps.corrData) === JSON.stringify(nextProps.corrData)
  && prevProps.theme.palette.mode === nextProps.theme.palette.mode
))