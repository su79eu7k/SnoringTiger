import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import _ from 'lodash';
import ListHashSnap from './ListHashSnap';

export default function ListFile(props) {
  const histList = props.histList
  const setHistList = props.setHistList
  const histListParams = props.histListParams
  const setHistListParams = props.setHistListParams
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
        {_.uniq(_.map(histList, (e) => (e.hash_params))).map((hash, i) => (
          <ListHashSnap
            key={"h-" + i.toString()}
            histList={_.filter(histList, { "hash_params": hash })}
            setHistList={setHistList}
            histListParams={_.filter(histListParams, { "hash_params": hash })[0]}
            setHistListParams={setHistListParams}
            filename={filename}
            hash_params={hash}
            setLastUpdated={setLastUpdated} />
        ))}
      </List>
    </>
  )
}
