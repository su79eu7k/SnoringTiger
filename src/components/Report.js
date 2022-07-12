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
import { Box, Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CorrMat from './CorrMat';


function Report(props) {
  const openReportModal = props.openReportModal
  const setOpenReportModal = props.setOpenReportModal
  const filename = props.filename
  const hash_params = props.hash_params

  const [paramsDetail, setParamsDetail] = useState()
  const [scopedData, setScopedData] = useState()
  const [corrData, setCorrData] = useState()
  const [loading, setLoading] = useState({
    params_detail: false,
    scoped_data: false,
    corr_data: false,
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

    setLoading(prevState => ({ ...prevState, 'corr_data': true }))
    axios.get("http://127.0.0.1:8000/get_corr?hash_params=" + hash_params).then((response) => {
      setCorrData(response.data)
      setLoading(prevState => ({ ...prevState, 'corr_data': false }))
    }).catch(() => { })
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
      sx={{overflow:'scroll',}}
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
          <Typography variant="subtitle1" sx={{ padding: '3px 4px' }}>
            File
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>{filename}</Typography>
          <Typography variant="subtitle1" sx={{ padding: '3px 4px' }}>
            Parameters
          </Typography>
          <Typography variant="caption" sx={{ padding: '3px 4px' }}>Hash</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>{hash_params}</Typography>
          <List>
          <Typography variant="caption" sx={{ padding: '3px 4px' }}>Random Cells</Typography>
            <ListItem>
              <ListItemText secondary='Sheet Address' secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
              <ListItemText secondary='Cell Address' secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
              <ListItemText secondary='Range' secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
              <ListItemText secondary='Prob. Distribution' secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px', mx: '30px' }} />
            </ListItem>

            <Divider sx={{ my: '5px' }} />

            {randCells ? randCells.map((cellAddress, i) => {
              let _x = _.map(_.filter(paramsDetail, { param_type: 'r', cell_address: cellAddress }), 'param_value')
              let _prob = _.map(_.filter(paramsDetail, { param_type: 'p', cell_address: cellAddress }), 'param_value')
              return (
                <ListItem key={i.toString()}>
                  <ListItemText secondary={cellAddress.split('!')[0]} secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
                  <ListItemText secondary={cellAddress.split('!')[1]} secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
                  <ListItemText secondary={_x[0] + ' - ' + _x[_x.length - 1]} secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
                  <Box sx={{ width: '114px', backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .1)' : 'rgba(229, 229, 229, .05)', mx: '30px' }}>
                    <ProbChartMini
                      x={_x}
                      prob={_prob}
                      theme={theme}
                    />
                  </Box>
                </ListItem>
              )
            })
              : null}

            <Typography variant="caption" sx={{ padding: '3px 4px' }}>Monitoring Cells</Typography>

            <ListItem>
              <ListItemText secondary='Sheet Address' secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
              <ListItemText secondary='Cell Address' secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
            </ListItem>

            <Divider sx={{ my: '5px' }} />

            {monitCells ? monitCells.map((cellAddress, i) => {
              let _m = _.map(_.filter(paramsDetail, { param_type: 'm', cell_address: cellAddress }), 'param_value')
              return (
                <ListItem key={i.toString()}>
                  <ListItemText secondary={cellAddress.split('!')[0]} secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
                  <ListItemText secondary={cellAddress.split('!')[1]} secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
                </ListItem>
              )
            })
              : null}
          </List>

          <Typography variant="subtitle1" sx={{ padding: '3px 4px' }}>
            Scope
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>{filename}</Typography>

          <Typography variant="subtitle1" sx={{ padding: '3px 4px' }}>
            Correlation Matrix
          </Typography>
          <CorrMat corrData={corrData} theme={theme} />
        </CardContent>
      </Card>
    </Modal>
  )
}

export default Report