import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllDomainInfos } from '../../flow/scripts'
import { Container, Typography, Grid } from '@mui/material'
import DomainCard from '../../components/DomainCard'

export default function Manage() {
  const [domainInfos, setDomainInfos] = useState([])
  const { currentUser } = useAuth()

  useEffect(() => {
      async function fetchMyDomains() {
          const allDomains = await getAllDomainInfos()
          const myDomains = allDomains.filter((dom) => {
            return dom.owner === currentUser.addr
          })
          setDomainInfos(myDomains)
      }
      fetchMyDomains()
  }, [])

  return (
    <main>
      <Container maxWidth='md'>
        {
          domainInfos.length === 0 ? (
            <Typography variant='h3' color='white' marginTop="30vh" textAlign="center">
                You have no FNS Domains have been registered yet
            </Typography>
          ) : (
            <Grid container spacing={4} marginTop="6vh">
                {domainInfos.map((info, idx) => (
                  <Grid key={idx} item xs={12} sm={6} md={4}>
                    <DomainCard domain={info} mode='personal'/>
                  </Grid>
                ))}
            </Grid>
          )
        }
      </Container>
    </main>
  )
}
