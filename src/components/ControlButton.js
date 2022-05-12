import { useTheme } from '@mui/styles'
import ButtonBase from '@mui/material/ButtonBase';


function ControlButton(props) {
    const connStatus = props.connStatus
    const handleClick = props.handleClick
    const iconComponent = props.iconComponent
    const theme = useTheme()

  return (
    <ButtonBase
    disabled={connStatus !== 1}
    onClick={handleClick}
    sx={{
      padding: '3px',
      '&:hover': {
        borderWidth: '0px',
        borderRadius: 1,
        backgroundColor: theme.palette.mode === "light" ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)'
      }
    }}>
    {iconComponent}
  </ButtonBase>
  )
}

export default ControlButton