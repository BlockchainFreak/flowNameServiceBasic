import Link from "next/link"
import { useState } from 'react'
import { useRouter } from "next/router"
import { useAuth } from "../context/AuthContext"
import "../flow/config"
import { AppBar, Toolbar, Box, Button, Tabs, Tab, Typography,
Menu, MenuItem, IconButton, Stack } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Navbar() {

    const { currentUser, logIn, logOut } = useAuth()
    const { route } = useRouter()
    const [ anchorEl, setAnchorEl ] = useState(null)

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const renderMenu = (
        <Menu
            sx={{marginRight: "2vw"}}
            anchorEl={anchorEl}
            id='primary-search-account-menu'
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
        >
            <Typography variant="subtitle1" margin='1vw'>
                {`User Address:\n${currentUser.addr}`}
            </Typography>
            <Box textAlign='center' marginTop='5vh'>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {logOut(); handleMenuClose()}}
                >
                    Log Out
                </Button>
            </Box>
        </Menu>
    )

    const currentTabValue = getTabValue(route)

    return (
        <Box>
            <AppBar position="static" sx={{bgcolor: "#1E1E1E"}}>
            <Toolbar disableGutters >

                <Tabs value={currentTabValue} TabIndicatorProps={{sx: {bgcolor: '#eee'}}}>
                    <Link href="/">
                        <Tab label="Home" {...getIdProps(0)} />
                    </Link>
                    <Link href="/purchase">
                        <Tab label="Purchase" {...getIdProps(1)} />
                    </Link>
                    <Link href="/manage">
                        <Tab label="Manage" {...getIdProps(2)} />
                    </Link>
                </Tabs>

                <Box sx={{flexGrow: 1}}/>

                {
                    currentUser.addr ? (
                    <IconButton
                        onClick={handleMenuOpen}
                        size='large'
                        aria-haspopup='true'
                        color='inherit'
                    >
                        <AccountCircle/>
                    </IconButton>
                    ) : (
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={logIn}
                        sx={{margin: "0 20px"}}
                    >
                        Log In
                    </Button>
                    )
                }
                </Toolbar>
            </AppBar>
            {renderMenu}
        </Box>
    )
}

const getIdProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
})

const getTabValue = (route) => {
    const map = {
        "/" : 0,
        "/purchase" : 1,
    }
    const value = map[route]
    return value < 2 ? value : 2
}