import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WatchLaterItem {
    _id: string;
    videoid: string;
    viewer: string;
    addedAt: string;
    video: {
        _id: string;
        videotitle: string;
        videochanel: string;
        views: number;
        createdAt: string;
    };

}

export default function WatchLaterContent() {
    const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
    const [loading, setLoading] = useState(true);
    //   const { user } = useUser();
    const user = {
        _id: "1",
        name: "Tejas M",
        email: "tej@example.com",
        image: "https://github.com/shadcn.png?height=32&width=32",
    };
    useEffect(() => {
        if (user) {
            loadWatchLater();
        } else {
            setLoading(true);
        }
    }, []);

    const loadWatchLater = async () => {
        if (!user) return;

        try {
            const watchLaterData: WatchLaterItem[] = [
                {
                    _id: "h1",
                    videoid: "1",
                    viewer: user._id,
                    addedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
                    video: {
                        _id: "1",
                        videotitle: "NewYork City Tour",
                        videochanel: "Travel Vlogs",
                        views: 1000,
                        createdAt: new Date().toISOString(),
                    }
                },
                {
                    _id: "h2",
                    videoid: "2",
                    viewer: user._id,
                    addedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
                    video: {
                        _id: "1",
                        videotitle: "NewYork City Tour",
                        videochanel: "Travel Vlogs",
                        views: 1000,
                        createdAt: new Date().toISOString(),
                    },
                }
            ];
            setWatchLater(watchLaterData);
        } catch (error) {
            console.error("Error loading watch later videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWatchLater = async (watchLaterId: string) => {
        try {
            console.log("Removing from watch later:", watchLaterId);

            setWatchLater(watchLater.filter((item) => item._id !== watchLaterId));
        } catch (error) {
            console.error("Error removing from watch later:", error);
        }
    };

    if (!user) {
        return (
            <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                    Save videos to watch later
                </h2>
                <p className="text-gray-600">
                    Watch later videos aren't viewable when signed out.
                </p>
            </div>
        );
    }

    if (loading) {
        return <p className="text-center py-12 text-gray-600">Loading watch later videos...</p>;
    }

    if (watchLater.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your watch later list is empty</h2>
                <p className="text-gray-600">Videos you save to watch later will appear here.</p>
            </div>
        );
    }
    const videos = "/video/vdo.mp4";
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">{watchLater.length} videos</p>
            </div>

            <div className="space-y-4">
                {watchLater.map((item) => (
                    <div key={item._id} className="flex gap-4 group">
                        <Link href={`/watch/${item.videoid}`} className="flex-shrink-0">
                            <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                                <video
                                    src={videos}
                                    muted
                                    playsInline
                                    preload="metadata"
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                            <Link href={`/watch/${item.videoid}`}>
                                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">
                                    {item.video.videotitle}
                                </h3>
                            </Link>
                            <p className="text-sm text-gray-600">
                                {item.video.videochanel}
                            </p>
                            <p className="text-sm text-gray-600">
                                {item.video.views.toLocaleString()} views •{" "}
                                {formatDistanceToNow(new Date(item.video.createdAt))} ago
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Added {formatDistanceToNow(new Date(item.addedAt))} ago
                            </p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => handleRemoveFromWatchLater(item._id)}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Remove from watch later
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
            </div>
        </div>
    );
}
