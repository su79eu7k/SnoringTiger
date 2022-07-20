import { useState, useEffect } from 'react';
import { useTheme } from '@mui/styles'
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box, Divider } from '@mui/material';
import ControlButton from './ControlButton';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import _ from 'lodash'
import ProbChartMini from './ProbChartMini';
import CorrMat from './CorrMat';
import ScatterChartWrapper from './ScatterChartWrapper';


export default function Report(props) {
  const openReportModal = props.openReportModal
  const setOpenReportModal = props.setOpenReportModal
  const filename = props.filename
  const hash_params = props.hash_params

  const paramsDetail = props.paramsDetail
  const summaryData = props.summaryData
  const corrData = props.corrData
  const scopedData = props.scopedData

  const [randCells, setRandCells] = useState()
  const [monitCells, setMonitCells] = useState()
  const [scatters, setScatters] = useState({ 0: {} })
  const [scatterSelected, setScatterSelected] = useState('0')
  const [lastRemoveReq, setLastRemoveReq] = useState()

  const theme = useTheme()

  useEffect(() => {
    setRandCells(_.uniq(_.map(_.filter(paramsDetail, { param_type: 'r' }), 'cell_address')))
    setMonitCells(_.uniq(_.map(_.filter(paramsDetail, { param_type: 'm' }), 'cell_address')))
  }, [paramsDetail])

  useEffect(() => {
    const updatedScatters = _.omit(scatters, lastRemoveReq)

    if (_.keys(updatedScatters).length === 0) {
      setScatters({ 0: {} })
    } else {
      setScatters(updatedScatters);
    }
    setScatterSelected('0')
  }, [lastRemoveReq])

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
            <>
              <Typography variant="subtitle2" sx={{ padding: '3px 4px', fontSize: 13, mt: '10px' }}>Hash</Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>{hash_params}</Typography>

              <List>
                <Typography variant="subtitle2" sx={{ padding: '3px 4px', fontSize: 13, mt: '10px' }}>Random Cells</Typography>
                <ListItem>
                  {['Sheet', 'Cell', 'Mean', 'Std', 'Min', '25%', '50%', '75%', 'Max', 'Prob.'].map((col, i) =>
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
                      {[cellAddress.split('!')[0], cellAddress.split('!')[1], 'mean', 'std', 'min', '25%', '50%', '75%', 'max'].map((col, i) =>
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
            </>

          <Typography variant="subtitle1" sx={{ padding: '3px 4px', mt: '30px' }}>
            Correlation Matrix
          </Typography>
          {corrData ?
            <CorrMat key={scatterSelected} scatterSelected={scatterSelected} corrData={corrData} theme={theme} setScatters={setScatters} />
            : null}

          <Typography variant="subtitle1" sx={{ padding: '3px 4px', mt: '30px' }}>
            Scatter Plots
          </Typography>
          {scopedData ?
            <>
              <Stack direction="row" justifyContent="flex-end">
                <ControlButton connStatus={1} handleClick={() => setScatters(prevState => ({ ...prevState, [Number(_.keys(scatters)[_.keys(scatters).length - 1]) + 1]: {} }))} caption={"Add New Plot"} iconComponent={
                  <HighlightAltIcon fontSize="small" sx={{ color: "text.secondary" }} />
                } />
              </Stack>

              {_.keys(scatters).length > 0 ? _.keys(scatters).map((k, i) =>
                <Box key={i.toString()} onClick={() => setScatterSelected(k)} sx={{ padding: '10px', "&:hover": { backgroundColor: 'rgba(229, 229, 229, .03)', borderRadius: '10px' } }}>
                  <ScatterChartWrapper
                    scatterSelected={scatterSelected}
                    plotKey={k}
                    setLastRemoveReq={setLastRemoveReq}
                    labels={{ x: scatters[k].x, y: scatters[k].y }}
                    coords={_.map(scopedData, (e) => ({ x: e[scatters[k].x], y: e[scatters[k].y] }))}
                    theme={theme} />
                </Box>
              )
                : null}
            </>
            : null}
        </CardContent>
      </Card>
    </Modal>
  )
}
