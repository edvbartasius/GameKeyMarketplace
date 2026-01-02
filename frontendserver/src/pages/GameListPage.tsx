import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import GameCards from "../components/GameCards/GameCards";
import api from "../services/api";
import { Game, GameData } from "../utils/types";
import { transformGameData } from "../utils/gameUtils";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function GameListPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check if we have search results passed from navigation state
        if (location.state?.searchResults && location.state?.searchTerm === searchQuery) {
          // Use the passed data without refetching
          const results: GameData[] = location.state.searchResults;
          const transformedGames = results.map(gameData => transformGameData(gameData));
          setGames(transformedGames);
        } else {
          // Fetch data from API
          const endpoint = searchQuery ? `/list?search=${encodeURIComponent(searchQuery)}` : '/list';
          const response = await api.get(endpoint);
          const results: GameData[] = response.data.data || [];

          // Transform backend data to frontend Game type
          // Region availability is now calculated server-side
          const transformedGames = results.map(gameData => transformGameData(gameData));
          setGames(transformedGames);
        }
      } catch (error) {
        console.error('Error fetching game list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, location.state]);

  const pageTitle = searchQuery ? `Showing ${games.length} Results for "${searchQuery}"` : "Featured Titles";

  return (
    <div className="container py-5">

      <section className="mb-5">
        <h2 className="fs-3 fw-bold text-start text-light mb-3">{pageTitle}</h2>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <LoadingSpinner />
          </div>
        ) : games.length > 0 ? (
          <GameCards games={games} />
        ) : (
          <div className="text-center text-light py-5">
            <p className="fs-5">No games found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
          </div>
        )}
      </section>
    </div>
  );
}
