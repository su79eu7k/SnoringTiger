import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import _ from 'lodash';
import ListHashSnap from './ListHashSnap';

export default function ListFile(props) {
  const histList = props.histList
  const histListParams = props.histListParams
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
      {
        (histList !== undefined) && (histListParams !== undefined) ?
          <List dense>
            {_.uniq(_.map(histList, (e) => (e.hash_params))).map((hash, i) => (
              <ListHashSnap
                key={"h-" + i.toString()}
                groups={_.filter(histList, { "hash_params": hash })}
                groupsParam={_.filter(histListParams, { "hash_params": hash })}
                filename={filename}
                hash_params={hash}
                setLastUpdated={setLastUpdated} />
            ))}
          </List>
          : null}
    </>
  )
}
