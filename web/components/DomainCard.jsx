import {useState} from 'react'
import { Typography, Stack, Button, Modal, Box } from '@mui/material'
import Link from 'next/link'

export default function DomainCard({domain, mode}) {

    const [open, setOpen] = useState(false)

    if(mode == 'personal' || mode === 'manage') return (
        <Stack spacing={1} sx={{
            bgcolor: 'transparent',
            padding: '1em',
            borderRadius: '1em',
            boxShadow: 3,
            '&:hover': {
                bgcolor: 'transparent',
            }
        }}>
            <Typography variant='h6' textAlign='center' color='black'>
                {domain.name}
            </Typography>
            <Field name="Address" value={domain.address ? domain.address : "None"} mode={mode}/>
            <Field name="Bio" value={domain.bio ? domain.bio : "None"} mode={mode}/>
            <Field name="Created At" value={new Date(parseInt(domain.createdAt)*1000).toLocaleDateString()} mode={mode}/>
            <Field name="Expires At" value={new Date(parseInt(domain.expiresAt)*1000).toLocaleDateString()} mode={mode}/>
            {mode === 'personal' && (
                <Link href={`/manage/${domain.nameHash}`}>
                    <Button variant='contained'>
                        Manage
                    </Button>
                </Link>
            )}
        </Stack>
    )

    return(
        <>
            <Button sx={{
                background: "linear-gradient(102deg, #351489, #7194d4)",
                width: '100%',
                font: "Helvetica",
                color: "white",
                padding: "40px 40px",
                boxShadow: '12',
                '&:hover' : {sx: {background: 'linear-gradient(102deg, #452499, #81a4e4)'}}
            }}
                alignText="center"
                onClick={() => setOpen(true)}
            >
                <strong>{domain.name}</strong>
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={ModalBoxStyles}>
                    <Stack spacing={1}>
                        <Typography variant='h6' textAlign='center' color='white'>
                            {domain.name}
                        </Typography>
                        <Field name="Address" value={domain.address ? domain.address : "None"} mode={mode}/>
                        <Field name="Bio" value={domain.bio ? domain.bio : "None"} mode={mode}/>
                        <Field name="Created At" value={new Date(parseInt(domain.createdAt)*1000).toLocaleDateString()} mode={mode}/>
                        <Field name="Expires At" value={new Date(parseInt(domain.expiresAt)*1000).toLocaleDateString()} mode={mode}/>
                        {
                            mode === 'personal' && (
                                <Link href={`/manage/${domain.nameHash}`}>
                                    <Button variant='contained'>
                                        Manage
                                    </Button>
                                </Link>
                            )
                        }
                    </Stack>
                </Box>
            </Modal>
        </>
    )
}

function Field({name, value, mode}){
    return(
        <Typography variant='p' color={mode === 'personal' ? 'black' :'white'}>
            {`${name}: ${value}`}
        </Typography>
    )
}

function generateRandomGradient() {

    const hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];
    
    function generateRandomHexColor() {
        let color = '#'
        for( let i = 0; i < 6; i++ ) {
            color += hexValues[Math.round( Math.random() * 14 )];
      }
      return color;
    }
    
    const newColor1 = generateRandomHexColor();
    const newColor2 = generateRandomHexColor();
    const angle = Math.round( Math.random() * 360 );
    const gradient = "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";
    
    return gradient
}

const ModalBoxStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#282828',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };