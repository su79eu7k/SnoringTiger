import Typography from '@mui/material/Typography';
import MonitoringCellCard from '../components/MonitoringCellCard'
import _ from 'lodash'
import Grid from '@mui/material/Grid';

export default function AddMonitoringCells(props) {
  const connStatus = props.connStatus
  const monitoringCells = props.monitoringCells
  const setMonitoringCells = props.setMonitoringCells

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">
            Add Monitoring Cells
          </Typography>
        </Grid>
        {[...Array(_.reject(props.monitoringCells, { addressSheet: null, addressCell: null }).length + 1)].map(
          (v, i) => (
            <Grid item xs={12} key={i.toString()}>
              <MonitoringCellCard id={i.toString()} connStatus={connStatus} monitoringCell={monitoringCells[i.toString()]} setMonitoringCells={setMonitoringCells} />
            </Grid>
          )
        )}
      </Grid>
    </>
  )
}
