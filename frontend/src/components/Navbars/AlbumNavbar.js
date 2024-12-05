import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles.css';

const AlbumNavbar = () => {
  const [query, setQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length < 3) {
      setAlbums([]);
      setLoading(false);
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
    navigate(`/album/${albumId}`);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="header-container">
  <div className="header-title" onClick={() => navigate('/')}>
    SpotiBoxd
  </div>
  <div className="header-right">
    <div className="compact-search">
      <input
        type="text"
        placeholder="Search albums..."
        value={query}
        onChange={handleSearch}
        className="compact-search-bar"
      />
      {loading && <p className="loading-text">Loading...</p>}
      {!loading && albums.length > 0 && (
        <div className="compact-dropdown">
          {albums.map((album) => (
            <div
              key={album.id}
              className="album-item"
              onClick={() => handleAlbumClick(album.id)}
            >
              <img src={album.image} alt={album.name} className="album-icon" />
              <span>
                <strong>{album.name}</strong>
                <div>{album.artist}</div>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
    <button className="login-button" onClick={handleLoginClick}>
      Login
    </button>
  </div>
</header>
  );
};

export default AlbumNavbar;