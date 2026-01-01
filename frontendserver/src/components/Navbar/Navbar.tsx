import Nav from 'react-bootstrap/Nav';
import BootstrapNavbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import { SearchBar } from '../SearchBar/SearchBar';
import './Navbar.css';
import ReactCountryFlag from 'react-country-flag';
import { useState } from 'react';
import { Sidebar } from './Sidebar';

const Navbar = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const handleCloseSidebar = () => setShowSidebar(false);
    const handleShowSidebar = () => setShowSidebar(true);
    return (
        <>
            <BootstrapNavbar expand="lg" className="my-2">
                <Container className='d-flex justify-content-between align-items-center navbar-mobile-container'>
                    {/* Mobile search mode - replaces navbar content */}
                    {showSearch ? (
                        <div className="d-lg-none w-100 d-flex align-items-center gap-2 mobile-search-container">
                            <SearchBar />
                            <div className="nav-item d-flex align-items-center" onClick={() => setShowSearch(false)}>
                                <i className="bi bi-x-lg"></i>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="d-flex align-items-center navbar-normal-content">
                                {/* Hamburger Menu Icon */}
                                <div className="hamburger-icon me-3 d-lg-none"
                                    onClick={handleShowSidebar}
                                >
                                    <i className="bi bi-list fs-3"></i>
                                </div>
                                <BootstrapNavbar.Brand as={Link} to="/home" className="d-flex align-items-center gap-2">
                                    Game Key Marketplace
                                </BootstrapNavbar.Brand>
                            </div>

                            {/* Search icon only visible on small screens */}
                            <div className="d-lg-none d-flex align-items-center gap-3 navbar-normal-content">
                                <div className="nav-item" onClick={() => setShowSearch(true)}>
                                    <i className="bi bi-search"></i>
                                </div>
                            </div>
                        </>
                    )}

                    <BootstrapNavbar.Collapse id="basic-navbar-nav outline-light" className="d-none d-lg-block">
                        <Nav className="me-auto">
                            {/* Search bar */}
                            <SearchBar />

                            {/* Region & Currency Selector */}
                            <div className="nav-item d-flex flex-nowrap align-items-center gap-2 px-4 language-selector"
                                onClick={() => alert('Region, Language & Currency not implemented yet')}
                            >
                                <ReactCountryFlag
                                    countryCode="LT"
                                    svg
                                />
                                <span className="text-nowrap">English | EUR</span>
                            </div>
                        </Nav>
                        <Nav className="d-flex align-items-center gap-4">
                            {/* User Actions */}
                            <div className="nav-item"
                                onClick={() => alert('Wishlist not implemented yet')}
                            >
                                <i className="bi bi-heart"></i>
                            </div>

                            <div className="nav-item"
                                onClick={() => alert('Order cart not implemented yet')}
                            >
                                <i className="bi bi-cart"></i>
                            </div>

                            <div className="d-flex align-items-center gap-1">
                                <div className="nav-item d-flex align-items-center gap-2"
                                    onClick={() => alert('User account login not implemented yet')}
                                >
                                    <i className="bi bi-person"></i>
                                    <span className="text-nowrap">Log in</span>
                                </div>
                                <span className="nav-seperator">|</span>
                                <div className="nav-item"
                                    onClick={() => alert('User account registration not implemented yet')}
                                >
                                    <span>Register</span>
                                </div>
                            </div>

                        </Nav>
                    </BootstrapNavbar.Collapse>

                    <Sidebar show={showSidebar} onHide={handleCloseSidebar} />
                </Container>
            </BootstrapNavbar>
        </>
    );
}
export default Navbar;