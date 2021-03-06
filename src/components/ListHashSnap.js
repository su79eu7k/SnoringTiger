import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ControlButton from './ControlButton';
import SettingsIcon from '@mui/icons-material/Settings';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { DateTime } from "luxon";
import Report from './Report'
import { API_SERVER } from '../helpers/url';

export default function ListHashSnap(props) {
  const histList = props.histList
  const setHistList = props.setHistList
  const histListParams = props.histListParams
  const setHistListParams = props.setHistListParams
  const filename = props.filename
  const hash_params = props.hash_params
  const setLastUpdated = props.setLastUpdated

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openReportModal, setOpenReportModal] = useState(false)

  const [paramsDetail, setParamsDetail] = useState()
  const [summaryData, setSummaryData] = useState()
  const [corrData, setCorrData] = useState()
  const [scopedData, setScopedData] = useState()

  const handleClickReport = () => {
    axios.get(API_SERVER + "/get_hist_sim_params?hash_params=" + hash_params).then((response) => {
      setParamsDetail(response.data)
    }).catch(() => { })

    const url_get_summary = API_SERVER + '/get_hist_sim_summary';
    const data_get_summary = { hash_params: hash_params }
    const config_get_summary = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url_get_summary, data_get_summary, config_get_summary).then((response) => {
      setSummaryData(response.data)
    });

    axios.get(API_SERVER + "/get_hist_sim_corr?hash_params=" + hash_params).then((response) => {
      setCorrData(response.data)
    }).catch(() => { })

    const url_scoped_data = API_SERVER + '/get_hist_sim_recs';
    const data_scoped_data = { hash_params: hash_params }
    const config_scoped_data = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url_scoped_data, data_scoped_data, config_scoped_data).then((response) => {
      setScopedData(response.data)
    });

    setOpenReportModal(true)
  }

  const handleClickExport = () => {
    axios.get(API_SERVER + "/get_hist_sim_csv?hash_params=" + hash_params).then((response) => {
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
    const url = API_SERVER + "/del_hist_sim"
    const data = { filename: filename, hash_params: hash_params }
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url, data, config).then((response) => {
      setHistList()
      setHistListParams()
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
        <ListItemText
          primary={hash_params}
          primaryTypographyProps={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
          sx={{ width: '0px', minWidth: '90px' }} />
        <ListItemText
          secondary={"R:" + histListParams.random + " / M: " + histListParams.monitoring}
          secondaryTypographyProps={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}
          sx={{ width: '0px', minWidth: '90px' }} />

        <Stack direction="row" alignItems="flex-end" justifyContent="flex-end">

          <ControlButton connStatus={1} handleClick={handleClickReport} caption={"Report"} iconComponent={
            <AssessmentIcon fontSize="small" sx={{ color: "text.secondary" }} />
          } />
          <Report
            openReportModal={openReportModal}
            setOpenReportModal={setOpenReportModal}
            filename={filename}
            hash_params={hash_params}
            paramsDetail={paramsDetail}
            summaryData={summaryData}
            corrData={corrData}
            scopedData={scopedData}
            setScopedData={setScopedData}
          />

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
                  All snapshots in this group will be deleted, this is irreversible.
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
      {histList.map((record, i) => (
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
