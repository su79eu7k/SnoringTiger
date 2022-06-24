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
import { DateTime } from "luxon";


export default function HistGroup(props) {
  const el = props.el

  const [open, setOpen] = useState(false);

  const handleClickExpand = () => {
    setOpen(!open);
  };

  return (
    <>
      <Divider />
      <ListItemButton onClick={handleClickExpand}>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={el.filename} />
        <ListItemText secondary={DateTime.fromSeconds(el.saved).toRelative()} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <CameraAltIcon />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  )
}
