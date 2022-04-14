import { useState } from 'react'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

export default function ConnectWorkbook() {
  const [file, setFile] = useState()
  const [status, setStatus] = useState()
  const [loading, setLoading] = useState()

  function approxBytes(nBytes) {
    let sOutput
    for (let aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
      sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
    }
    return sOutput
  }

  function handleChange(e) {
    setFile(e.target.files[0])
    e.target.value = ''
  }

  function handleSubmit(e) {
    setLoading(1)
    setStatus(0)
    if (file) {
      e.preventDefault()
      const url = 'http://127.0.0.1:8000/upload_file';
      const formData = new FormData();
      formData.append('uploadfile', file);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      axios.post(url, formData, config).then((response) => {
        setLoading(0)
        if (response.data.code === 1) {
          setStatus(1)
        } else {
          setStatus(-1)
        }
      });
    } else {
      setLoading(0)
      setStatus(-1)
    }
  }

  return (
    <>
      <Typography variant="h6">
        Connect Workbook
      </Typography>
      <Typography variant="body1">
        {file &&
          <Typography variant="caption">{file.name} - Size: {approxBytes(file.size)}</Typography>
        }
      </Typography>
      {loading === 1 ? <CircularProgress /> : null}
      <Stack spacing={2} direction="row">
        <Button variant="contained" component="label">
          Select
          <input type="file" onChange={handleChange} hidden />
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained">Connect</Button>
      </Stack>
      {status === -1 ? <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        File not selected — <strong>check it out!</strong>
      </Alert> : null}
      {status === 1 ? <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Workbook connected — <strong>check it out!</strong>
      </Alert> : null}
    </>
  )
}
