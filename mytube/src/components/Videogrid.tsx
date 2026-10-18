import React from 'react'
import Videocard from './videocard';

const Videogrid = () => {

    const videos = [
        {
            _id: "1",
            videotitle: "Amazing Nature Documentary",
            filename: "nature-doc.mp4",
            filetype: "video/mp4",
            filepath: "/videos/nature-doc.mp4",
            filesize: "500MB",
            videochanel: "Nature Channel",
            Like: 1250,
            views: 45000,
            uploader: "nature_lover",
            createdAt: new Date().toISOString(),
        },
        {
            _id: "2",
            videotitle: "Cooking Tutorial: Perfect Pasta",
            filename: "pasta-tutorial.mp4",
            filetype: "video/mp4",
            filepath: "/videos/pasta-tutorial.mp4",
            filesize: "300MB",
            videochanel: "Chef's Kitchen",
            Like: 890,
            views: 23000,
            uploader: "chef_master",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
    ];
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,360px),393px))] gap-x-4 gap-y-8 max-sm:grid-cols-1">
            {videos.map((video) => (
                <Videocard key={video._id} video={video} />
            ))}
        </div>
    )
}

export default Videogrid
