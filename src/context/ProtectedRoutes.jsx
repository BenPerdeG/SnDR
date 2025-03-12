import { Outlet,Navigate } from "react-router-dom";
import {useUser} from './UserContext'


const ProtectedRoutesUser=()=>{
    const {user} = useUser()
    return user ? <Outlet/> :  <Navigate to="/login"/> 
}

export default ProtectedRoutesUser;