import { useState} from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

import { Button, Card, CardHeader, CardBody, CardFooter, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input} from "@heroui/react";

type Tag = {
  id: string;
  name: string;
};

interface TagsPageProps {
  initialTags: Tag[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tags = await api.get('/tags');
    return { props: { initialTags: tags } };
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return { props: { initialTags: [] } };
  }
};

const TagsPage: NextPage<TagsPageProps> = ({ initialTags }) => {
  const { token } = useAuth();
  const [tags, setTags] = useState<Tag[]>(initialTags);
  
  const [newName, setNewName] = useState('');
  
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    const authToken = token ?? undefined;
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newTag = await api.post('/tags', { name: newName }, authToken);
      setTags((prev) => [...prev, newTag]);
      setNewName('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create tag.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    const authToken = token ?? undefined;

    e.preventDefault();
    if (!editingTag) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedTag = await api.put(`/tags/${editingTag.id}`, { name: editingTag.name }, authToken);
      setTags(prev => prev.map(t => t.id === updatedTag.id ? updatedTag : t));
      setIsEditDialogOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update tag.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    const authToken = token ?? undefined;

    if (!window.confirm('Are you sure you want to delete this tag?')) {
      return;
    }
    try {
      await api.delete(`/tags/${tagId}`, authToken);
      setTags(prev => prev.filter(t => t.id !== tagId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Failed to delete tag: ${err.message}`);
      } else {
        alert('Failed to delete tag.');
      }
    }
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-[#f5f7fb] min-h-screen">

    {/* PAGE TITLE */}

    <div className="mb-6">

      <h1 className="text-3xl font-bold tracking-tight text-[#1e293b]">
        Manage Tags
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Create, edit and organize your website tags
      </p>

    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ADD NEW TAG FORM */}

      <div className="lg:col-span-1">

        <form onSubmit={handleCreate}>

          <Card className="bg-white border border-gray-200 rounded-2xl shadow-md">

            <CardHeader className="pb-2">

              <div>

                <h1 className="text-xl font-semibold text-[#0f172a]">
                  Add New Tag
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Create tags to organize content
                </p>

              </div>

            </CardHeader>

            <CardBody className="space-y-4">

              <div className="space-y-2">

                <Input
                  id="newName"
                  label="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  classNames={{
                    inputWrapper:
                      "border border-gray-200 shadow-sm rounded-xl bg-[#f8fafc]",
                  }}
                />

              </div>

              {error && (
                <p className="text-sm text-red-600">
                  {error}
                </p>
              )}

            </CardBody>

            <CardFooter>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white rounded-xl shadow-md"
              >
                {isLoading ? 'Saving...' : 'Save Tag'}
              </Button>

            </CardFooter>

          </Card>

        </form>

      </div>

      {/* EXISTING TAGS */}

      <div className="lg:col-span-2">

        <Card className="bg-white border border-gray-200 rounded-2xl shadow-md">

          <CardHeader className="pb-2">

            <div>

              <h1 className="text-xl font-semibold text-[#0f172a]">
                Existing Tags
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Edit or remove existing tags
              </p>

            </div>

          </CardHeader>

          <CardBody>

            {tags.length === 0 ? (

              <div className="text-center py-8 text-gray-500">
                No tags available
              </div>

            ) : (

              <div className="flex flex-wrap gap-3">

                {tags.map((tag) => (

                  <div
                    key={tag.id}
                    className="group flex items-center gap-1 bg-[#f8fafc] border border-gray-200 text-slate-800 rounded-full text-sm font-medium transition-all hover:bg-gray-100 shadow-sm"
                  >

                    <span className="pl-4 pr-2 py-2">
                      {tag.name}
                    </span>

                    <div className="flex items-center pr-1">

                      <Button
                        variant="ghost"
                        isIconOnly={true}
                        className="h-7 w-7 rounded-full hover:bg-gray-200"
                        onPress={() => openEditDialog(tag)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-[#0f766e]" />
                      </Button>

                      <Button
                        variant="ghost"
                        isIconOnly={true}
                        className="h-7 w-7 rounded-full hover:bg-red-100"
                        onPress={() => handleDelete(tag.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </CardBody>

        </Card>

      </div>

    </div>

    {/* EDIT DIALOG */}

    <Modal
      isOpen={isEditDialogOpen}
      onOpenChange={setIsEditDialogOpen}
      className="bg-[#f8fafc] border border-gray-200 rounded-3xl shadow-2xl p-2"
    >

      <ModalContent className="rounded-3xl">

        <ModalHeader className="flex flex-col">

          <h1 className="text-2xl font-bold text-[#1e293b]">
            Edit Tag
          </h1>

          <p className="text-sm text-gray-500">
            Update the selected tag name
          </p>

        </ModalHeader>

        {editingTag && (

          <form
            onSubmit={handleUpdate}
            className="space-y-4 py-2"
          >

            <ModalBody>

              <div className="space-y-2">

                <Input
                  id="editName"
                  label="Name"
                  value={editingTag.name}
                  onChange={(e) =>
                    setEditingTag({
                      ...editingTag,
                      name: e.target.value
                    })
                  }
                  required
                  classNames={{
                    inputWrapper:
                      "border border-gray-200 shadow-sm rounded-xl bg-white",
                  }}
                />

              </div>

              {error && (
                <p className="text-sm text-red-600">
                  {error}
                </p>
              )}

            </ModalBody>

            <ModalFooter>

              <Button
                type="button"
                className="bg-white border border-gray-200 rounded-xl"
                onPress={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-[#0f766e] hover:bg-[#115e59] text-white rounded-xl shadow-md"
                isDisabled={isLoading}
              >
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

export default TagsPage;