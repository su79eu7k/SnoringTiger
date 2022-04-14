import { useState } from 'react'
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function BasicCard() {
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  const [step, setStep] = useState()

  const handleStartChange = (e) => {
    setStart(e.target.value);
  };

  const handleEndChange = (e) => {
    setEnd(e.target.value);
  };

  const handleStepChange = (e) => {
    setStep(e.target.value);
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary">
          Sheet1
        </Typography>
        <Typography variant="h5" component="div">
          A35
        </Typography>
        <Stack spacing={2} direction="row">
        <FormControl size='small'>
          <InputLabel htmlFor="component-outlined">Start</InputLabel>
          <OutlinedInput
            id="component-outlined-start"
            value={start}
            onChange={handleStartChange}
            label="Start"
          />
        </FormControl>
        <FormControl size='small'>
          <InputLabel htmlFor="component-outlined">End</InputLabel>
          <OutlinedInput
            id="component-outlined-end"
            value={end}
            onChange={handleEndChange}
            label="End"
          />
        </FormControl>
        <FormControl size='small'>
          <InputLabel htmlFor="component-outlined">Step</InputLabel>
          <OutlinedInput
            id="component-outlined-step"
            value={step}
            onChange={handleStepChange}
            label="Step"
          />
        </FormControl>
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small">Advanced</Button>
      </CardActions>
    </Card>
  );
}
