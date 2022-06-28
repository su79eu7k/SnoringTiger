import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import axios from 'axios';
import _ from 'lodash';
import { DateTime } from "luxon";
import ListFile from '../components/ListFile';

export default function CheckResults() {
  const [snapshotHist, setSnapshotHist] = useState();
  const [snapshotHistParams, setSnapshotHistParams] = useState();
  const [lastUpdated, setLastUpdated] = useState(DateTime.now().toUnixInteger())

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/get_hist").then((response) => {
      setSnapshotHist(response.data)
    })

    axios.get("http://127.0.0.1:8000/get_hist_params").then((response) => {
      setSnapshotHistParams(response.data)
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
              {_.uniq(_.map(snapshotHist, (e) => (e.filename))).map((filename, i) => (
                <ListFile key={"f-" + i.toString()} groups={_.filter(snapshotHist, { "filename": filename })} groupsParam={_.filter(snapshotHistParams, { "filename": filename })} filename={filename} setLastUpdated={setLastUpdated} />
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
