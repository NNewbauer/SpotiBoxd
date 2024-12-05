import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const AlbumSearch = () => {


  const [query, setQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length < 3) {
      setAlbums([]); // Clear suggestions if query is too short
      return;
    }

    setLoading(true);
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/search_albums/?q=${value}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Backend error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch albums');
        }
        const data = await response.json();
        setAlbums(data.albums);
      } catch (error) {
        console.error('Error fetching albums:', error.message);
      } finally {
      setLoading(false);
    }
  };

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`); // Navigate to album page using the album ID
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search for an album..."
        value={query}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="dropdown">
        {loading && <p className="loading-text">Loading...</p>}
        {!loading &&
          albums.length > 0 &&
          albums.map((album) => (
            <div
              key={album.id}
              className="album-item"
              onClick={() => handleAlbumClick(album.id)} // Navigate on click
              style={{ cursor: 'pointer' }}
            >
              {/* Album Icon */}
              <img src={album.image} alt={album.name} className="album-icon" />
  
              {/* Text Container */}
              <span>
                <strong>{album.name}</strong>
                <div>{album.artist}</div>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AlbumSearch;