import { useState } from 'react';
import Link from 'next/link';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CirclePlus, Eye, Pencil, Trash2 } from 'lucide-react';

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {  Modal,  ModalContent,  ModalHeader,  ModalFooter} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import {Select, SelectItem} from "@heroui/select"; // Fixed import
import { Checkbox } from "@heroui/checkbox";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@heroui/table";

// --- ADDED TYPE ---
type MockTest = {
  id: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
};
// --- END ADDED TYPE ---

type MockCategory = { id: string; name: string; };
type MockTag = { id: string; name: string; };
type MockSeries = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  price: number | null;
  category_id: string;
  mock_categories: { name: string; };
  mock_series_tags: { tag: { id: string; name: string; } }[];
};

interface MockSeriesPageProps {
  initialSeries: MockSeries[];
  mockCategories: MockCategory[];
  mockTags: MockTag[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [series, categories, tags] = await Promise.all([
      api.get('/mock-series'),
      api.get('/mock-categories'),
      api.get('/mock-tags'),
    ]);
    return { props: { initialSeries: series, mockCategories: categories, mockTags: tags } };
  } catch (error) {
    console.error('Failed to fetch mock series data:', error);
    return { props: { initialSeries: [], mockCategories: [], mockTags: [] } };
  }
};

const MockSeriesPage: NextPage<MockSeriesPageProps> = ({ initialSeries, mockCategories, mockTags }) => {
  const { token } = useAuth();
  const [series, setSeries] = useState<MockSeries[]>(initialSeries);
  const [editingSeries, setEditingSeries] = useState<Partial<MockSeries> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // --- ADDED MOCK TEST STATE ---
  const [tests, setTests] = useState<MockTest[]>([]); // We need this for the save handler
  const [editingTest, setEditingTest] = useState<Partial<MockTest & { series_id: string }> | null>(null);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  // --- END ADDED STATE ---

  const openDialog = (seriesData: Partial<MockSeries> | null = null) => {
    setEditingSeries(seriesData ? { ...seriesData } : { title: '', description: '', price: 0, category_id: '', mock_series_tags: [] });
    setThumbnailFile(null);
    setIsEditDialogOpen(true);
  };

  // --- ADDED FUNCTION to open the test modal ---
  const openMockDialog = (seriesId: string) => {
    // Set up a new test object, crucially adding the series_id
    setEditingTest({
      title: '',
      duration_minutes: 90,
      total_marks: 100,
      is_free: false,
      series_id: seriesId // This links the test to the series
    });
    setIsTestDialogOpen(true); // Use the new state variable
  };
  // --- END ADDED FUNCTION ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    // ... (This function remains unchanged)
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingSeries || !editingSeries.category_id) {
      alert("Category is required.");
      return;
    }
    setIsLoading(true);

    const isEditMode = !!editingSeries.id;
    const endpoint = isEditMode ? `/mock-series/${editingSeries.id}` : '/mock-series';

    const formData = new FormData();

    formData.append('title', editingSeries.title || '');
    formData.append('price', (editingSeries.price || 0).toString());
    formData.append('category_id', editingSeries.category_id);
    
    if (editingSeries.description) {
      formData.append('description', editingSeries.description);
    }

    const tagIds = editingSeries.mock_series_tags
      ?.map(t => t.tag.id)
      .join(',') || '';
      
    if (tagIds) {
      formData.append('tagIds', tagIds);
    }

    if (thumbnailFile) {
      formData.append('file', thumbnailFile);
    }

    try {
      let result;

      if (isEditMode) {
        result = await api.putFormData(endpoint, formData, authToken);
      } else {
        result = await api.postFormData(endpoint, formData, authToken);
      }
      
      if (isEditMode) {
        setSeries(prev => prev.map(s => (s.id === result.id ? result : s)));
      } else {
        setSeries(prev => [...prev, result]);
      }
      setIsEditDialogOpen(false);
    } catch (err: unknown) {
      alert(`Failed to save series: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (seriesId: string) => {
    // ... (This function remains unchanged)
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to delete this series? This will also delete all tests within it.')) return;
    try {
      await api.delete(`/mock-series/${seriesId}`, authToken);
      setSeries(prev => prev.filter(s => s.id !== seriesId));
    } catch (err: unknown) {
      alert(`Failed to delete series: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  // --- ADDED FUNCTION to save the new test ---
  const handleSaveTest = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingTest) return;
    setIsLoading(true);

    // A new test won't have an ID, so isEditMode will be false
    const isEditMode = !!editingTest.id;
    const endpoint = isEditMode ? `/mock-tests/${editingTest.id}` : '/mock-tests';
    const method = isEditMode ? 'put' : 'post';
    
    try {
      // The editingTest object (which includes series_id) is sent
      const result = await api[method](endpoint, editingTest, authToken);
      
      if (isEditMode) {
        setTests(prev => prev.map(t => (t.id === result.id ? result : t)));
      } else {
        setTests(prev => [...prev, result]);
      }
      setIsTestDialogOpen(false); // Close the correct modal
    } catch (err: unknown) {
      alert(`Failed to save test: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };
  // --- END ADDED FUNCTION ---

  return (
    <div className='p-4'>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage Test Series</h1>
        <Button onPress={() => openDialog()} className='bg-[#7828C8] text-white'>Create New Series</Button>
      </div>
      <Card>
        <CardBody className="mt-6">
          <Table>
            <TableHeader>
                <TableColumn>Title</TableColumn>
                <TableColumn>Category</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn className='text-right'>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {series.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                      {s.title}
                  </TableCell>
                  <TableCell>{s.mock_categories?.name || 'N/A'}</TableCell>
                  <TableCell>{s.price ? `₹${s.price}` : 'Free'}</TableCell>
                  <TableCell className='gap-2 flex justify-end'>
                    <Button variant="ghost" size="sm" onPress={() => openMockDialog(s.id)}><CirclePlus className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className='p-0'><Link href={`/admin/mock-tests/mock-test-series/${s.id}`} className="hover:underline w-full flex justify-center h-full items-center">
                    <Eye className="h-4 w-4" /></Link></Button>
                    <Button variant="ghost" size="sm" onPress={() => openDialog(s)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onPress={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* This is your existing "Edit Series" Modal */}
      <Modal isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} className='px-4'>
        <ModalContent className="sm:max-w-[600px]">
          <ModalHeader className='pl-0'>{editingSeries?.id ? 'Edit' : 'Create'} Test Series</ModalHeader>
          {editingSeries && (
            <form onSubmit={handleSave} className="space-y-4 py-4">
              {/* ... (Your series form fields remain unchanged) ... */}
              <div className="space-y-2">
                <Input id="title" label="Title" value={editingSeries.title} onChange={(e) => setEditingSeries({ ...editingSeries, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Textarea id="description" label="Description" value={editingSeries.description || ''} onChange={(e) => setEditingSeries({ ...editingSeries, description: e.target.value })} />
              </div>
              
              <div className="space-y-2">
                <Input 
                  id="thumbnail-file" 
                  label="Thumbnail Image"
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                {!thumbnailFile && editingSeries.id && editingSeries.thumbnail_url && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Current thumbnail:</p>
                    <img 
                      src={editingSeries.thumbnail_url} 
                      alt="Current thumbnail" 
                      className="w-24 h-24 object-cover rounded-md border" 
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input id="price" label="Price" type="number" onChange={(e) => setEditingSeries({ ...editingSeries, price: parseFloat(e.target.value) })} required />
                </div>
                {/* --- SELECT FIXES --- */}
                <div className="space-y-2">
                  <Select 
                    label="Category"
                    placeholder="Select a category..."
                    value={editingSeries.category_id?.toString()} 
                    onChange={(e) => setEditingSeries({ ...editingSeries, category_id: e.target.value })} 
                    required
                  >
                    {mockCategories.map(cat => (
                      <SelectItem key={cat.id}> 
                        {cat.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                {/* --- LABEL FIX --- */}
                <label className="text-sm font-medium">Tags</label>
                <div className="grid grid-cols-3 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto">
                  {mockTags.map(tag => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      {/* --- CHECKBOX FIXES --- */}
                      <Checkbox
                        id={`tag-${tag.id}`}
                        isSelected={editingSeries.mock_series_tags?.some(t => t.tag.id === tag.id)}
                        onChange={(selected) => {
                          const currentTags = editingSeries.mock_series_tags?.map(t => t.tag) || [];
                          const newTags = selected
                            ? [...currentTags, tag]
                            : currentTags.filter(t => t.id !== tag.id);
                          setEditingSeries({ ...editingSeries, mock_series_tags: newTags.map(t => ({ tag: t })) });
                        }}
                      />
                      {/* --- LABEL FIX --- */}
                      <label htmlFor={`tag-${tag.id}`} className="text-sm cursor-pointer select-none">
                        {tag.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <ModalFooter>
                <Button type="button" onPress={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className='bg-[#7828C8] text-white' disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* --- ADDED "Create Test" Modal --- */}
      <Modal isOpen={isTestDialogOpen} onOpenChange={setIsTestDialogOpen} className='px-4'>
        <ModalContent>
          {/* We only support creating, so the title is simpler */}
          <ModalHeader className='pl-0'>Create Mock Test</ModalHeader>
          {editingTest && (
            <form onSubmit={handleSaveTest} className="space-y-4 py-4">
               <div className="space-y-2">
                <Input id="title" label="Test Title" value={editingTest.title || ''} onChange={(e) => setEditingTest({ ...editingTest, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input id="duration" label="Duration (Minutes)" type="number" value={String(editingTest.duration_minutes)} onChange={(e) => setEditingTest({ ...editingTest, duration_minutes: parseInt(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Input id="marks" label="Total Marks" type="number" value={String(editingTest.total_marks)} onChange={(e) => setEditingTest({ ...editingTest, total_marks: parseInt(e.target.value) })} required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_free" 
                    isSelected={editingTest.is_free} // Use isSelected for heroui/checkbox
                    onChange={(selected) => setEditingTest({ ...editingTest, is_free: !!selected })}
                  />
                  <label htmlFor="is_free">Is this a free test?</label>
              </div>
              <ModalFooter>
                {/* Ensure this button uses the correct state */}
                <Button type="button"  onPress={() => setIsTestDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className='bg-[#7828C8] text-white' disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Test'}</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
      {/* --- END ADDED MODAL --- */}
    </div>
  );
};

export default MockSeriesPage;