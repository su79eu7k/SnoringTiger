import { useState } from 'react'
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CableIcon from '@mui/icons-material/Cable';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';


const Input = styled('input')({
  display: 'none',
});

export default function ConnectWorkbook(props) {
  const [status, setStatus] = useState()
  const [loading, setLoading] = useState(false)

  function approxBytes(nBytes) {
    let sOutput
    for (let aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
      sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
    }
    return sOutput
  }

  function handleChange(e) {
    props.setFile(e.target.files[0])
    // To prevent no action in case user uploads the same filename.
    e.target.value = ''
  }

  function handleSubmit(e) {
    e.preventDefault()

    setLoading(true)
    setStatus(0)
    if (props.file) {
      const url = 'http://127.0.0.1:8000/upload_file';
      const formData = new FormData();
      formData.append('uploadfile', props.file);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      axios.post(url, formData, config).then((response) => {
        if (response.data.code === 1) {
          axios.get("http://127.0.0.1:8000/check_connection").then((response) => {
            props.setConn(response.data.code)
            props.setConnWith(response.data.message)
            setLoading(false)
            setStatus(1)
          })
        } else {
          setLoading(false)
          setStatus(-1)
        }
      });
    } else {
      setLoading(false)
      setStatus(-1)
    }
  }

  return (
    <>
      <Typography variant="h6">
        Connect Workbook
      </Typography>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">
            Original File
          </Typography>
          <Typography variant="caption">{props.file ? props.file.name : "N/A"}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Size
          </Typography>
          <Typography variant="caption">{props.file ? approxBytes(props.file.size) : "N/A"}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Connected File
          </Typography>
          <Typography variant="caption">{props.conn === 1 ? props.connWith : "N/A"}</Typography>
        </CardContent>
        <CardActions>
          <Stack direction="row" alignItems="center" spacing={1}>
            <label htmlFor="contained-button-file">
              <Input
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel.sheet.binary.macroEnabled.12"
                id="contained-button-file"
                type="file"
                onChange={handleChange} />
              <Button variant="outlined" startIcon={<FolderOpenIcon />} component="span">
                Select
              </Button>
            </label>
            <LoadingButton
              variant="outlined"
              onClick={handleSubmit}
              startIcon={<CableIcon />}
              disabled={props.conn === 1}
              loading={loading}
              loadingPosition={'start'}
            >
              Connect
            </LoadingButton>
          </Stack>
        </CardActions>
      </Card>
      {status === -1 ? <Alert severity="error" variant="outlined">
        <AlertTitle>Error</AlertTitle>
        File not selected — <strong>check it out!</strong>
      </Alert> : null}
      {status === 1 ? <Alert severity="success" variant="outlined">
        <AlertTitle>Success</AlertTitle>
        Workbook connected — <strong>check it out!</strong>
      </Alert> : null}
    </>
  )
}
