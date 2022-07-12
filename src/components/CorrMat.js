import React, { useRef, useState, useEffect } from 'react'
import Chart from "chart.js/auto";
import _ from 'lodash'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

Chart.register(MatrixController, MatrixElement);


export default React.memo(function CorrMat(props) {
  const theme = props.theme

  const corrData = props.corrData

  const [chart, setChart] = useState()

  const canvasRef = useRef()

  const _data = {
    datasets: [{
      label: 'test corr. matrix',
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
      height: ({chart}) =>(chart.chartArea || {}).height / _.uniq(_.map(corrData, 'x')).length - 1
    }]
  }

  const _options = {
    // maintainAspectRatio: false,
    // transitions: {
    //   'resize': {
    //     animation: {
    //       duration: 400
    //     }
    //   }
    // },
    scales: {
      x: {
        type: 'category',
        labels: _.uniq(_.map(corrData, 'x')),
        ticks: {
          display: true
        },
        grid: {
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
      // datalabels: {
      //   display: false,
      // },
      // tooltip: {
      //   enabled: false,
      // },
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
  prevProps.theme.palette.mode === nextProps.theme.palette.mode
))