import { Link } from "react-router-dom";
import Hero from "../components/Hero";

const Home = () => {
  return (
    <>
      <Hero />
      <div>
        <h1>My Projects</h1>

        <Link to={"/insta-generator"}>
          <div className={"DiffusedBox button"}>{">"} Insta-Generator</div>
        </Link>

        <Link to={"/film-scan-light"}>
          <div className={"DiffusedBox button"}>{">"} Film-Scan-Light</div>
        </Link>

        <a href="https://gimmemy.money">
          <div className={"DiffusedBox button"}>{">"} Pay-Me-Back</div>
        </a>

        <a href="/flora/">
          <div className={"DiffusedBox button"}>{">"} Flora</div>
        </a>
      </div>
    </>
  );
};

export default Home;
