import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import axios from 'axios';
import _ from 'lodash'
import HistGroup from '../components/HistGroup';
import { DateTime } from "luxon";

export default function CheckResults() {
  const [snapshotRecs, setSnapshotRecs] = useState();
  const [snapshotRecsMaxLoop, setSnapshotRecsMaxLoop] = useState([]);

  const [lastUpdated, setLastUpdated] = useState(DateTime.now().toUnixInteger())

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/get_hist").then((response) => {
      const _groups = _.groupBy(response.data, 'filename')
      const _groupKeys = _.keys(_groups)

      setSnapshotRecs(_groups)
      setSnapshotRecsMaxLoop(_.map(_groupKeys, (k) => _groups[k][_groups[k].length - 1]))
    })
  }, [lastUpdated])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          History
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <List dense>
              {snapshotRecsMaxLoop.map((rec, i) => (
                <HistGroup key={i.toString()} maxLoopRecord={rec} records={snapshotRecs[rec.filename]} setLastUpdated={setLastUpdated} />
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
