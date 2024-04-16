function VideoPlayer({ videoId }) {
    if (!videoId) {
        return (
          <div className="video-player-placeholder">
            <p>No video available for this lecture.</p>
          </div>
        );
    }

    
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
    return (
      <iframe
        className="video-player"
        width="750"
        height="422"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen>
      </iframe>
    );
}

export default VideoPlayer;