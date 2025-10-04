import { DropdownButton } from "../components/common/buttons/DropdownButton";
import Header from "../components/common/Header";
import Styles from "./Home.module.css";
import HeroSearchbar from "../components/home/HeroSearchbar";

function Home() {
  return (
    <div>
      <Header />
      <div className={Styles["homepage-container"]}>
        <div className={Styles["hero-section"]}>
          <h2>Your search for the perfect place starts here.</h2>
          <HeroSearchbar />
          <red-link>Additional filters...</red-link>
        </div>
      </div>
    </div>
  );
}

export default Home;
