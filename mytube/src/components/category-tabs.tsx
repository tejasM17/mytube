import { useState } from "react";
import { Button } from "@/components/ui/button";

const categories = [
    "All",
    "Music",
    "Gaming",
    "Movies",
    "News",
    "Sports",
    "Technology",
    "Comedy",
    "Education",
    "Science",
    "Travel",
    "Food",
    "Fashion",
];

export default function CategoryTabs() {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <div className="mb-8 flex h-9 gap-2 overflow-x-auto whitespace-nowrap pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
                <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "secondary"}
                    className={`h-9 rounded-lg px-4 text-sm font-medium ${activeCategory === category ? "bg-[#0f0f0f] text-white hover:bg-[#272727]" : "bg-[#f2f2f2] text-[#0f0f0f] hover:bg-[#e5e5e5]"}`}
                    onClick={() => setActiveCategory(category)}
                >
                    {category}
                </Button>
            ))}
        </div>
    );
}
