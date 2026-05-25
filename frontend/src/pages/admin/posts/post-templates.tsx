import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

import { Button, Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Input, Textarea } from "@heroui/input";

type PostTemplate = {
  id: string;
  name: string;
  description: string | null;
  structure: string;
};

interface PostTemplatesPageProps {
  initialTemplates: PostTemplate[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const templates = await api.get('/post-templates');
    return { props: { initialTemplates: templates } };
  } catch (error) {
    console.error('Failed to fetch post templates:', error);
    return { props: { initialTemplates: [] } };
  }
};

const PostTemplatesPage: NextPage<PostTemplatesPageProps> = ({ initialTemplates }) => {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<PostTemplate[]>(initialTemplates);
  
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStructure, setNewStructure] = useState('');
  
  const [editingTemplate, setEditingTemplate] = useState<PostTemplate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newTemplate = await api.post('/post-templates', {
        name: newName,
        description: newDescription,
        structure: newStructure,
      }, authToken);
      setTemplates((prev) => [...prev, newTemplate]);
      setNewName('');
      setNewDescription('');
      setNewStructure('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create post template.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingTemplate) return;
    setIsLoading(true);
    setError(null);
    try {
        const updatedTemplate = await api.put(`/post-templates/${editingTemplate.id}`, {
            name: editingTemplate.name,
            description: editingTemplate.description,
            structure: editingTemplate.structure,
        }, authToken);
        setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        setIsEditDialogOpen(false);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Failed to update post template.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
        await api.delete(`/post-templates/${templateId}`, authToken);
        setTemplates(prev => prev.filter(t => t.id !== templateId));
    } catch (err: unknown) {
        if (err instanceof Error) {
            alert(`Failed to delete template: ${err.message}`);
        } else {
            alert('Failed to delete template.');
        }
    }
  };

  const openEditDialog = (template: PostTemplate) => {
    setEditingTemplate(template);
    setIsEditDialogOpen(true);
  };

  return (
    <div className='p-4'>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Post Templates</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD NEW TEMPLATE FORM */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate}>
            <Card className='p-2'>
              <CardHeader><h1>Add New Template</h1></CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-2">
                  <Input id="newName" label="Template Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Textarea id="newDescription" label="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Textarea
                    id="newStructure"
                    label="Template (HTML)"
                    value={newStructure}
                    onChange={(e) => setNewStructure(e.target.value)}
                    rows={12}
                    className="font-mono text-xs"
                    placeholder="Enter HTML with {{placeholders}}..."
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full bg-[#7828C8] text-white">
                  {isLoading ? 'Saving...' : 'Save Template'}
                </Button>
              </CardBody>
            </Card>
          </form>
        </div>

        {/* EXISTING TEMPLATES LIST */}
        <div className="lg:col-span-2">
          <Card className='p-2'>
            <CardHeader><h1>Existing Templates</h1></CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {templates.map((template) => (
                  <li key={template.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{template.name}</p>
                      <p className="text-sm text-slate-500">{template.description || ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        variant="ghost"
                        onPress={() => openEditDialog(template)}
                        aria-label="Edit category"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onPress={() => handleDelete(template.id)}
                        aria-label="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* SINGLE, SHARED EDIT DIALOG */}
      <Modal isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} className='p-4'>
        {/* FIX: Use flexbox to control layout and scrolling */}
        <ModalContent className="max-w-3xl flex flex-col max-h-[90vh]">
          <ModalHeader className='pl-0'><h1>Edit Template</h1></ModalHeader>
          {editingTemplate && (
            // The form now uses flexbox to grow and fill the space
            <form onSubmit={handleUpdate} className="flex-1 flex flex-col gap-4 overflow-hidden">
              <div className="space-y-2">
                <Input id="editName" label="Name" value={editingTemplate.name} onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Textarea id="editDescription" label="Description" value={editingTemplate.description || ''} onChange={(e) => setEditingTemplate({...editingTemplate, description: e.target.value})} />
              </div>
              {/* This container will hold the scrollable textarea */}
              <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
                <Textarea
                  id="editStructure"
                  label="Template (HTML)"
                  value={editingTemplate.structure}
                  onChange={(e) => setEditingTemplate({...editingTemplate, structure: e.target.value})}
                  className="font-mono text-xs flex-1 resize-none" // `flex-1` makes it take up the available space
                />
              </div>
              <ModalFooter className="pt-4">
                <Button type="button" onPress={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" isDisabled={isLoading} className='bg-[#7828C8] text-white'>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PostTemplatesPage;