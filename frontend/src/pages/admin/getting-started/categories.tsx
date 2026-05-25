import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@heroui/button';
import { Card, CardHeader, CardBody } from '@heroui/card'; // CardFooter was unused
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Input } from '@heroui/input';
import { Textarea } from '@heroui/input';
import { useAuth } from '@/context/AuthContext';
import { Post } from '../posts';

// Define the type for a single category
export type Category = {
  id: string;
  name: string;
  description: string | null;
  posts?: Post[] | null;
};

interface CategoriesPageProps {
  initialCategories: Category[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const categories = await api.get('/categories');
    return { props: { initialCategories: categories } };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return { props: { initialCategories: [] } };
  }
};

const CategoriesPage: NextPage<CategoriesPageProps> = ({ initialCategories }) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // State for "Add New" form
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // State for "Edit" dialog
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authToken = token ?? undefined;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newCategory = await api.post(
        '/categories',
        {
          name: newName,
          description: newDescription?.trim() || undefined,
        },
        authToken
      );
      setCategories((prev) => [...prev, newCategory]);
      setNewName('');
      setNewDescription('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create category.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsLoading(true);
    setError(null);
    try {
      const updatedCategory = await api.put(
        `/categories/${editingCategory.id}`,
        {
          name: editingCategory.name,
          description: editingCategory.description?.trim() || undefined,
        },
        authToken
      );

      setCategories((prev) =>
        prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
      );
      setIsEditDialogOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update category.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    try {
      await api.delete(`/categories/${categoryId}`, authToken);
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Failed to delete category: ${err.message}`);
      } else {
        alert('Failed to delete category.');
      }
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Categories</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD NEW CATEGORY FORM */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate}>
            <Card className="bg-white rounded-2xl p-2 shadow-sm">
              <CardHeader>
                <h1 className="font-semibold">Add New Category</h1>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-2">
                  <Input
                    label="Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    variant="bordered"
                    classNames={{ inputWrapper: 'bg-[#F9F8FB]' }}
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    label="Description"
                    id="newDescription"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    variant="bordered"
                    classNames={{ inputWrapper: 'bg-[#F9F8FB]' }}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#7828C8] text-white rounded-md"
                >
                  {isLoading ? 'Saving...' : 'Save Category'}
                </Button>
              </CardBody>
            </Card>
          </form>
        </div>

        {/* EXISTING CATEGORIES LIST */}
        <div className="lg:col-span-2">
          <Card className="bg-white rounded-2xl p-2 shadow-sm">
            <CardHeader>
              <h1 className="font-semibold">Existing Categories</h1>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="p-3 bg-slate-50 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{category.name}</p>
                      <p className="text-sm text-slate-500">
                        {category.description || ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        variant="ghost"
                        onPress={() => openEditDialog(category)}
                        aria-label="Edit category"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onPress={() => handleDelete(category.id)}
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

      <Modal
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        className="bg-white"
      >
        <ModalContent>
          <ModalHeader>Edit Category</ModalHeader>
          {editingCategory && (
            <form onSubmit={handleUpdate} className="">
              <ModalBody>
                <div className="space-y-2">
                  <Input
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                    required
                    variant="bordered"
                    classNames={{ inputWrapper: 'bg-[#F9F8FB]' }}
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    label="Description"
                    placeholder="Enter your description"
                    value={editingCategory.description || ''}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        description: e.target.value,
                      })
                    }
                    variant="bordered"
                    classNames={{ inputWrapper: 'bg-[#F9F8FB]' }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onPress={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#7828C8] text-white rounded-md"
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

export default CategoriesPage;