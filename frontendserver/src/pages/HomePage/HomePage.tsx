import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import HeroSection from "../../components/HeroSection/HeroSection";
import HorizontalScrollContainer from "../../components/HorizontalScrollContainer/HorizontalScrollContainer";
import api from "../../services/api";
import { Game, GameData } from "../../utils/types";
import { transformGameData, getGeoInfo } from "../../utils/gameUtils";

const HomePage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // First, get user country
      const country = await getGeoInfo();

      // TODO: create backend endpoint to get more customized game list
      // Instead of filtering in the client
      try {
        const response = await api.get('/list');
        const results: GameData[] = response.data.data || [];

        // Transform backend data to frontend Game type and limit to 10
        const transformedGames = results
          .map(gameData => transformGameData(gameData, country?.countryCode))
          .filter(game => game.regionAvailable === true)
          .slice(0, 10);
        setGames(transformedGames);
      } catch (error) {
        console.error('Error fetching game list:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <HeroSection />
      <div className="container py-5">
        <h2 className="fs-2 fw-bold text-start text-light mb-4">Recomended Games</h2>
        <HorizontalScrollContainer games={games}/>
        <div className="text-center mt-4">
          <Button className="btn-add-cart w-50 py-2 rounded-0" onClick={() => {
            navigate("/list");
            window.scrollTo(0, 0);
          }}>
            Browse All Games
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;