import Typography from '@mui/material/Typography';
import MonitoringCellCard from '../components/MonitoringCellCard'
import _ from 'lodash'

export default function AddMonitoringCells(props) {
  return (
    <>
      <Typography variant="h6">
        Add Monitoring Cells
      </Typography>
      {[...Array(_.reject(props.monitoringCells, { addressSheet: null, addressCell: null }).length + 1)].map(
        (v, i) => <MonitoringCellCard key={i.toString()} id={i.toString()} monitoringCells={props.monitoringCells} setMonitoringCells={props.setMonitoringCells} />)}
    </>
  )
}
