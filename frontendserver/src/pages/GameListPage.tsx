import GameCards from "../components/GameCards/GameCards";
import { sampleGames } from "../utils/gameUtils";

export default function GameListPage() {
  return (
    <div className="container py-5">

      <section className="mb-5">
        <h2 className="fs-3 fw-bold text-start text-light mb-3">Featured Titles</h2>
        <GameCards games={sampleGames} />
      </section>
    </div>
  );
}
