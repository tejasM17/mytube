import {
    Home,
    Compass,
    PlaySquare,
    Clock,
    ThumbsUp,
    History,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Channeldialogue from "./channeldialogue";

const Sidebar = () => {
    const user = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
    };
    const [hasChannel, setHasChannel] = useState(false);
    const [isdialogeopen, setisdialogeopen] = useState(false);
    return (
        <aside className="w-[254px] shrink-0 border-r border-gray-200 bg-white px-2 pt-2 max-md:w-[72px] max-md:px-1">
            <nav className="space-y-1">
                <Link href="/">
                    <Button variant="ghost" className="h-9 w-full justify-start rounded-lg px-2.5 text-sm font-normal">
                        <Home className="mr-2.5 h-[18px] w-[18px]" />
                        Home
                    </Button>
                </Link>
                <Link href="/explore">
                    <Button variant="ghost" className="h-9 w-full justify-start rounded-lg px-2.5 text-sm font-normal">
                        <Compass className="mr-2.5 h-[18px] w-[18px]" />
                        Explore
                    </Button>
                </Link>
                <Link href="/subscriptions">
                    <Button variant="ghost" className="h-9 w-full justify-start rounded-lg px-2.5 text-sm font-normal">
                        <PlaySquare className="mr-2.5 h-[18px] w-[18px]" />
                        Subscriptions
                    </Button>
                </Link>

                {user && (
                    <>
                        <div className="mt-2 border-t border-gray-200 pt-2">
                            <Link href="/history">
                                <Button variant="ghost" className="h-9 w-full justify-start rounded-lg px-2.5 text-sm font-normal">
                                    <History className="mr-2.5 h-[18px] w-[18px]" />
                                    History
                                </Button>
                            </Link>
                            <Link href="/liked">
                                <Button variant="ghost" className="h-9 w-full justify-start rounded-lg px-2.5 text-sm font-normal">
                                    <ThumbsUp className="mr-2.5 h-[18px] w-[18px]" />
                                    Liked videos
                                </Button>
                            </Link>
                            <Link href="/watch-later">
                                <Button variant="ghost" className="h-9 w-full justify-start rounded-lg px-2.5 text-sm font-normal">
                                    <Clock className="mr-2.5 h-[18px] w-[18px]" />
                                    Watch later
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                className="h-9 w-full justify-start rounded-lg px-2.5 text-sm font-normal"
                                onClick={() => setisdialogeopen(true)}
                            >
                                Create channel
                            </Button>

                        </div>
                    </>
                )}
            </nav>
            <Channeldialogue
                isopen={isdialogeopen}
                onclose={() => setisdialogeopen(false)}
                mode="create"
            />
        </aside>
    )
}

export default Sidebar
