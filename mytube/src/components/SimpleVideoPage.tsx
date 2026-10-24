import { useEffect, useState } from "react";
import Videocard from "@/components/videocard";
import axiosInstance from "@/lib/axiosinstance";

export default function SimpleVideoPage({ title, description }: { title: string; description: string }) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/video/getall")
      .then(({ data }) => setVideos(Array.isArray(data) ? data : []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return <main className="min-w-0 flex-1 p-3 sm:p-5 lg:p-6">
    <h1 className="mb-1 text-xl font-bold sm:text-2xl">{title}</h1>
    <p className="mb-5 text-sm text-muted-foreground">{description}</p>
    {loading ? <p className="py-8 text-muted-foreground">Loading videos…</p> : videos.length ?
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{videos.map(video => <Videocard key={video._id} video={video} />)}</div> :
      <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">Videos will appear here when they’re available.</div>}
  </main>;
}
