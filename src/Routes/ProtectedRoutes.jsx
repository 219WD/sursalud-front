import { Navigate } from "react-router-dom"

const ProtectedRoutes = ({ children }) => {
    const auth = false

    if(auth){
        return children
    }else{
        return (
            <Navigate to="/" />
        )
    }
}

export default ProtectedRoutes