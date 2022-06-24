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


export default function HistGroup(props) {
  const el = props.el
  const histData = props.histData

  const [open, setOpen] = useState(false);

  const handleClickExpand = () => {
    setOpen(!open);
    console.log(histData)
  };

  return (
    <>
      <Divider />
      <ListItemButton onClick={handleClickExpand}>
        <ListItemIcon>
          <FolderIcon size='small' />
        </ListItemIcon>
        <ListItemText primary={el.filename} />
        <ListItemText secondary={DateTime.fromSeconds(el.saved).toRelative()} />
        <ListItemText secondary={(el.max_loop + 1) + " total"} />

        {/* <IconButton size='small'>
          <BookmarkIcon />
        </IconButton>
        <IconButton size='small'>
          <SaveIcon />
        </IconButton>
        <IconButton size='small'>
          <DeleteIcon />
        </IconButton> */}

        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {histData.map((e, i) => (
          <List key={i.toString()} component="div" disablePadding dense>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon size='small'>
                <CameraAltIcon size='small' />
              </ListItemIcon>
              <ListItemText secondary={DateTime.fromSeconds(e.saved).toLocaleString(DateTime.DATETIME_FULL)} />
              <ListItemText secondary={"~ " + (e.max_loop + 1) + " samples"} />
            </ListItemButton>
          </List>
        ))}
      </Collapse>
    </>
  )
}
