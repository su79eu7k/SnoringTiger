import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import IconButton from '@mui/material/IconButton';
import PushPinIcon from '@mui/icons-material/PushPin';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import StarBorder from '@mui/icons-material/StarBorder';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from 'axios';
import _ from 'lodash'
import HistGroup from '../components/HistGroup';

export default function CheckResults() {
  const [histData, setHistData] = useState();
  const [histGroupData, setHistGroupData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/get_hist").then((response) => {
      

      const _groups = _.groupBy(response.data, 'filename')
      const _groupKeys = _.keys(_groups)

      setHistData(_groups)
      setHistGroupData(_.map(_groupKeys, (k) => _groups[k][_groups[k].length - 1]))
    })
  }, [])

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
            <Stack direction="row">
              <Typography noWrap variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
                Recent
              </Typography>
              <Typography noWrap variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
                Pinned
              </Typography>
            </Stack>
            <List dense>
              {histGroupData.map((el, i) => (
                <HistGroup key={i.toString()} el={el} histData={histData[el.filename]}/>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
