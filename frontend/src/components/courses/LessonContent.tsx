import { Lesson } from "@/pages/admin/courses/[id]"; // Reuse this type
import { AlertCircle, Video } from "lucide-react";

type LessonContentProps = {
  lesson: Lesson | null;
};

const getYouTubeEmbedUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    let videoId: string | null = null;
    
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
        videoId = watchMatch[1];
    } else {
        const shortMatch = url.match(/youtu\.be\/([^?]+)/);
        if (shortMatch) {
            videoId = shortMatch[1];
        } else {
             const embedMatch = url.match(/embed\/([^?]+)/);
             if(embedMatch) {
                videoId = embedMatch[1];
             }
        }
    }
    
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return null; 
};


export default function LessonContent({ lesson }: LessonContentProps) {
  if (!lesson) {
    return (
      <div className="aspect-video w-full bg-black flex flex-col items-center justify-center text-center p-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-white">Welcome!</h2>
        <p className="text-gray-400">Select a lesson from the sidebar to get started.</p>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(lesson.video_url);
  console.log("Embedding video URL:", lesson);

  return (
    <>
      {lesson.video_url ? (
        <div className="aspect-video w-full bg-black overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={lesson.video_url.replaceAll("/watch?v=","/embed/").replaceAll("/watch/","/embed/").replaceAll("/live/","/embed/")}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
         <div className="aspect-video w-full bg-black flex items-center justify-center">
            <Video className="h-12 w-12 text-gray-400" />
            <p className="text-gray-400 ml-4">No valid video URL provided for this lesson.</p>
         </div>
      )}
    </>
  );
}