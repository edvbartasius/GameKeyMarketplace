import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GameCards.css';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';
import { Game } from "../../utils/types";

interface GameCardsProps {
  games: Game[];
}

const GameCards: React.FC<GameCardsProps> = ({ games }) => {
  return (
      <Container className='px-0'>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
          {games.map((game) => {
            const discountPercent = game.discountedPrice
              ? Math.round((1 - game.discountedPrice / game.price) * 100)
              : 0;

            return (
              <Col key={`${game.id}-${game.platform.name}-${game.region}`} className="equal-height-col">
                <Card className={`game-card rounded-0 ${!game.inStock ? 'sold-out-card' : ''}`}>
                  <div className="game-card-img-wrapper position-relative">
                    <Card.Img
                      variant="top"
                      src={game.image}
                      alt={game.name}
                      className="game-card-img-top rounded-0 text-white"
                    />
                  </div>

                  <Card.Body className="card-info-section px-3 pt-3 text-start">
                    <div className="platform-overlay platform-badge d-flex align-items-center gap-2 px-3 py-2">
                      {game.platform.icon && (
                        <img src={game.platform.icon} alt={game.platform.name} className="platform-icon" />
                      )}
                      <span className="platform-name">{game.platform.name}</span>
                    </div>
                    {/* Row 1: Title with overflow hidden */}
                    <div className="title-row">
                      <Card.Title className="game-name mb-0 text-start" title={game.name}>{game.name}</Card.Title>
                    </div>
                    
                    {/* Row 2: Region display */}
                    <div className="region-row mt-1">
                      <div className={`region-text ${game.regionAvailable ? 'region-available' : 'region-unavailable'}`}>
                        {game.region}
                      </div>
                    </div>
                    
                    {/* Row 3: "From" text with base price crossed out and discount percentage */}
                    <div className="price-from-row mt-2">
                      {game.discountedPrice ? (
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="from-text">From</span>
                          <span className="base-price">€{game.price.toFixed(2)}</span>
                          <span className="discount-percent">-{discountPercent}%</span>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          <span className="from-text">From</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Row 4: Final price or sold out text */}
                    <div className="final-price-row mt-0 mb-3">
                      {!game.inStock ? (
                        <div className="sold-out-text">
                          Sold Out
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          <span className={game.discountedPrice ? "discounted-price" : "regular-price"}>
                            €{(game.discountedPrice || game.price).toFixed(2)}
                          </span>
                          <InfoTooltip text="Price is not final, service fees apply at checkout" />
                        </div>
                      )}
                    </div>

                    {game.inStock && (
                      <div className="card-actions d-flex flex-column gap-2">
                        <Button className="btn-add-cart w-100 py-2 rounded-0" onClick={() => alert("Order cart not implemented yet")}>
                          Add to Cart
                        </Button>
                        <Button className="btn-explore w-100 py-2 rounded-0" onClick={() => alert("Explore options not implemented yet")}>
                          Explore Options
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
  );
};

export default GameCards;