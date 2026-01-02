import React, { useEffect, useRef, useState } from "react";
import { SearchResult } from "../../utils/types";
import api from "../../services/api";
import "./SearchBar.css";
import { Button } from "react-bootstrap";
import { SearchResultCard } from "../SearchResultCard/SearchResultCard";

export const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search effect
    useEffect(() => {
        const fetchData = async () => {
            if (!searchTerm.trim()) {
                setFilteredResults([]);
                setShowDropdown(false);
                return;
            }

            try {
                console.log('Search term:', searchTerm);
                const response = await api.get(`/list?search=${encodeURIComponent(searchTerm)}`);
                console.log('Search results:', response.data);
                // API returns { success, count, searchTerm, data: [...] }
                const results = response.data.data || [];
                setFilteredResults(results);
                console.log('Filtered results:', results);
                setShowDropdown(true);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setFilteredResults([]);
                setShowDropdown(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleResultClick = (result: SearchResult) => {
        console.log('Selected:', result);
        setSearchTerm(result.title);
        setShowDropdown(false);
        alert("Game info page not implemented yet");
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleInputFocus = () => {
        // Show dropdown if there's a search term (even if no results)
        if (searchTerm.trim()) {
            setShowDropdown(true);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <div className="search-bar-container" ref={searchRef}>
            <form onSubmit={handleSubmit}>
                <div className="search-input-wrapper">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        placeholder="Search for games"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                    />
                </div>
            </form>

            {showDropdown && (
                <div className="search-dropdown">
                    {filteredResults.length > 0 ? (
                        <>
                            <div className="results-list">
                                {filteredResults.map((result) => (
                                    <SearchResultCard
                                        key={result.id}
                                        result={result}
                                        onClick={handleResultClick}
                                    />
                                ))}
                            </div>
                            <Button
                                className="btn-show-all-results rounded-0 py-2"
                                onClick={() => {
                                    setShowDropdown(false);
                                    alert(`Show all results for "${searchTerm}" - Results page not implemented yet`);
                                }}
                            >
                                Show All {filteredResults.length} Results
                            </Button>
                        </>
                    ) : (
                        <div className="no-results">
                            <div className="py-3 px-3">
                                <span>No results found for "{searchTerm}"</span><br />
                                <span className="small">Please check your spelling, try different keywords, or browse our product catalog</span>
                            </div>
                            <Button
                                className="btn-view-all-games rounded-0 py-2"
                                onClick={() => {
                                    setShowDropdown(false);
                                    alert(`Show all games page not implemented yet`);
                                }}
                            >
                                View All Games
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

