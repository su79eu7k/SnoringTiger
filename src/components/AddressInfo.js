import React from 'react'
import Typography from '@mui/material/Typography';
import ControlButton from './ControlButton';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import axios from 'axios';


function AddressInfo(props) {
  const connStatus = props.connStatus
  const addressSheet = props.addressSheet
  const addressCell = props.addressCell
  
  const handleClickFocus = (e) => {
    axios.get("http://127.0.0.1:8000/select_with_focus/?sheet=" + addressSheet + "&cell=" + addressCell).then((response) => {
      console.log(response)
    });
  }

  return (
    <>
      <Typography noWrap variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
        Sheet
      </Typography>
      <Typography noWrap variant="subtitle2" sx={{ padding: '3px 4px' }}>
        {addressSheet}
      </Typography>
      <Typography noWrap variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
        Cell
      </Typography>
      <Typography noWrap variant="h5" sx={{ padding: '3px 4px' }}>
        {addressCell}
      </Typography>
      <ControlButton connStatus={connStatus} handleClick={handleClickFocus} caption={"Focus"} iconComponent={
        <CenterFocusStrongIcon fontSize="small" sx={{ color: "text.secondary" }} />
      } />
    </>
  )
}

export default AddressInfo