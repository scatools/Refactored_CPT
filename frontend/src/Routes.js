import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Main from './Main';
import Help from './Help';
import Report from "./Report";
import Assessment from "./Assessment";

const Routes = () =>{
    const [ aoiSelected, setAoiSelected ] = useState(null);
    const [ aoiAssembled, setAoiAssembled ] = useState([]);
    return (
        <Switch>
            <Route exact path="/">
                <Main 
                    aoiSelected={aoiSelected}
                    setAoiSelected={setAoiSelected}
                    aoiAssembled={aoiAssembled}
                    setAoiAssembled={setAoiAssembled}
                />
            </Route>
            <Route exact path="/help">
                <Help/>
            </Route>
            <Route exact path="/report">
                <Report aoiSelected={aoiSelected}/>
            </Route>
            <Route exact path="/assessment">
                <Assessment aoiAssembled={aoiAssembled}/>
            </Route>
            <Route>
                <Redirect to="/"/>
            </Route>
        </Switch>
    )
}

export default Routes