import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GameCards.css';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';

export interface Platform {
  name: string;
  icon: string;
}

export interface Game {
  id: number;
  name: string;
  image: string;
  platform: Platform;
  price: number;
  discountedPrice: number | null;
  inStock: boolean;
  region: string;
  regionAvailable: boolean;
}

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
              <Col key={game.id} className="equal-height-col">
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
                      <img src={game.platform.icon} alt={game.platform.name} className="platform-icon" />
                      <span className="platform-name">{game.platform.name}</span>
                    </div>
                    <Card.Title className="game-name mb-0 text-start">{game.name}</Card.Title>
                    <div className={`region-text mt-1 ${game.regionAvailable ? 'region-available' : 'region-unavailable'}`}>
                      {game.region}
                    </div>
                    
                    {!game.inStock ? (
                      <div className="sold-out-badge text-white d-inline-block px-0 rounded-0">
                        Sold Out
                      </div>
                    ) : (
                      <>
                        {game.discountedPrice ? (
                          <div className="mb-3">
                            <div className="d-flex align-items-center gap-2 mb-0 flex-wrap">
                              <span className="from-text">From</span>
                              <span className="base-price">${game.price.toFixed(2)}</span>
                              <span className="discount-percent">-{discountPercent}%</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 pb-1">
                              <span className="discounted-price">${game.discountedPrice.toFixed(2)}</span>
                              <InfoTooltip text="Price is not final, service fees apply at checkout" />
                            </div>
                          </div>
                        ) : (
                          <div className="mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <span className="regular-price">${game.price.toFixed(2)}</span>
                              <InfoTooltip text="Price is not final, service fees apply at checkout" />
                            </div>
                          </div>
                        )}

                        <div className="card-actions d-flex flex-column gap-2">
                          <Button className="btn-add-cart w-100 py-2 rounded-0" onClick={() => alert("Order cart not implemented yet")}>
                            Add to Cart
                          </Button>
                          <Button className="btn-explore w-100 py-2 rounded-0" onClick={() => alert("Explore options not implemented yet")}>
                            Explore Options
                          </Button>
                        </div>
                      </>
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