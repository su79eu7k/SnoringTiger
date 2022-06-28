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
  const [loading, setLoading] = useState({
    hist: false,
    histParams: false
  });
  const [lastUpdated, setLastUpdated] = useState(DateTime.now().toUnixInteger())

  useEffect(() => {
    setLoading(prevState => ({...prevState, 'hist': true}))
    axios.get("http://127.0.0.1:8000/get_hist").then((response) => {
      setSnapshotHist(response.data)
      setLoading(prevState => ({...prevState, 'hist': false}))
    })

    setLoading(prevState => ({...prevState, 'histParams': true}))
    axios.get("http://127.0.0.1:8000/get_hist_params").then((response) => {
      setSnapshotHistParams(response.data)
      setLoading(prevState => ({...prevState, 'histParams': false}))
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
            {
              !loading.hist ? 
              <List dense>
              {_.uniq(_.map(snapshotHist, (e) => (e.filename))).map((filename, i) => (
                <ListFile key={"f-" + i.toString()} groups={_.filter(snapshotHist, { "filename": filename })} groupsParam={_.filter(snapshotHistParams, { "filename": filename })} filename={filename} setLastUpdated={setLastUpdated} loading={loading} />
              ))}
            </List> : null
            }
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
