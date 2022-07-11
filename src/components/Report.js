import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DateTime } from "luxon";
import axios from 'axios';
import ProbChartMini from './ProbChartMini';
import _ from 'lodash'
import { useTheme } from '@mui/styles'


function Report(props) {
  const openReportModal = props.openReportModal
  const setOpenReportModal = props.setOpenReportModal
  const filename = props.filename
  const hash_params = props.hash_params

  const [paramsDetail, setParamsDetail] = useState()
  const [scopedData, setScopedData] = useState()
  const [loading, setLoading] = useState({
    params_detail: false,
    scoped_data: false,
  })
  const [lastUpdated, setLastUpdated] = useState(DateTime.now().toUnixInteger())

  const [randCells, setRandCells] = useState()
  const [monitCells, setMonitCells] = useState()

  const theme = useTheme()

  useEffect(() => {
    setLoading(prevState => ({ ...prevState, 'params_detail': true }))
    axios.get("http://127.0.0.1:8000/get_params_detail?hash_params=" + hash_params).then((response) => {
      setParamsDetail(response.data)
      setLoading(prevState => ({ ...prevState, 'params_detail': false }))
    }).catch(() => { })

    // setLoading(prevState => ({...prevState, 'scoped_data': true}))
    // axios.get("http://127.0.0.1:8000/get_scoped_data").then((response) => {
    //   setScopedData(response.data)
    //   setLoading(prevState => ({...prevState, 'scoped_data': false}))
    // }).catch(() => {})
  }, [lastUpdated])

  useEffect(() => {
    // console.log(paramsDetail)
    // console.log(_.map(_.filter(paramsDetail, {param_type: 'r', cell_address: 'Sheet1!A1'}), 'param_value'))
    // console.log(_.uniq(_.map(paramsDetail, (e) => e.param_type + ': ' + e.cell_address)))
    // console.log(_.uniq(_.map(_.filter(paramsDetail, { param_type: 'r' }), 'cell_address')))
    setRandCells(_.uniq(_.map(_.filter(paramsDetail, { param_type: 'r' }), 'cell_address')))
    setMonitCells(_.uniq(_.map(_.filter(paramsDetail, { param_type: 'm' }), 'cell_address')))
  }, [paramsDetail])


  return (
    <Modal
      open={openReportModal}
      onClose={() => { setOpenReportModal(false) }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        minWidth: "600px",
        maxWidth: "1200px",
        padding: "10px",
        textAlign: "justify",
      }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
            File
          </Typography>
          <Typography variant="subtitle2" sx={{ padding: '3px 4px' }}>{filename}</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
            Parameters({hash_params})
          </Typography>
          <Typography variant="subtitle2" sx={{ padding: '3px 4px' }}>Random Cells</Typography>
          {randCells ? randCells.map((cellAddress, i) => (
            <ProbChartMini
              key={i.toString()}
              x={_.map(_.filter(paramsDetail, { param_type: 'r', cell_address: cellAddress }), 'param_value')}
              prob={_.map(_.filter(paramsDetail, { param_type: 'p', cell_address: cellAddress }), 'param_value')}
              theme={theme}
            />
          ))
          : null}
          <Typography variant="subtitle2" sx={{ padding: '3px 4px' }}>Monitoring Cells</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
            Samples
          </Typography>
          <Typography variant="subtitle2" sx={{ padding: '3px 4px' }}>{filename}</Typography>
        </CardContent>
      </Card>
    </Modal>
  )
}

export default Report