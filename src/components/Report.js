import React, { useState, useEffect } from 'react';
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
import ListItemText from '@mui/material/ListItemText';
import CorrMat from './CorrMat';
import ScatterChart from './ScatterChart';
import ControlButton from './ControlButton';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import DeselectIcon from '@mui/icons-material/Deselect';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';


function Report(props) {
  const openReportModal = props.openReportModal
  const setOpenReportModal = props.setOpenReportModal
  const filename = props.filename
  const hash_params = props.hash_params

  const [paramsDetail, setParamsDetail] = useState()
  const [corrData, setCorrData] = useState()
  const [summaryData, setSummaryData] = useState()
  const [scopedData, setScopedData] = useState()
  const [scatterSelected, setScatterSelected] = useState('0')
  const [scatters, setScatters] = useState({0: {}})
  const [loading, setLoading] = useState({
    params_detail: false,
    summary_data: false,
    corr_data: false,
  })
  const [scopeUpdated, setScopeUpdated] = useState(DateTime.now().toUnixInteger())

  const [randCells, setRandCells] = useState()
  const [monitCells, setMonitCells] = useState()

  const theme = useTheme()

  useEffect(() => {
    setLoading(prevState => ({ ...prevState, 'params_detail': true }))
    axios.get("http://127.0.0.1:8000/get_params_detail?hash_params=" + hash_params).then((response) => {
      setParamsDetail(response.data)
      setLoading(prevState => ({ ...prevState, 'params_detail': false }))
    }).catch(() => { })

    setLoading(prevState => ({ ...prevState, 'summary_data': true }))
    const url = 'http://127.0.0.1:8000/get_summary';
    const data = { hash_params: hash_params }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url, data, config).then((response) => {
      setSummaryData(response.data)
      setLoading(prevState => ({ ...prevState, 'summary_data': false }))
    });

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
  }, [scopeUpdated])

  useEffect(() => {
    setLoading(true)
    const url = 'http://127.0.0.1:8000/get_scoped_data';
    const data = {
      hash_params: hash_params,
    }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url, data, config).then((response) => {
      setScopedData(response.data)
      setLoading(false)
    });
  }, [scopeUpdated])

  useEffect(() => {
    setRandCells(_.uniq(_.map(_.filter(paramsDetail, { param_type: 'r' }), 'cell_address')))
    setMonitCells(_.uniq(_.map(_.filter(paramsDetail, { param_type: 'm' }), 'cell_address')))
  }, [paramsDetail])


  useEffect(() => {
    console.log(scatters)
  }, [scatters])

  useEffect(() => {
    console.log("Report: scatterSelected");
    console.log("Report-type: " + typeof(scatterSelected));
    console.log("Report-value: " + scatterSelected);
  }, [scatterSelected])

  return (
    <Modal
      sx={{ overflow: 'scroll', }}
      open={openReportModal}
      onClose={() => { setOpenReportModal(false) }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translate(-50%, 0%)",
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
          <Typography variant="subtitle1" sx={{ padding: '3px 4px', mt: '30px' }}>
            Parameters
          </Typography>
          <Typography variant="subtitle2" sx={{ padding: '3px 4px', fontSize: 13, mt: '10px' }}>Hash</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>{hash_params}</Typography>
          <List>
            <Typography variant="subtitle2" sx={{ padding: '3px 4px', fontSize: 13, mt: '10px' }}>Random Cells</Typography>
            <ListItem>
              {['Sheet', 'Cell', 'Mean', 'Std', '25%', '50%', '75%', 'Max', 'Prob.'].map((col, i) =>
                <ListItemText
                  key={i.toString()}
                  secondary={col}
                  secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }}
                  sx={{ width: '0px', minWidth: '60px' }} />
              )}
            </ListItem>

            <Divider sx={{ my: '3px' }} />

            {randCells && summaryData ? randCells.map((cellAddress, i) => {
              let _x = _.map(_.filter(paramsDetail, { param_type: 'r', cell_address: cellAddress }), 'param_value')
              let _prob = _.map(_.filter(paramsDetail, { param_type: 'p', cell_address: cellAddress }), 'param_value')
              function stat_val(_stat) { return _.filter(summaryData, { column: 'T: ' + cellAddress, stats: _stat })[0].value }
              return (
                <ListItem key={i.toString()}>
                  {[cellAddress.split('!')[0], cellAddress.split('!')[1], 'mean', 'std', '25%', '50%', '75%', 'max'].map((col, i) =>
                    <ListItemText
                      key={i.toString()}
                      secondary={i < 2 ? col : stat_val(col)}
                      secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }}
                      sx={{ width: '0px', minWidth: '60px' }} />
                  )}
                  <Box sx={{ width: '60px', backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .1)' : 'rgba(229, 229, 229, .05)' }}>
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

            <Typography variant="subtitle2" sx={{ padding: '3px 4px', fontSize: 13, mt: '10px' }}>Monitoring Cells</Typography>

            <ListItem>
              <ListItemText secondary='Sheet Address' secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
              <ListItemText secondary='Cell Address' secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
            </ListItem>

            <Divider sx={{ my: '3px' }} />

            {monitCells ? monitCells.map((cellAddress, i) => {
              return (
                <ListItem key={i.toString()}>
                  <ListItemText secondary={cellAddress.split('!')[0]} secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
                  <ListItemText secondary={cellAddress.split('!')[1]} secondaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: 'center' }} sx={{ width: '0px', minWidth: '90px' }} />
                </ListItem>
              )
            })
              : null}
          </List>

          {/* <Typography variant="subtitle1" sx={{ padding: '3px 4px' }}>
            Scope
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>{filename}</Typography> */}

          <Typography variant="subtitle1" sx={{ padding: '3px 4px', mt: '30px' }}>
            Correlation Matrix
          </Typography>
          <CorrMat key={scatterSelected} scatterSelected={scatterSelected} corrData={corrData} theme={theme} setScatters={setScatters} />

          <Typography variant="subtitle1" sx={{ padding: '3px 4px', mt: '30px' }}>
            Scatter Plots
          </Typography>

          <ControlButton connStatus={1} handleClick={() => setScatters(prevState => ({ ...prevState, [Number(_.keys(scatters)[_.keys(scatters).length - 1]) + 1]: {}}))} caption={"Add"} iconComponent={
              <HighlightAltIcon fontSize="small" sx={{ color: "text.secondary" }} />
            } />
            <ControlButton connStatus={1} handleClick={() => setScatters(_.omit(scatters, [Number(_.keys(scatters)[_.keys(scatters).length - 1])]))} caption={"Remove"} iconComponent={
              <DeselectIcon fontSize="small" sx={{ color: "text.secondary" }} />
            } />
            
          {_.keys(scatters).length > 0 ? _.keys(scatters).map((e, i) => 
            <React.Fragment key={i.toString()}>
            <ControlButton connStatus={1} handleClick={() => setScatterSelected(e)} caption={"Select"} iconComponent={
              <SelectAllIcon fontSize="small" sx={{ color: "text.secondary" }} />
            } />
            <ScatterChart labels={{x: scatters[e].x, y: scatters[e].y}} coords={[{x: 1, y: 5}, {x: 2, y: 6}]} theme={theme} />
            </React.Fragment>
          ) : null}

        </CardContent>
      </Card>
    </Modal>
  )
}

export default Report