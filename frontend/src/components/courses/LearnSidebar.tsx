import { FullCourseDetails } from "@/pages/courses/[slug]"; // Reuse this type
import { Lesson } from "@/pages/admin/courses/[id]"; // Reuse this type
import { ChevronDown, PlayCircle, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";

type LearnSidebarProps = {
  course: FullCourseDetails;
  selectedLessonId: string | null;
  onSelectLesson: (lesson: Lesson) => void;
};

export default function LearnSidebar({ course, selectedLessonId, onSelectLesson }: LearnSidebarProps) {
  // Keep all sections open by default in the learn view
  const [openSections, setOpenSections] = useState<string[]>(
    course.course_topics.map(t => t.id)
  );

  const handleToggleSection = (topicId: string) => {
    setOpenSections(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Helper function for class names
  const cn = (...classes: (string | boolean)[]) => classes.filter(Boolean).join(' ');

  return (
        <aside className="w-full h-full bg-white">
    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
        <p className="text-sm text-gray-600 mt-1">
          {course.course_topics.reduce((acc, topic) => acc + topic.lessons.length, 0)} lessons
        </p>
      </div>
      <div className="flex flex-col">
        {course.course_topics.map((topic, topicIndex) => {
          const isOpen = openSections.includes(topic.id);
          return (
            <div key={topic.id} className="border-b border-gray-200 last:border-b-0">
              {/* Topic header - collapsible trigger */}
              <button
                onClick={() => handleToggleSection(topic.id)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold group-hover:bg-gray-200 transition-colors">
                    {topicIndex + 1}
                  </span>
                  <span className="font-semibold text-gray-900 text-left text-sm">{topic.title}</span>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 transition-transform text-gray-600",
                  isOpen && "rotate-180"
                )} />
              </button>
              
              {/* Lessons list - collapsible content */}
              {isOpen && (
                <div className="flex flex-col bg-gray-50">
                  {topic.lessons.map((lesson, lessonIndex) => {
                    const isSelected = selectedLessonId === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 text-left text-sm transition-all border-l-4 hover:bg-gray-100",
                          isSelected 
                            ? "bg-white border-gray-800 shadow-sm" 
                            : "border-transparent hover:border-gray-300"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 transition-colors",
                          isSelected 
                            ? "bg-gray-800 text-white" 
                            : "bg-white text-gray-600 border border-gray-300"
                        )}>
                          {lesson.video_url ? (
                            <PlayCircle className="h-3.5 w-3.5" />
                          ) : (
                            <FileText className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "font-medium transition-colors truncate",
                            isSelected ? "text-gray-900" : "text-gray-700"
                          )}>
                            {lesson.title}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-gray-800"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}