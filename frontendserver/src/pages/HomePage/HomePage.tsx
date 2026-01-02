import GameCards from "../../components/GameCards/GameCards";
import HeroSection from "../../components/HeroSection/HeroSection";
import HorizontalScrollContainer from "../../components/HorizontalScrollContainer/HorizontalScrollContainer";
import { sampleGames } from "../../utils/gameUtils";

const HomePage = () => {
  // const [featuredGames, setFeaturedGames] = useState<G>();

  return (
    <div>
      <HeroSection />

      <div className="container py-5">
        <h2 className="fs-2 fw-bold text-start text-light mb-4">Featured Games</h2>
        {/* <GameCards games={sampleGames} /> */}
        <HorizontalScrollContainer games={sampleGames}/>
      </div>
    </div>
  );
}

export default HomePage;