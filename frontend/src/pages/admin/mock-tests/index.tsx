import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {  Modal,  ModalContent,  ModalHeader,  ModalFooter} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Checkbox } from '@heroui/checkbox';
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@heroui/table";

type MockTest = {
  id: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
};

interface AllMockTestsPageProps {
  initialTests: MockTest[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const tests = await api.get('/mock-tests');
    return { props: { initialTests: tests } };
  } catch (error) {
    console.error('Failed to fetch mock tests:', error);
    return { props: { initialTests: [] } };
  }
};

const AllMockTestsPage: NextPage<AllMockTestsPageProps> = ({ initialTests }) => {
  const { token } = useAuth();
  const [tests, setTests] = useState<MockTest[]>(initialTests);
  const [editingTest, setEditingTest] = useState<Partial<MockTest> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = (testData: Partial<MockTest> | null = null) => {
    setEditingTest(testData ? { ...testData } : { title: '', duration_minutes: 90, total_marks: 100, is_free: false });
    setIsEditDialogOpen(true);
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingTest) return;
    setIsLoading(true);

    const isEditMode = !!editingTest.id;
    const endpoint = isEditMode ? `/mock-tests/${editingTest.id}` : '/mock-tests';
    const method = isEditMode ? 'put' : 'post';
    
    try {
      const result = await api[method](endpoint, editingTest, authToken);
      if (isEditMode) {
        setTests(prev => prev.map(t => (t.id === result.id ? result : t)));
      } else {
        setTests(prev => [...prev, result]);
      }
      setIsEditDialogOpen(false);
    } catch (err: unknown) {
      alert(`Failed to save test: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to permanently delete this test?')) return;
    try {
      await api.delete(`/mock-tests/${testId}`, authToken);
      setTests(prev => prev.filter(t => t.id !== testId));
    } catch (err: unknown) {
      alert(`Failed to delete test: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  return (
    <div className='p-4'>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage All Mock Tests</h1>
        <Button onPress={() => openDialog()} className='bg-[#7828C8] text-white'>Create New Test</Button>
      </div>
      <Card>
        <CardBody className="">
          <Table>
            <TableHeader>
                <TableColumn>Title</TableColumn>
                <TableColumn>Duration</TableColumn>
                <TableColumn>Marks</TableColumn>
                <TableColumn>Free</TableColumn>
                <TableColumn className="text-right">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {tests.map(test => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium"><Link href={`/admin/mock-tests/${test.id}`} className="hover:underline">
                    {test.title}
                    </Link></TableCell>
                  <TableCell>{test.duration_minutes} min</TableCell>
                  <TableCell>{test.total_marks}</TableCell>
                  <TableCell>{test.is_free ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onPress={() => openDialog(test)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 ml-1" onPress={() => handleDeleteTest(test.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} className='px-4'>
        <ModalContent>
          <ModalHeader className='pl-0'>{editingTest?.id ? 'Edit' : 'Create'} Mock Test</ModalHeader>
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
                    checked={editingTest.is_free} 
                    onChange={(checked) => setEditingTest({ ...editingTest, is_free: !!checked })}
                  />
                  <label htmlFor="is_free">Is this a free test?</label>
              </div>
              <ModalFooter>
                <Button type="button"  onPress={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className='bg-[#7828C8] text-white' disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Test'}</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AllMockTestsPage;