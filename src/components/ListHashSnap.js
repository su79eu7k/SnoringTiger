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
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';

export default function ListHashSnap(props) {
  const groups = props.groups
  const groupsParam = props.groupsParam[0]
  const filename = props.filename
  const hash_params = props.hash_params

  const loading = props.loading

  const setLastUpdated = props.setLastUpdated

  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const handleClickExport = () => {
    axios.get("http://127.0.0.1:8000/get_csv?hash_params=" + hash_params).then((response) => {
      const _elem = document.createElement('a')
      const _file = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      _elem.href = URL.createObjectURL(_file);
      _elem.download = hash_params + ".csv";
      _elem.click();
    })
  }


  const handleClickDelete = () => {
    setOpenDeleteModal(true)
  }

  const handleClickDeleteConfirm = () => {
    console.log("handleClickDeleteConfirm")

    const url = "http://127.0.0.1:8000/del_snapshot"
    const data = { filename: filename, hash_params: hash_params }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url, data, config).then((response) => {
      setLastUpdated(DateTime.now().toUnixInteger())
    })
    setOpenDeleteModal(false)
  }


  return (
    <>
      <ListItem sx={{ pl: 4 }}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" sx={{ color: "text.secondary" }} />
        </ListItemIcon>
        <ListItemText primary={hash_params} primaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} sx={{ width: '0px', minWidth: '90px' }} />
        {!loading.histParams ? <ListItemText secondary={"R:" + groupsParam.random + " / M: " + groupsParam.monitoring} secondaryTypographyProps={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}  sx={{ width: '0px', minWidth: '90px' }} /> : null}

        <Stack direction="row" alignItems="flex-end" justifyContent="flex-end">
          <ControlButton connStatus={1} handleClick={handleClickExport} caption={"Export"} iconComponent={
            <SaveIcon fontSize="small" sx={{ color: "text.secondary" }} />
          } />
          <ControlButton connStatus={1} handleClick={handleClickDelete} caption={"Delete"} iconComponent={
            <DeleteIcon fontSize="small" sx={{ color: "text.secondary" }} />
          } />
          <Modal
            open={openDeleteModal}
            onClose={() => { setOpenDeleteModal(false) }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Card sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "300px",
              padding: "10px",
              textAlign: "justify",
            }}>
              <CardContent>
                <Typography variant="h6">
                  <WarningAmberIcon sx={{ verticalAlign: "middle", pb: "3px", mr: "4px" }} />
                  Warning
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  All snapshots in this file will be deleted, this is irreversible.
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Are you sure to proceed?
                </Typography>
              </CardContent>
              <Stack direction="row" alignItems="flex-end" justifyContent="flex-end">
                <ControlButton connStatus={1} handleClick={handleClickDeleteConfirm} caption={"Delete"} iconComponent={
                  <CheckCircleIcon fontSize="small" sx={{ color: "text.secondary" }} />
                } />
                <ControlButton connStatus={1} handleClick={() => setOpenDeleteModal(false)} caption={"Cancel"} iconComponent={
                  <CancelIcon fontSize="small" sx={{ color: "text.secondary" }} />
                } />
              </Stack>
            </Card>
          </Modal>
        </Stack>

      </ListItem>
      {groups.map((record, i) => (
        <List key={i.toString()} component="div" disablePadding dense>
          <ListItem sx={{ pl: 8 }}>
            <ListItemIcon>
              <CameraAltIcon fontSize="small" sx={{ color: "text.secondary" }} />
            </ListItemIcon>
            <ListItemText secondary={DateTime.fromSeconds(record.saved).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} />
            <ListItemText secondary={(record.samples) + " samples"} />
          </ListItem>
        </List>
      ))}
    </>
  )
}
