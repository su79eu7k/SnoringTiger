import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { DateTime } from "luxon";
import ControlButton from './ControlButton';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import Report from './Report'
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function ListHashSnap(props) {
  const groups = props.groups
  const groupsParam = props.groupsParam[0]
  const filename = props.filename
  const hash_params = props.hash_params

  const loading = props.loading
  const setLoading = props.setLoading

  const [loadingRep, setLoadingRep] = useState({
    params_detail: true,
    summary_data: true,
    scoped_data: true,
    corr_data: true,
  })

  const setLastUpdated = props.setLastUpdated

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openReportModal, setOpenReportModal] = useState(false)

  const [paramsDetail, setParamsDetail] = useState()
  const [summaryData, setSummaryData] = useState()
  const [corrData, setCorrData] = useState()
  const [scopedData, setScopedData] = useState()

  const handleClickReport = () => {
    setLoadingRep(prevState => ({ ...prevState, 'params_detail': true }))
    axios.get("http://127.0.0.1:8000/get_params_detail?hash_params=" + hash_params).then((response) => {
      setParamsDetail(response.data)
      setLoadingRep(prevState => ({ ...prevState, 'params_detail': false }))
    }).catch(() => { })

    setLoadingRep(prevState => ({ ...prevState, 'summary_data': true }))
    const url_get_summary = 'http://127.0.0.1:8000/get_summary';
    const data_get_summary = { hash_params: hash_params }
    const config_get_summary = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url_get_summary, data_get_summary, config_get_summary).then((response) => {
      setSummaryData(response.data)
      setLoadingRep(prevState => ({ ...prevState, 'summary_data': false }))
    });

    setLoadingRep(prevState => ({ ...prevState, 'corr_data': true }))
    axios.get("http://127.0.0.1:8000/get_corr?hash_params=" + hash_params).then((response) => {
      setCorrData(response.data)
      setLoadingRep(prevState => ({ ...prevState, 'corr_data': false }))
    }).catch(() => { })

    setLoadingRep(prevState => ({ ...prevState, 'scoped_data': true }))
    const url_scoped_data = 'http://127.0.0.1:8000/get_scoped_data';
    const data_scoped_data = { hash_params: hash_params }
    const config_scoped_data = {
      headers: {
        'content-type': 'application/json',
      },
    };
    axios.post(url_scoped_data, data_scoped_data, config_scoped_data).then((response) => {
      setScopedData(response.data)
      setLoadingRep(prevState => ({ ...prevState, 'scoped_data': false }))
    });
  }

  useEffect(() => {
    if (!loading.params_detail && !loading.summary_data && !loading.corr_data && !loading.scoped_data) {
      setOpenReportModal(true)
    }
  }, [loading])

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
        {
          !loading.histParams ?
            <ListItemText
              secondary={"R:" + groupsParam.random + " / M: " + groupsParam.monitoring} 
              secondaryTypographyProps={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }} 
              sx={{ width: '0px', minWidth: '90px' }} />
            : null
        }

        <Stack direction="row" alignItems="flex-end" justifyContent="flex-end">
          
          <ControlButton connStatus={1} handleClick={handleClickReport} caption={"Report"} iconComponent={
            <AssessmentIcon fontSize="small" sx={{ color: "text.secondary" }} />
          } />
          {
            (!loadingRep.params_detail && !loadingRep.summary_data && !loadingRep.corr_data && !loadingRep.scoped_data) ? 
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
          /> : null
        }          
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
