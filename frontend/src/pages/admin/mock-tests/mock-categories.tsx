import { useState, useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import {  Modal,  ModalContent,  ModalHeader,  ModalFooter} from "@heroui/modal";

type MockCategory = {
  id: string;
  name: string;
  description: string | null;
};

interface MockCategoriesPageProps {
  initialCategories: MockCategory[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const categories = await api.get('/mock-categories');
    return { props: { initialCategories: categories } };
  } catch (error) {
    console.error('Failed to fetch mock categories:', error);
    return { props: { initialCategories: [] } };
  }
};

const MockCategoriesPage: NextPage<MockCategoriesPageProps> = ({ initialCategories }) => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<MockCategory[]>(initialCategories);

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [editingCategory, setEditingCategory] = useState<MockCategory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newCategory = await api.post('/mock-categories', { name: newName, description: newDescription || null }, authToken);
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
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingCategory) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedCategory = await api.put(`/mock-categories/${editingCategory.id}`, {
        name: editingCategory.name,
        description: editingCategory.description || null
      }, authToken);
      setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
      setIsEditDialogOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to delete this mock category?')) return;
    try {
      await api.delete(`/mock-categories/${categoryId}`, authToken);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err: unknown) {
      alert(`Failed to delete category: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  const openEditDialog = (category: MockCategory) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Manage Mock Test Categories</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate}>
            <Card>
              <CardHeader>Add New Category</CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-2">
                  <Input id="newName" label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Textarea id="newDescription" label="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" disabled={isLoading} className="w-full bg-[#7828C8] text-white">{isLoading ? 'Saving...' : 'Save Category'}</Button>
              </CardBody>
            </Card>
          </form>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>Existing Categories</CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.id} className="p-2 rounded-lg bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">{category.name}</p>
                      <p className="text-sm text-slate-500">{category.description || ''}</p>
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
      <Modal isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} className='px-4'>
        <ModalContent>
          <ModalHeader className='pl-0'>Edit Mock Category</ModalHeader>
          {editingCategory && (
            <form onSubmit={handleUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Input id="editName" label="Name" value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Textarea id="editDescription" label="Description" value={editingCategory.description || ''} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} />
              </div>
              <ModalFooter>
                <Button type="button" onPress={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className='bg-[#7828C8] text-white'>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MockCategoriesPage;