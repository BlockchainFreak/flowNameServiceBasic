import { useState, useEffect } from 'react'
import { getAllDomainInfos } from '../flow/scripts'
import DomainCard from '../components/DomainCard'
import { Container, Grid, Typography } from '@mui/material'

export default function Home() {
    
    const [domainInfos, setDomainInfos] = useState([])

    useEffect(() => {
        async function fetchDomains() {
            const info = await getAllDomainInfos()
            setDomainInfos(info)
        }
        fetchDomains()
    }, [])

    return (
        <main>
            <Container maxWidth='md'>
                {
                    domainInfos.length === 0 ? (
                        <Typography variant='h3' color='white' marginTop="30vh" textAlign="center">
                            No FNS Domains have been registered yet
                        </Typography>
                    ) : (
                        <Grid container spacing={4} marginTop="6vh">
                            {domainInfos.map((info, idx) => (
                                <Grid key={idx} item xs={12} sm={6} md={4}>
                                    <DomainCard domain={info}/>
                                </Grid>
                            ))}
                        </Grid>
                    )
                }
            </Container>
        </main>
    )
}
