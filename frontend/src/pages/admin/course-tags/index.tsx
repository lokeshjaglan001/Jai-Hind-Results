import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

// HeroUI Imports
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import { Input } from "@heroui/input";

// Define the type for a course tag
export type CourseTag = {
  id: string; // Assuming IDs are strings
  name: string;
  slug: string; // Include slug if provided by API
};

interface CourseTagsPageProps {
  initialTags: CourseTag[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tags = await api.get('/course-tags');
    return { props: { initialTags: tags } };
  } catch (error) {
    console.error('Failed to fetch course tags:', error);
    return { props: { initialTags: [] } };
  }
};

const CourseTagsPage: NextPage<CourseTagsPageProps> = ({ initialTags }) => {
  const { token } = useAuth();
  const [tags, setTags] = useState<CourseTag[]>(initialTags);

  const [newName, setNewName] = useState('');

  const [editingTag, setEditingTag] = useState<CourseTag | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const authToken = token || undefined;
    try {
      const newTag = await api.post('/course-tags', { name: newName }, authToken);
      setTags((prev) => [...prev, newTag]);
      setNewName('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    setIsLoading(true);
    setError(null);
    const authToken = token || undefined;
    try {
      const updatedTag = await api.put(`/course-tags/${editingTag.id}`, { name: editingTag.name }, authToken);
      setTags(prev => prev.map(t => t.id === updatedTag.id ? updatedTag : t));
      setIsEditDialogOpen(false);
      setEditingTag(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!window.confirm('Are you sure you want to delete this course tag?')) return;
    const authToken = token || undefined;
    try {
      await api.delete(`/course-tags/${tagId}`, authToken);
      setTags(prev => prev.filter(t => t.id !== tagId));
    } catch (err: unknown) {
      alert(`Failed to delete tag: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  const openEditDialog = (tag: CourseTag) => {
    setEditingTag(tag);
    setIsEditDialogOpen(true);
    setError(null);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Course Tags</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ADD NEW TAG FORM */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate}>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Add New Tag</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Tag Name"
                  id="newName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full bg-[#7828C8] text-white">
                  {isLoading ? 'Saving...' : 'Save Tag'}
                </Button>
              </CardBody>
            </Card>
          </form>
        </div>

        {/* EXISTING TAGS LIST */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Existing Tags</h2>
            </CardHeader>
            <CardBody>
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="group flex items-center gap-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium transition-all hover:bg-slate-200">
                      <span className="pl-3 pr-2 py-1">{tag.name}</span>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          isIconOnly={true}
                          className="h-6 w-6 rounded-full"
                          onPress={() => openEditDialog(tag)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          isIconOnly={true}
                          className="h-6 w-6 rounded-full text-red-500 hover:text-red-600"
                          onPress={() => handleDelete(tag.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                 <p className="text-sm text-gray-500 text-center py-4">No tags created yet.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* EDIT DIALOG -> MODAL */}
      <Modal isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} className='px-4'>
        <ModalContent>
          <ModalHeader className='pl-0'>
            Edit Course Tag
          </ModalHeader>
          {editingTag && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <Input
                label="Name"
                id="editName"
                value={editingTag.name}
                onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                required
              />
               {error && <p className="text-sm text-red-600">{error}</p>}
              <ModalFooter>
                <Button type="button" onPress={() => { setIsEditDialogOpen(false); setEditingTag(null); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className='bg-[#7828C8] text-white'>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CourseTagsPage;