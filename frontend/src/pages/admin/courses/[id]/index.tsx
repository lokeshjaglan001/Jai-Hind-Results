"use client";

import { useState, useEffect, useRef } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { PlusCircle, Edit, Trash2, GripVertical, Upload } from 'lucide-react';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    ResponderProvided,
    DroppableProvided,
    DraggableProvided
} from '@hello-pangea/dnd';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";

import type { Course } from '@/components/admin/courses/CreateCourseForm';

export type Lesson = {
    id: string;
    title: string;
    description?: string | null;
    video_url?: string | null;
    video_duration_sec?: number | null;
    featured_image_url?: string | null;
    order: number;
};

export type Topic = {
    id: string;
    title: string;
    description?: string | null;
    order: number;
    lessons: Lesson[];
};

interface CourseWithContent extends Course {
    course_topics: Topic[];
}

interface ManageCourseContentPageProps {
  courseId: string; 
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
    if (typeof id !== 'string') {
        return { notFound: true };
    }
    return { props: { courseId: id } };
};

const ManageCourseContentPage: NextPage<ManageCourseContentPageProps> = ({ courseId }) => {
    const { token, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    
    const [course, setCourse] = useState<CourseWithContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseContent = async () => {
             if (!isAuthLoading && token) {
                try {
                    setIsLoading(true);
                    setError(null);
                    
                    const courseData = await api.get(`/courses/id/${courseId}`, token);
                    
                    const sortedTopics = (courseData.course_topics || []).sort((a: Topic, b: Topic) => a.order - b.order);
                    sortedTopics.forEach((topic: Topic) => {
                        if (topic.lessons) {
                            topic.lessons.sort((a, b) => a.order - b.order);
                        }
                    });
                    courseData.course_topics = sortedTopics;

                    setCourse(courseData);
                } catch (err: unknown) {
                    console.error("Failed to fetch course content:", err);
                    setError(err instanceof Error ? err.message : "Failed to load data");
                } finally {
                    setIsLoading(false);
                }
             } else if (!isAuthLoading && !token) {
                 router.push('/login');
             }
        };

        fetchCourseContent();
    }, [token, isAuthLoading, courseId, router]);

    if (isLoading || isAuthLoading) {
        return <div className="flex h-screen items-center justify-center">Loading course content...</div>;
    }

    if (error) {
         return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>;
    }

    if (!course) {
         return <div className="flex h-screen items-center justify-center">Course not found.</div>;
    }

    return <ManageCourseContentUI initialCourse={course} />;
};

