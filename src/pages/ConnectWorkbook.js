import React, { useState } from 'react'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function ConnectWorkbook() {
  const [file, setFile] = useState()

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
        console.log(response.data);
      });
    } else {
      console.log("No file")
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
      <Stack spacing={2} direction="row">
        <Button variant="contained" component="label">
          Select
          <input type="file" onChange={handleChange} hidden />
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained">Connect</Button>
      </Stack>
    </>
  )
}
