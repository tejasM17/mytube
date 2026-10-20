import { Bell, Menu, Mic, Search, User, VideoIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Channeldialogue from "./channeldialogue";
import { useRouter } from "next/router";

const Header = () => {
    const user = {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        image: "https://github.com/shadcn.png?height=32&width=32",
    };
    const [searchQuery, setSearchQuery] = useState("");
    const [hasChannel, setHasChannel] = useState(false);
    const [isdialogeopen, setisdialogeopen] = useState(false);
    const router = useRouter();
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    const handleKeypress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(e as any);
        }
    };
    return (
        <header className="sticky top-0 z-20 flex h-[52px] items-center justify-between border-b border-gray-200 bg-white px-4">
            <div className="flex w-[238px] shrink-0 items-center gap-3">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Menu className="h-5 w-5" />
                </Button>
                <Link href="/" className="flex items-center gap-1.5">
                    <div className="rounded-[5px] bg-red-600 p-[4px]">
                        <svg width="25" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </div>
                    <span className="text-[20px] font-medium tracking-[-1px]">YourTube</span>
                    <span className="ml-1 text-[10px] text-gray-400">IN</span>
                </Link>
            </div>

            <form
                onSubmit={handleSearch}
                className="mx-6 flex w-full max-w-[630px] flex-1 items-center gap-3"
            >
                <div className="flex flex-1">
                    <Input
                        type="search"
                        placeholder="Search"
                        onKeyPress={handleKeypress}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 rounded-l-full border-gray-300 px-4 text-sm focus-visible:ring-0"
                    />
                    <Button
                        type="submit"
                        className="h-9 rounded-r-full border border-l-0 border-gray-300 bg-gray-50 px-5 text-gray-600 hover:bg-gray-100"
                    >
                        <Search className="w-5 h-5" />
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Mic className="w-5 h-5" />
                </Button>
            </form>

            <div className="flex w-[238px] shrink-0 items-center justify-end gap-2">
                {user ? (
                    <>
                        <Button variant="ghost" size="icon">
                            <VideoIcon className="w-6 h-6" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Bell className="w-6 h-6" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-orange-400 text-white">J</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                {hasChannel ? (
                                    <DropdownMenuItem asChild>
                                        <Link href={`/channel/${user?._id}`}>Your channel</Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <div className="px-2 py-1.5">
                                        <Button
                                            onClick={() => setisdialogeopen(true)}
                                            variant="secondary"
                                            size="sm"
                                            className="w-full"
                                        >
                                            Create Channel
                                        </Button>
                                    </div>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/history">History</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/liked">Liked videos</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/watch-later">Watch later</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem >Sign out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <>
                        <Button
                            className="flex items-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            Sign in
                        </Button>
                    </>
                )}{" "}
            </div>
            <Channeldialogue
                isopen={isdialogeopen}
                onclose={() => setisdialogeopen(false)}
                mode="create"
            />
        </header>
    )
}

export default Header
