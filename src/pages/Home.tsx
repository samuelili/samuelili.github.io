import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>welcome home!</h1>

            <Link to={"/insta-generator"}>
                <div className={"DiffusedBox button"}>
                    Insta-Generator
                </div>
            </Link>

            <Link to={"/pay-me-back"}>
                <div className={"DiffusedBox button"}>
                    Pay-Me-Back
                </div>
            </Link>

            <a href="/flora/">
                <div className={"DiffusedBox button"}>
                    Flora
                </div>
            </a>
        </div>
    )
}

export default Home;