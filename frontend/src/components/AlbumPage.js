import React, { useEffect, useState } from 'react';
import ColorThief from 'colorthief'; // Ensure this is installed
import { useParams } from 'react-router-dom';

function AlbumPage() {


  const [colors, setColors] = useState({
    vibrant: '#1db954', // Default Spotify green
    darkVibrant: '#121212', // Default dark background
    muted: '#2c2c2c', // Default muted color
  });
  const [hoveredTrack, setHoveredTrack] = useState(null); // To track hovered track
  const { albumId } = useParams();
  const [data, setData] = useState(null);

  // Utility to calculate brightness
  const getBrightness = (rgb) => {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return r * 0.299 + g * 0.587 + b * 0.114; // Standard brightness formula
  };

  // Utility to sort colors by brightness
  const sortColorsByBrightness = (palette) => {
    return palette
      .map((rgb) => `rgb(${rgb.join(',')})`)
      .sort((a, b) => getBrightness(b) - getBrightness(a));
  };

  useEffect(() => {

    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/album_details/?album_id=${albumId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch album and artist details');
        }
        const result = await response.json();
        setData(result);

        // Extract colors from the album image
        if (result.album.image) {
          const img = new Image();
          img.crossOrigin = 'Anonymous'; // Ensure cross-origin support
          img.src = result.album.image;

          img.onload = () => {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 5); // Get a palette of 5 colors
            const sortedColors = sortColorsByBrightness(palette);

            // Assign sorted colors to roles
            setColors({
              vibrant: sortedColors[0], // Most vibrant color
              darkVibrant: sortedColors[4], // Dark muted for background
              muted: sortedColors[3], // Muted for accents
              secondary: sortedColors[1], // Secondary vibrant
              tertiary: sortedColors[2], // Tertiary color
            });
          };
        }
      } catch (error) {
        console.error('Error fetching details:', error.message);
      }
    };

    fetchDetails();
  }, [albumId]);

  useEffect(() => {
    document.body.style.backgroundColor = colors.darkVibrant;
    return () => {
      document.body.style.backgroundColor = ''; // Reset on unmount
    };
  }, [colors]);

  if (!data) {
    return <p>Loading...</p>;
  }

  const { album, artist } = data;

  // Redirect to Spotify album page
  const handleAlbumClick = () => {
    window.open(`https://open.spotify.com/album/${album.id}`);
  };

  // Redirect to Spotify player for the specific track
  const handleTrackClick = (trackId) => {
    window.open(`https://open.spotify.com/track/${trackId}`);
  };

  return (
    <div
      className='album-container'
      style={{
        minHeight: '100vh',
        backgroundColor: colors.darkVibrant,
        color: colors.muted,
        padding: '20px',
      }}
    >
      {/* Album Name and Artist */}
      <h1
        onClick={handleAlbumClick}
        style={{
          color: colors.vibrant,
          textShadow: `3px 3px 0px ${colors.muted}`,
          marginBottom: '20px',
          cursor: 'pointer',
        }}
      >
        {album.name} by {artist.name}
      </h1>

      {/* Album Art */}
      {album.image && (
        <img
          src={album.image}
          alt={album.name}
          onClick={handleAlbumClick}
          style={{
            width: '300px',
            height: '300px',
            marginTop: '20px',
            borderRadius: '15px',
            boxShadow: `0px 0px 25px ${colors.secondary}`,
            cursor: 'pointer',
          }}
        />
      )}

      {/* List of Songs */}
      <h2
        style={{
          color: colors.secondary,
          marginTop: '30px',
          textShadow: `2px 2px 0px ${colors.darkVibrant}`,
        }}
      >
        Track List
      </h2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '20px auto',
          maxWidth: '600px',
          borderRadius: '10px',
        }}
      >
        {album.tracks.map((track) => (
          <li
            key={track.track_number}
            onClick={() => handleTrackClick(track.id)} // Navigate to track on Spotify
            onMouseEnter={() => setHoveredTrack(track.track_number)}
            onMouseLeave={() => setHoveredTrack(null)}
            style={{
              padding: '10px',
              border: `3px solid ${
                hoveredTrack === track.track_number ? colors.vibrant : colors.muted
              }`,
              color: hoveredTrack === track.track_number ? colors.darkVibrant : colors.secondary,
              backgroundColor:
                hoveredTrack === track.track_number ? colors.muted : 'transparent',
              transition: 'background-color 0.3s, color 0.3s',
              cursor: 'pointer',
            }}
          >
            {track.track_number}. {track.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlbumPage;