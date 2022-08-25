import { useState, useEffect, useRef } from 'react'
import * as fcl from '@onflow/fcl'
import { useAuth } from '../context/AuthContext'
import { checkIsAvailable, getRentCost  } from '../flow/scripts'
import { initAccount, registerDomain } from '../flow/transaction'
import { Container, Box, Button, TextField, Typography, Stack } from '@mui/material'
import useModal from '../hooks/useModal'

const SECONDS_PER_YEAR = 365 * 24 * 3600

export default function Purchase() {
    const { currentUser, isInitialized, checkInit } = useAuth() 
    const [setError, ErrorModal] = useModal()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [years, setYears] = useState(1)
    const [cost, setCost] = useState(0.0)

    useEffect(()=>{
        async function func(){
            await checkInit() 
        }
        currentUser.addr && func()
    },[currentUser.addr])

    async function initialize() {
        try {
            const txID = await initAccount()
            await fcl.tx(txID).onceSealed()
            const init = await checkInit()
        } catch (error) {
            setError(error)
        }
    }

    async function purchase() {
        const duration = (years * SECONDS_PER_YEAR).toFixed(1).toString()
        try{
            setLoading(true)
            const isAvailable = await checkIsAvailable(name)
            if(!isAvailable) 
                throw new Error("Domain is not available")
            if(years <= 0) 
                throw new Error("You must rent for atleast 1 year")

            const txID = await registerDomain(name, duration)
            await fcl.tx(txID).onceSealed()
        } catch (error) {
            setError(error)
        }
        setLoading(false)
    }

    async function getCost() {
        if (name.length > 0 &&  years > 0) {
            const duration = (years * SECONDS_PER_YEAR).toFixed(1).toString()
            try {
                const _cost = await getRentCost(name, duration)
                setCost(_cost)
            } catch(e){}
        }
    }

    useEffect(() => { getCost()}, [name, years])
    if(!isInitialized) {
        return (
            <Container maxWidth='sm'>
                <Typography variant='h5' align='center' marginTop='30vh' marginBottom='6vh'>
                    Your account has not been initialized yet
                </Typography>
                <Box textAlign='center'>
                    <Button
                        variant="contained"
                        onClick={initialize}
                    >
                        Initialize Account
                    </Button>
                </Box>
                <ErrorModal/>
            </Container>
        )
    }

    return (
        <>
            <Container maxWidth='md'>
                <Stack spacing={4} marginTop={10}>
                    <Typography variant='h4'>
                        Enter Details:
                    </Typography>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Duration (in years)"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                    />
                    <Box textAlign='center'>
                        <Button
                            variant='contained'
                            disabled={loading}
                            onClick={purchase}
                        >
                            { loading ? "Loading..." : "Purchase" }
                        </Button>
                    </Box>
                    <Typography variant='h6'>
                        Cost: {cost} FLOW
                    </Typography>
                </Stack>
                <ErrorModal/>
            </Container>
        </>
    )
}
