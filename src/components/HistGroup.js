import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import SaveIcon from '@mui/icons-material/Save';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
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
