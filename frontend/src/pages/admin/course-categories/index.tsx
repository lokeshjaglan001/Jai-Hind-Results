import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

// HeroUI Imports
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";

// Define the type for a course category
export type CourseCategory = {
  id: string; 
  name: string;
  slug: string; 
  description: string | null;
};

interface CourseCategoriesPageProps {
  initialCategories: CourseCategory[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const categories = await api.get('/course-categories');
    return { props: { initialCategories: categories } };
  } catch (error) {
    console.error('Failed to fetch course categories:', error);
    return { props: { initialCategories: [] } };
  }
};

const CourseCategoriesPage: NextPage<CourseCategoriesPageProps> = ({ initialCategories }) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<CourseCategory[]>(initialCategories);

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Changed from isDialogOpen

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const authToken = token || undefined;
    try {
      const newCategory = await api.post('/course-categories', {
        name: newName,
        description: newDescription || null
      }, authToken);
      setCategories((prev) => [...prev, newCategory]);
      setNewName('');
      setNewDescription('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsLoading(true);
    setError(null);
    const authToken = token || undefined;
    try {
      const updatedCategory = await api.put(`/course-categories/${editingCategory.id}`, {
        name: editingCategory.name,
        description: editingCategory.description || null
      }, authToken);
      setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      setIsEditDialogOpen(false);
      setEditingCategory(null); // Clear editing state
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this course category?')) return;
    const authToken = token || undefined;
    try {
      await api.delete(`/course-categories/${categoryId}`, authToken);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err: unknown) {
      alert(`Failed to delete category: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  const openEditDialog = (category: CourseCategory) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
    setError(null); // Clear previous errors
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Course Categories</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD NEW CATEGORY FORM */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate}>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Add New Category</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
                <Textarea
                  label="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full bg-[#7828C8] text-white">
                  {isLoading ? 'Saving...' : 'Save Category'}
                </Button>
              </CardBody>
            </Card>
          </form>
        </div>

        {/* EXISTING CATEGORIES LIST */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Existing Categories</h2>
            </CardHeader>
            <CardBody>
              {categories.length > 0 ? (
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-900">{category.name}</p>
                        <p className="text-sm text-slate-500">{category.description || ''}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" isIconOnly={true} onPress={() => openEditDialog(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          isIconOnly={true} 
                          className="text-red-500 hover:text-red-600" 
                          onPress={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No categories created yet.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* EDIT DIALOG -> MODAL */}
      <Modal isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} className='px-4'>
        <ModalContent>
          <ModalHeader className='pl-0'>
            Edit Course Category
          </ModalHeader>
          {editingCategory && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <Input
                label="Name"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                required
              />
              <Textarea
                label="Description"
                value={editingCategory.description || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <ModalFooter>
                <Button type="button" variant="bordered" onPress={() => { setIsEditDialogOpen(false); setEditingCategory(null); }}>
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

export default CourseCategoriesPage;