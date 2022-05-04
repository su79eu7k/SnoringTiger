import Typography from '@mui/material/Typography';
import MonitoringCellCard from '../components/MonitoringCellCard'
import _ from 'lodash'
import Grid from '@mui/material/Grid';

export default function AddMonitoringCells(props) {
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
            <Grid item xs={12}>
              <MonitoringCellCard key={i.toString()} id={i.toString()} conn={props.conn} monitoringCells={props.monitoringCells} setMonitoringCells={props.setMonitoringCells} />
            </Grid>
          )
        )}
      </Grid>
    </>
  )
}
