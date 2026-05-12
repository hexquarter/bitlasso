import { Route, Routes } from "react-router"
import { LoginPage } from "./pages/app/LoginPage"
// import { PasskeyPage } from "./pages/PasskeyPage"

export const Auth = () => {
    return (
        <Routes>
            <Route path='/' Component={LoginPage} />
            {/* <Route path='/passkey' Component={PasskeyPage} /> */}
        </Routes>
    )
}