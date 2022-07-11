import React from 'react'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

function Report(props) {
  const openReportModal = props.openReportModal
  const setOpenReportModal = props.setOpenReportModal
  const filename = props.filename
  const hash_params = props.hash_params

  return (
    <Modal
      open={openReportModal}
      onClose={() => { setOpenReportModal(false) }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        minWidth: "600px",
        maxWidth: "1200px",
        padding: "10px",
        textAlign: "justify",
      }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
            File
          </Typography>
          <Typography variant="subtitle2" sx={{ padding: '3px 4px' }}>{filename}</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
            Parameters({hash_params})
          </Typography>
          <Typography variant="subtitle2" sx={{ padding: '3px 4px' }}>{filename}</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ padding: '3px 4px' }}>
            Samples
          </Typography>
          <Typography variant="subtitle2" sx={{ padding: '3px 4px' }}>{filename}</Typography>
        </CardContent>
      </Card>
    </Modal>
  )
}

export default Report