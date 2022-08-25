import { useState } from "react"
import { Modal, Box, Typography } from '@mui/material'

export default function useModal() {
    const [message, setMessage] = useState('')

    function clearMessage() {
        setMessage('')
    }

    function safeSetter(msg) {
        setMessage(msg.toString())
    }

    const ErrorModal = () => (
        <Modal
            open={message.length > 0}
            onClose={clearMessage}
        >
            <Box sx={style}>
                <Typography variant='h6'>
                    Error:
                </Typography>
                <Typography>
                    {message.toString()}
                </Typography>
            </Box>
        </Modal>
    )

    return [safeSetter, ErrorModal]
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};