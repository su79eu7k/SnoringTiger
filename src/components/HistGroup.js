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
import SaveIcon from '@mui/icons-material/Save';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from 'axios';
import _ from 'lodash'
import { DateTime } from "luxon";
import ControlButton from './ControlButton';


export default function HistGroup(props) {
  const el = props.el
  const histData = props.histData

  const handleClickBookmark = () => {
    console.log("handleClickBookmark")
  }

  return (
    <>
      <ListItem divider>
        <ListItemIcon>
          <FolderIcon fontSize="small" sx={{ color: "text.secondary" }} />
        </ListItemIcon>
        <ListItemText primary={el.filename} />
        <ListItemText secondary={DateTime.fromSeconds(el.saved).toRelative()} />
        <Stack direction="row" alignItems="flex-end" justifyContent="flex-end">
          <ControlButton connStatus={1} handleClick={handleClickBookmark} caption={"Export"} iconComponent={
            <SaveIcon fontSize="small" sx={{ color: "text.secondary" }} />
          } />
          <ControlButton connStatus={1} handleClick={handleClickBookmark} caption={"Delete"} iconComponent={
            <DeleteIcon fontSize="small" sx={{ color: "text.secondary" }} />
          } />
        </Stack>
      </ListItem>
      {histData.map((e, i) => (
        <List key={i.toString()} component="div" disablePadding dense>
          <ListItem sx={{ pl: 4 }}>
            <ListItemIcon>
              <CameraAltIcon fontSize="small" sx={{ color: "text.secondary" }} />
            </ListItemIcon>
            <ListItemText secondary={DateTime.fromSeconds(e.saved).toLocaleString(DateTime.DATETIME_FULL)} />
            <ListItemText secondary={"~ " + (e.max_loop + 1) + " samples"} />
          </ListItem>
        </List>
      ))}
    </>
  )
}
