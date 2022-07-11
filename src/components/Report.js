import React from 'react'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

function Report(props) {
  const openReportModal = props.openReportModal
  const setOpenReportModal = props.setOpenReportModal

  return (
    <Modal
    open={openReportModal}
    onClose={() => { setOpenReportModal(false) }}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
                    <Typography variant="h6">
                  Report
                </Typography>
  </Modal>
  )
}

export default Report