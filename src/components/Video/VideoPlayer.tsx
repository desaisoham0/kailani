import React, { useState, useRef } from 'react';

interface VideoPlayerProps {
    source?: string;
    borderRadius?: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    source = '',
    borderRadius = '0.5rem',
    autoplay = false,
    muted = false,
    loop = false,
    controls = true,
}) => {
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="relative w-full">
            <video
                ref={videoRef}
                className={`w-full h-auto object-cover`}
                style={{ borderRadius }}
                autoPlay={autoplay}
                muted={muted}
                loop={loop}
                playsInline
                onEnded={() => setIsPlaying(false)}
            >
                <source src={source} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {controls && (
                <div className="absolute bottom-4 right-4 transform bg-gray-400 bg-opacity-90 rounded-full p-1">
                    <button
                        onClick={handlePlayPause}
                        className="text-white focus:outline-none w-10 h-10 flex items-center justify-center cursor-pointer"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};