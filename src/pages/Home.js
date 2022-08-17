import React from 'react';
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>welcome home!</h1>

            <Link to={"/insta-generator"}>
            <div className={"DiffusedBox button"}>
                Insta-Generator
            </div>
            </Link>
        </div>
    )
}

export default Home;