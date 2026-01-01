import { Offcanvas, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactCountryFlag from 'react-country-flag';

interface SidebarProps {
    show: boolean;
    onHide: () => void;
}

export const Sidebar = ({ show, onHide }: SidebarProps) => {
    return (
        <Offcanvas show={show} onHide={onHide} placement='start'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav className="flex-column gap-3">
                    {/* Home */}
                    <Nav.Link
                        as={Link}
                        to="/home"
                        onClick={onHide}
                        className="d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-house-door fs-5"></i>
                        <span>Home</span>
                    </Nav.Link>

                    {/* Browse Games */}
                    <Nav.Link
                        as={Link}
                        to="/list"
                        onClick={onHide}
                        className="d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-controller fs-5"></i>
                        <span>Browse Games</span>
                    </Nav.Link>

                    {/* Wishlist */}
                    <div
                        onClick={() => alert('Wishlist not implemented yet')}
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-heart fs-5"></i>
                        <span>Wishlist</span>
                    </div>

                    {/* Cart */}
                    <div
                        onClick={() => alert('Order cart not implemented yet')}
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-cart fs-5"></i>
                        <span>Cart</span>
                    </div>
                    <hr />

                    {/* Region & Currency */}
                    <div
                        className="nav-link d-flex align-items-center gap-3"
                        onClick={() => alert('Region, Language & Currency not implemented yet')}
                    >
                        <ReactCountryFlag countryCode="LT" svg style={{ fontSize: '1.5rem' }} />
                        <div>
                            <div>English</div>
                            <small className="text-muted">EUR - Lithuania</small>
                        </div>
                    </div>

                    <hr />

                    {/* Account */}
                    <div
                        onClick={() => alert('User account login not implemented yet')}
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-person fs-5"></i>
                        <span>Log in</span>
                    </div>

                    <div
                        onClick={() => alert('User account registration not implemented yet')}
                        className="nav-link d-flex align-items-center gap-3"
                    >
                        <i className="bi bi-person-plus fs-5"></i>
                        <span>Register</span>
                    </div>
                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    );
};
