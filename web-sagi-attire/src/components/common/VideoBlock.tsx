import { CardMedia, Box, CircularProgress } from "@mui/material";
import { useRef, useState } from "react";

interface VideoBlockProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

const VideoBlock = ({ url, className, style }: VideoBlockProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleMouseEnter = () => {
    if (videoRef.current && !error) {
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
        setError("Failed to play video");
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef?.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError("Failed to load video");
    setIsLoading(false);
  };

  return (
    <Box position="relative" width="100%" height="100%">
      {isLoading && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
      <CardMedia
        ref={videoRef}
        component="video"
        src={url}
        playsInline
        muted
        loop
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onLoadedData={handleLoadedData}
        onError={handleError}
        controlsList="nodownload fullscreen noremoteplayback"
        disablePictureInPicture
        className={className}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...style,
        }}
      />
    </Box>
  );
};

export default VideoBlock;
