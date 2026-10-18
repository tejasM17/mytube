import { useEffect, useRef } from "react";

export default function VideoPlayer({ video }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const videos = "/video/vdo.mp4";

    return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full"
                controls
            >
                <source
                    src={videos}
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}