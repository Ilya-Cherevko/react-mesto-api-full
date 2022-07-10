import {Redirect, Route} from "react-router-dom";
//import Header from "./Header";

function ProtectedRoute({isLoggedIn, isPreloader, onLoggOut, userEmail, component: Component, ...props}) {

    return (
        <Route>
            {isLoggedIn ?
                <Component {...props} /> :
                <Redirect to='/sign-in'/>
            }
        </Route>
    )
}

export default ProtectedRoute;