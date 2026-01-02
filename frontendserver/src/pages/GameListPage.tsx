import { useEffect, useState } from "react";
import GameCards from "../components/GameCards/GameCards";
import api from "../services/api";
import { Game, GameData } from "../utils/types";
import { transformGameData } from "../utils/gameUtils";

export default function GameListPage() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching game list...');
        const response = await api.get('/list');
        const results: GameData[] = response.data.data || [];
        console.log('Game list fetched:', results);

        // Transform backend data to frontend Game type
        // Region availability is now calculated server-side
        const transformedGames = results.map(gameData => transformGameData(gameData));
        setGames(transformedGames);
      } catch (error) {
        console.error('Error fetching game list:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container py-5">

      <section className="mb-5">
        <h2 className="fs-3 fw-bold text-start text-light mb-3">Featured Titles</h2>
        <GameCards games={games} />
      </section>
    </div>
  );
}
