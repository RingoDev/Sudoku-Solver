import React from "react";
import {Route, Switch} from "react-router-dom";
import Picture from "./Picture";
import Video from "./Video";

const Scanner: React.FC = () => {
    return (
        <>
            <Switch>
                <Route path="/scanner/video">
                    <Video/>
                </Route>
                <Route path="/scanner/picture">
                    <Picture/>
                </Route>
                <Route path={"/scanner"}>
                    <Picture/>
                </Route>
                <Route path={"/"}>
                    <Picture/>
                </Route>
            </Switch>

        </>
    )
}

export default Scanner
