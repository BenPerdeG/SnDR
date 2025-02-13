import { Outlet,Navigate } from "react-router-dom";
import {useAdmin} from './AdminContext'
import {useUser} from './UserContext'


const ProtectedRoutesUser=()=>{
    const user = useUser()
    return user ? <Outlet/> :  <Navigate to="/inicio"/> 
}

export default ProtectedRoutesUser;