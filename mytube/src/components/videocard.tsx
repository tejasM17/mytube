import Link from 'next/link';
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const videos = "/video/vdo.mp4";
type Video = {
    _id: string;
    videotitle: string;
    videochanel: string;
    views: number;
    createdAt: string;
};

const Videocard = ({ video }: { video: Video }) => {
    return (
        <Link href={`/watch/${video._id}`} className="group">
            <div className="space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                    <video
                        src={videos}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">10:24
                    </div>
                </div>
                <div className="flex gap-3">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarFallback className="bg-[#f2f2f2] text-sm font-medium">{video.videochanel[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
                            {video.videotitle}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{video.videochanel}</p>
                        <p className="text-sm text-gray-600">
                            {video?.views.toLocaleString()} views •{" "}
                            {formatDistanceToNow(new Date(video?.createdAt))} ago
                        </p>
                    </div>
                </div>

            </div>
        </Link>
    )
}

export default Videocard
