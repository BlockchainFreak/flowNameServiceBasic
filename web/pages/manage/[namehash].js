import * as fcl from '@onflow/fcl'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'
import { getDomainInfoByNameHash, getRentCost } from '../../flow/scripts'
import { renewDomain, updateAddress, updateBio} from '../../flow/transaction'
import DomainCard from '../../components/DomainCard'
import { Container, Box, Stack, Typography, TextField, Button, Grid} from '@mui/material'
import useModal from '../../hooks/useModal'

const SECONDS_PER_YEAR = 365 * 24 * 3600

export default function namehash() {

  const { currentUser, isInitialized, checkInit } = useAuth()
  const [setError, ErrorModal] = useModal()
  const router = useRouter()
  const bioRef = useRef()
  const addressRef = useRef()
  const [domainInfo, setDomainInfo] = useState()
  const [renewFor, setRenewFor] = useState(1)
  const [loading, setLoading] = useState(false)
  const [cost , setCost] = useState(0.0)

  async function loadDomainInfo(){
    try{
      const info = await getDomainInfoByNameHash(
        currentUser.addr,
        router.query.namehash
      )
      setDomainInfo(info)
    } catch (error) {
      setError(error)
    }
  }

  async function updateBioHelper() {
    try{
      setLoading(true)
      const txId = await updateBio(
        router.query.namehash,
        bioRef.current.value
      )
      await fcl.tx(txId).onceSealed()
      await loadDomainInfo()
    } catch (error){
      setError(error)
    }
    setLoading(false)
  }

  async function updateAddressHelper() {
    try{
      setLoading(true)
      const txId = await updateAddress(
        router.query.namehash,
        addressRef.current.value
      )
      await fcl.tx(txId).onceSealed()
      await loadDomainInfo()
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  async function renew() {
    try{
      setLoading(true)
      if(renewFor <= 0)
        throw new Error("Must be Renewing for atleast one year")
      const duration = (renewFor * SECONDS_PER_YEAR).toFixed(1).toString()
      const txId = await renewDomain(
        domainInfo.name.replace('.fns',''),
        duration
      )
      await fcl.tx(txId).onceSealed()
      await loadDomainInfo()
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  async function getCost() {
    if(domainInfo && domainInfo.name.replace('.fns','').length > 0 && renewFor > 0){
      const duration = (renewFor * SECONDS_PER_YEAR).toFixed(1).toString()
      const _cost = await getRentCost(
        domainInfo.name.replace('.fns',''),
        duration
      )
      setCost(_cost)
    }
  }

  useEffect(() => {
    async function init(){await checkInit()}
    currentUser.addr && init()
    console.log(router, isInitialized)
    if(router && router.query && isInitialized){
      loadDomainInfo()
    }
  }, [router, isInitialized])

  useEffect(() => {
    getCost()
  }, [domainInfo, renewFor])

  if(!domainInfo)
    return <div>No Domain Exist</div>

  return (
    <Container sx={{marginTop: '15vh'}}>
      <Grid container spacing={4}>
        <Grid item md={6} sm={6} xs={12}>
          <Box sx={{boxShadow: 3}}>
            <DomainCard domain={domainInfo} mode='manage'/>
          </Box>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Stack spacing={1} minWidth='20vw'>

            <TextField label='Bio' inputRef={bioRef}/>
            <Box textAlign='right'>
              <Button variant='contained' onClick={updateBioHelper}>Set</Button>
            </Box>

            <TextField label='Address' inputRef={addressRef}/>
            <Box textAlign='right'>
              <Button variant='contained' onClick={updateAddressHelper}>Set</Button>
            </Box>

            <TextField 
              label='renew' 
              value={renewFor} 
              onChange={(e) => setRenewFor(e.target.value)}
            />
            <Stack direction='row'>
              <Typography>
                Renewal Fees: {cost} FLOW
              </Typography>
              <Box sx={{flexGrow: 1}}/>
              <Button variant='contained' onClick={renew}>Renew</Button>
            </Stack>

          </Stack>
        </Grid>
      </Grid>
      <ErrorModal/>
    </Container>
  )
}
