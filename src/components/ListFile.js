import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import ListHashSnap from './ListHashSnap';
import _ from 'lodash';

export default function ListFile(props) {
  const groups = props.groups
  const groupsParam = props.groupsParam
  const filename = props.filename

  const setLastUpdated = props.setLastUpdated

  return (
    <>
      <ListItem>
        <ListItemIcon>
          <FolderIcon fontSize="small" sx={{ color: "text.secondary" }} />
        </ListItemIcon>
        <ListItemText primary={filename} />
      </ListItem>
      <List dense>
        {_.uniq(_.map(groups, (e) => (e.hash_params))).map((hash, i) => (
          <ListHashSnap key={"h-" + i.toString()} groups={_.filter(groups, { "hash_params": hash })} groupsParam={_.filter(groupsParam, { "hash_params": hash })} filename={filename} hash_params={hash} setLastUpdated={setLastUpdated} />
        ))}
      </List>
    </>
  )
}