const ManageCourseContentUI = ({ initialCourse }: { initialCourse: CourseWithContent }) => {
    const { token } = useAuth();
    const router = useRouter();
    const [course, setCourse] = useState<CourseWithContent>(initialCourse);
    const [topics, setTopics] = useState<Topic[]>(initialCourse.course_topics || []);
    
    const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());

    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Partial<Topic> | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
    const [currentTopicIdForLesson, setCurrentTopicIdForLesson] = useState<string | null>(null);
    const featuredImageFileRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleTopic = (topicId: string) => {
        setOpenTopics(prevOpenTopics => {
            const newOpenTopics = new Set(prevOpenTopics);
            if (newOpenTopics.has(topicId)) {
                newOpenTopics.delete(topicId);
            } else {
                newOpenTopics.add(topicId);
            }
            return newOpenTopics;
        });
    };

    const reloadData = async () => {
        const authToken = token || undefined;
        try {
            const courseData = await api.get(`/courses/id/${course.id}`, authToken);
            const sortedTopics = (courseData.course_topics || []).sort((a: Topic, b: Topic) => a.order - b.order);
            sortedTopics.forEach((topic: Topic) => {
                if (topic.lessons) topic.lessons.sort((a,b) => a.order - b.order);
            });
            courseData.course_topics = sortedTopics;
            
            setCourse(courseData);
            setTopics(courseData.course_topics || []);
        } catch (err) {
            console.error("Failed to reload data", err);
            alert("Failed to refresh data. Please refresh the page.");
        }
    }

    const openTopicModal = (topic: Partial<Topic> | null = null) => {
        setEditingTopic(topic ? { ...topic } : { title: '', description: '' });
        setIsTopicModalOpen(true);
        setError(null);
    };

    const handleSaveTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTopic || !editingTopic.title) return;
        setIsLoading(true);
        setError(null);
        const authToken = token || undefined;
        const isEditMode = !!editingTopic.id;

        try {
            const endpoint = isEditMode
                ? `/courses/topics/${editingTopic.id}`
                : `/courses/${course.id}/topics`;
            const method = isEditMode ? 'put' : 'post';
            const payload = { title: editingTopic.title, description: editingTopic.description || null };

            await api[method](endpoint, payload, authToken);
            await reloadData(); 

            setIsTopicModalOpen(false);
            setEditingTopic(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : `Failed to save topic.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTopic = async (topicId: string) => {
        if (!window.confirm('Are you sure you want to delete this topic and ALL its lessons?')) return;
        setIsLoading(true);
        const authToken = token || undefined;
        try {
            await api.delete(`/courses/topics/${topicId}`, authToken);
            await reloadData(); 
        } catch (err: unknown) {
            alert(`Failed to delete topic: ${err instanceof Error ? err.message : "Error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const openLessonModal = (topicId: string, lesson: Partial<Lesson> | null = null) => {
        setCurrentTopicIdForLesson(topicId);
        setEditingLesson(lesson 
            ? { ...lesson, video_duration_sec: lesson.video_duration_sec || 0 } 
            : { title: '', description: '', video_url: '', video_duration_sec: 0 }
        );
        setImagePreview(lesson?.featured_image_url || null);
         if (featuredImageFileRef.current) {
            featuredImageFileRef.current.value = "";
        }
        setIsLessonModalOpen(true);
        setError(null);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(editingLesson?.featured_image_url || null);
        }
    };

     const handleSaveLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLesson || !editingLesson.title || !currentTopicIdForLesson) return;
        setIsLoading(true);
        setError(null);
        const authToken = token || undefined;
        const isEditMode = !!editingLesson.id;

        const formData = new FormData();
        formData.append('title', editingLesson.title);
        if (editingLesson.description) formData.append('description', editingLesson.description);
        if (editingLesson.video_url) formData.append('video_url', editingLesson.video_url);
        
        formData.append('video_duration_sec', (editingLesson.video_duration_sec || 0).toString());

        const imageFile = featuredImageFileRef.current?.files?.[0];
        if (imageFile) {
            formData.append('featuredImageFile', imageFile);
        }

        try {
             const endpoint = isEditMode
                ? `/courses/lessons/${editingLesson.id}`
                : `/courses/topics/${currentTopicIdForLesson}/lessons`;
             const method = isEditMode ? 'PUT' : 'POST';
            if (isEditMode) {
                await api.putFormData(endpoint, formData, authToken);
            } else {
                await api.postFormData(endpoint, formData, authToken);
            }

            await reloadData();

            setIsLessonModalOpen(false);
            setEditingLesson(null);
            setCurrentTopicIdForLesson(null);
            setImagePreview(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : `Failed to save lesson.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) return;
        setIsLoading(true);
        const authToken = token || undefined;
        try {
            await api.delete(`/courses/lessons/${lessonId}`, authToken);
            await reloadData(); 
        } catch (err: unknown) {
            alert(`Failed to delete lesson: ${err instanceof Error ? err.message : "Error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const onDragEnd = async (result: DropResult, provided: ResponderProvided) => {
        const { source, destination, type } = result;
        const authToken = token || undefined;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === 'TOPIC') {
            const reorderedTopics = Array.from(topics);
            const [movedTopic] = reorderedTopics.splice(source.index, 1);
            reorderedTopics.splice(destination.index, 0, movedTopic);
            setTopics(reorderedTopics); 

            const orderedTopicIds = reorderedTopics.map(t => parseInt(t.id));
            try {
                await api.patch(`/courses/${course.id}/topics/reorder`, { orderedTopicIds }, authToken);
            } catch (err) {
                console.error("Failed to reorder topics:", err);
                alert("Failed to save new topic order.");
                setTopics(initialCourse.course_topics || []); 
            }
        }

        if (type === 'LESSON') {
            const sourceTopicId = source.droppableId.replace('lessons-', '');
            const destTopicId = destination.droppableId.replace('lessons-', '');
            const sourceTopicIndex = topics.findIndex(t => t.id === sourceTopicId);
            
            if (sourceTopicIndex === -1) return;
            if (sourceTopicId !== destTopicId) {
                 alert("Moving lessons between topics is not supported.");
                 return;
            }

            const topic = topics[sourceTopicIndex];
            const reorderedLessons = Array.from(topic.lessons || []);
            const [movedLesson] = reorderedLessons.splice(source.index, 1);
            reorderedLessons.splice(destination.index, 0, movedLesson);

            const updatedTopics = [...topics];
            updatedTopics[sourceTopicIndex] = { ...topic, lessons: reorderedLessons };
            setTopics(updatedTopics); 

            const orderedLessonIds = reorderedLessons.map(l => parseInt(l.id));
            try {
                 await api.patch(`/courses/topics/${sourceTopicId}/lessons/reorder`, { orderedLessonIds }, authToken);
            } catch (err) {
                console.error("Failed to reorder lessons:", err);
                alert("Failed to save new lesson order.");
                setTopics(initialCourse.course_topics || []);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Course Content</h1>
                    <p className="text-gray-500">Course: {course.title}</p>
                </div>
                <Button onPress={() => openTopicModal()} className='bg-[#7828c8] text-white'>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Topic
                </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-topics" type="TOPIC">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                             {topics.map((topic, index) => (
                                <Draggable key={topic.id} draggableId={`topic-${topic.id}`} index={index}>
                                    {(providedDraggable) => (
                                        <Card ref={providedDraggable.innerRef} {...providedDraggable.draggableProps}>
                                            <CardBody>
                                                <div className="flex flex-row items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div {...providedDraggable.dragHandleProps}>
                                                            <GripVertical className="h-5 w-5 text-gray-500 cursor-grab" />
                                                        </div>
                                                        <h2 
                                                            className="text-lg font-medium cursor-pointer select-none"
                                                            onClick={() => toggleTopic(topic.id)}
                                                        >
                                                            {topic.title}
                                                        </h2>
                                                        
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="light" size="sm" onPress={() => openTopicModal(topic)}>
                                                            <Edit className="h-3 w-3 mr-1" /> Edit Topic
                                                        </Button>
                                                        <Button variant="light" size="sm" onPress={() => openLessonModal(topic.id)}>
                                                            <PlusCircle className="h-3 w-3 mr-1" /> Add Lesson
                                                        </Button>
                                                        <Button variant="light" size="sm" className="text-red-500 hover:text-red-600" onPress={() => handleDeleteTopic(topic.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                {openTopics.has(topic.id) && (
                                                    <>
                                                        {topic.description && <p className="text-sm text-gray-500 mb-4">{topic.description}</p>}
                                                        <Droppable droppableId={`lessons-${topic.id}`} type="LESSON">
                                                            {(providedLessons) => (
                                                                <div ref={providedLessons.innerRef} {...providedLessons.droppableProps} className="space-y-3 mt-3 pl-4 border-l ml-[10px] min-h-[50px]">
                                                                    {(topic.lessons || []).map((lesson, lessonIndex) => (
                                                                        <Draggable key={lesson.id} draggableId={`lesson-${lesson.id}`} index={lessonIndex}>
                                                                            {(providedLessonDraggable) => (
                                                                                <div ref={providedLessonDraggable.innerRef} {...providedLessonDraggable.draggableProps} className="flex items-center justify-between p-2 rounded-md bg-gray-100 hover:bg-slate-50">
                                                                                    <div className="flex items-center gap-2 text-sm">
                                                                                        <div {...providedLessonDraggable.dragHandleProps}>
                                                                                            <GripVertical className="h-4 w-4 text-gray-500 cursor-grab" />
                                                                                        </div>
                                                                                        <span>{lesson.title}</span>
                                                                                        {lesson.video_url && <span className="text-xs text-blue-500">(Video)</span>}
                                                                                        {lesson.featured_image_url && <img src={lesson.featured_image_url} alt="thumb" className="h-6 w-auto rounded ml-2"/>}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1">
                                                                                        <Button variant="ghost" size="sm" className="h-7 w-7" onPress={() => openLessonModal(topic.id, lesson)}>
                                                                                            <Edit className="h-3.5 w-3.5" />
                                                                                        </Button>
                                                                                        <Button variant="ghost" size="sm" className="h-7 w-7 text-red-500 hover:text-red-600" onPress={() => handleDeleteLesson(lesson.id)}>
                                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    ))}
                                                                    {providedLessons.placeholder}
                                                                    {(topic.lessons || []).length === 0 && ( <p className="text-xs text-gray-500 p-2">Drag lessons here or click "Add Lesson".</p> )}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </>
                                                )}
                                            </CardBody>
                                        </Card>
                                     )}
                                </Draggable>
                             ))}
                             {provided.placeholder}
                             {topics.length === 0 && ( <p className="text-sm text-gray-500 text-center py-8">No topics created yet.</p> )}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Modal isOpen={isTopicModalOpen} onOpenChange={setIsTopicModalOpen} className='px-4'>
                 <ModalContent>
                    <ModalHeader className='pl-0'>{editingTopic?.id ? 'Edit Topic' : 'Add New Topic'}</ModalHeader>
                    <ModalBody className="max-h-[80vh] overflow-y-auto">
                        {editingTopic && (
                            <form id="topic-form" onSubmit={handleSaveTopic} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Input 
                                        label="Title" 
                                        id="topic-title" 
                                        value={editingTopic.title || ''} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTopic({ ...editingTopic, title: e.target.value })} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Textarea 
                                        label="Description (Optional)" 
                                        id="topic-description" 
                                        value={editingTopic.description || ''} 
                                        onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })} 
                                    />
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                            </form>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" variant="light" onPress={() => setIsTopicModalOpen(false)}>Cancel</Button>
                        <Button type="submit" form="topic-form" disabled={isLoading} className='bg-[#7828c8] text-white'>{isLoading ? 'Saving...' : 'Save Topic'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isLessonModalOpen} onOpenChange={setIsLessonModalOpen} className='px-4'>
                <ModalContent className="sm:max-w-5xl">
                    <ModalHeader className='flex flex-col pl-0'>
                        <span className='text-lg'>Lesson | Topic: {topics.find(t=>t.id === currentTopicIdForLesson)?.title}</span>
                    </ModalHeader>
                    
                    <ModalBody className="max-h-[80vh] overflow-y-auto">
                        {editingLesson && (
                            <form id="lesson-form" onSubmit={handleSaveLesson} className="py-4">
                                <div className="grid grid-cols-3 gap-6">
                                    
                                    <div className="col-span-3 lg:col-span-2 space-y-6">
                                        <div className="space-y-2">
                                            <Input 
                                                label="Lesson Name" 
                                                id="lesson-title" 
                                                value={editingLesson.title || ''} 
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingLesson({ ...editingLesson, title: e.target.value })} 
                                                required 
                                                className="text-lg"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Content</label>
                                            <Editor
                                                apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                                                value={editingLesson.description || ''}
                                                onEditorChange={(content: string) => {
                                                    setEditingLesson({ ...editingLesson, description: content });
                                                }}
                                                init={{
                                                    height: 400,
                                                    menubar: true,
                                                    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                                                    toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                                                    content_style: 'body { font-family:Poppins,sans-serif; font-size:16px }'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-3 lg:col-span-1 space-y-6">
                                        <div className="space-y-2 p-4 border border-gray-300 rounded-md">
                                            <label className="text-sm font-medium">Featured Image</label>
                                            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 border-dashed rounded-md h-48">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md"/>
                                                ) : (
                                                    <div className="text-center text-gray-500">
                                                        <Upload className="mx-auto h-8 w-8" />
                                                        <p className="text-sm mt-2">Upload Image</p>
                                                        <p className="text-xs">JPEG, PNG, GIF, WebP</p>
                                                    </div>
                                                )}
                                            </div>
                                            <Input
                                                id="lesson-image"
                                                type="file"
                                                accept="image/*"
                                                ref={featuredImageFileRef}
                                                onChange={handleImageChange}
                                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>

                                        <div className="space-y-2 p-4 border border-gray-300 rounded-md">
                                            <label className="text-sm font-medium">Video</label>
                                            <Input 
                                                label="Add from URL (YouTube, Optional)" 
                                                id="lesson-video-url" 
                                                value={editingLesson.video_url || ''} 
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingLesson({ ...editingLesson, video_url: e.target.value })} 
                                                placeholder="https://www.youtube.com/watch?v=..."
                                            />
                                            <Input 
                                                label="Video Duration (in seconds)" 
                                                id="lesson-duration" 
                                                type="number"
                                                value={editingLesson.video_duration_sec === null || editingLesson.video_duration_sec === undefined ? '' : String(editingLesson.video_duration_sec)}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const num = parseInt(e.target.value);
                                                    setEditingLesson({ ...editingLesson, video_duration_sec: isNaN(num) ? null : num })
                                                }}
                                                placeholder="e.g., 300"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
                            </form>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" variant="light" onPress={() => setIsLessonModalOpen(false)}>Cancel</Button>
                        <Button type="submit" form="lesson-form" disabled={isLoading} className='bg-[#7828C8] text-white'>{isLoading ? 'Saving...' : 'Save Lesson'}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default ManageCourseContentPage;