import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchResult } from "../../utils/types";
import api from "../../services/api";
import "./SearchBar.css";
import { Button } from "react-bootstrap";
import { SearchResultCard } from "../SearchResultCard/SearchResultCard";

export const SearchBar = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                const response = await api.get(`/list?search=${encodeURIComponent(searchTerm)}`);
                // API returns { success, count, searchTerm, data: [...] }
                const results = response.data.data || [];
                setFilteredResults(results);
                setShowDropdown(true);
            } catch (error) {
                setFilteredResults([]);
                setShowDropdown(false);
            }
        };

        debounceTimeoutRef.current = setTimeout(() => {
            fetchData();
        }, 300);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    const handleResultClick = (result: SearchResult) => {
        setSearchTerm(result.title);
        setShowDropdown(false);
        alert(`Clicked on ${result.title}. Game detail page not implemented yet`)
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

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            return;
        }

        // Clear any pending debounced search
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        setShowDropdown(false);

        // Fetch fresh results immediately
        try {
            const response = await api.get(`/list?search=${encodeURIComponent(searchTerm)}`);
            const results = response.data.data || [];
            navigate(`/list?search=${encodeURIComponent(searchTerm)}`, {
                state: { searchResults: results, searchTerm }
            });
        } catch (error) {
            // Navigate anyway even if the fetch fails
            navigate(`/list?search=${encodeURIComponent(searchTerm)}`, {
                state: { searchResults: [], searchTerm }
            });
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSearch();
    };

    const handleSearchIconClick = () => {
        handleSearch();
    };

    return (
        <div className="search-bar-container" ref={searchRef}>
            <form onSubmit={handleSubmit}>
                <div className="search-input-wrapper">
                    <i className="bi bi-search search-icon" onClick={handleSearchIconClick} style={{ cursor: 'pointer' }}></i>
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
                                {filteredResults.slice(0, 10).map((result) => (
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
                                    navigate(`/list?search=${encodeURIComponent(searchTerm)}`, {
                                        state: { searchResults: filteredResults, searchTerm }
                                    });
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
                                    navigate('/list');
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

