import React, { useState } from "react";
import "./SearchBar.css";

export const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = () => {
        // Fetch data from API based on search term
        // Update state with fetched data
        console.log("Fetching data for:", searchTerm);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            console.log("Search term:", searchTerm);
            fetchData();
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSearch();
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit}>
                <div className="search-input-wrapper">
                    <i className="bi bi-search search-icon" onClick={handleSearch}></i>
                    <input
                        type="text"
                        placeholder="Search for games"
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                </div>
            </form>
        </div>
    );
};

