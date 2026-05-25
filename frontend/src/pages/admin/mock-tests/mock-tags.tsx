import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {  Modal,  ModalContent,  ModalHeader,  ModalFooter} from "@heroui/modal";
import { Input } from "@heroui/input";

type MockTag = {
  id: string;
  name: string;
};

interface MockTagsPageProps {
  initialTags: MockTag[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tags = await api.get('/mock-tags');
    return { props: { initialTags: tags } };
  } catch (error) {
    console.error('Failed to fetch mock tags:', error);
    return { props: { initialTags: [] } };
  }
};

const MockTagsPage: NextPage<MockTagsPageProps> = ({ initialTags }) => {
  const { token } = useAuth();
  const [tags, setTags] = useState<MockTag[]>(initialTags);

  const [newName, setNewName] = useState('');
  
  const [editingTag, setEditingTag] = useState<MockTag | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newTag = await api.post('/mock-tags', { name: newName }, authToken);
      setTags((prev) => [...prev, newTag]);
      setNewName('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingTag) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedTag = await api.put(`/mock-tags/${editingTag.id}`, { name: editingTag.name }, authToken);
      setTags(prev => prev.map(t => t.id === updatedTag.id ? updatedTag : t));
      setIsEditDialogOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to delete this mock tag?')) return;
    try {
      await api.delete(`/mock-tags/${tagId}`, authToken);
      setTags(prev => prev.filter(t => t.id !== tagId));
    } catch (err: unknown) {
      alert(`Failed to delete tag: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  const openEditDialog = (tag: MockTag) => {
    setEditingTag(tag);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Mock Test Tags</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate}>
            <Card>
              <CardHeader>Add New Tag</CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-2">
                  <Input id="newName" label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full bg-[#7828C8] text-white">{isLoading ? 'Saving...' : 'Save Tag'}</Button>
              </CardBody>
            </Card>
          </form>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>Existing Tags</CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="group flex items-center gap-1 bg-slate-100 text-slate-800 rounded-full  text-sm font-medium transition-all hover:bg-slate-200">
                    <span className="pl-3 pr-2 py-1">{tag.name}</span>
                    <div className="flex items-center">
                      <Button
                          variant="ghost"
                          isIconOnly={true}
                          className="h-6 w-6 rounded-full" onPress={() => openEditDialog(tag)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                          variant="ghost"
                          isIconOnly={true}
                          className="h-6 w-6 rounded-full text-red-500 hover:text-red-600" onPress={() => handleDelete(tag.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <Modal isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} className='px-4'>
        <ModalContent>
          <ModalHeader className='pl-0'>Edit Mock Tag</ModalHeader>
          {editingTag && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Input id="editName" label="Name" value={editingTag.name} onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })} required />
              </div>
              <ModalFooter>
                <Button type="button" variant="flat" onPress={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className="bg-[#7828C8] text-white">{isLoading ? 'Saving...' : 'Save Changes'}</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MockTagsPage;