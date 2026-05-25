import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Eye, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

// --- HeroUI Imports ---
import { Button } from '@heroui/button';
import { Card, CardBody } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import { Checkbox } from "@heroui/checkbox";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Input } from "@heroui/input"; // --- ADDED THIS IMPORT ---

// Types for our data
type MockTest = {
  id: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
};

type MockSeriesDetails = {
  id: string;
  title: string;
  description: string | null;
  mock_series_tests: { test: MockTest }[];
};

interface SingleSeriesPageProps {
  initialSeries: MockSeriesDetails;
  allTests: MockTest[]; // We now also fetch all available tests
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  try {
    const [series, allTests] = await Promise.all([
      api.get(`/mock-series/${id}`),
      api.get('/mock-tests'),
    ]);
    return { props: { initialSeries: series, allTests } };
  } catch (error) {
    console.error(`Failed to fetch data for mock series ${id}:`, error);
    return { notFound: true };
  }
};

const SingleSeriesPage: NextPage<SingleSeriesPageProps> = ({ initialSeries, allTests }) => {
  const { token } = useAuth();
  const router = useRouter();
  const [series, setSeries] = useState<MockSeriesDetails>(initialSeries);
  
  // State for the "Add Tests" dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  
  const [isLoading, setIsLoading] = useState(false);

  // --- ADDED STATE FOR EDITING ---
  const [editingTest, setEditingTest] = useState<Partial<MockTest> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // --- END ADDED STATE ---

  // Get a list of tests that are available to be added (i.e., not already in this series)
  const availableTests = allTests.filter(
    (test) => !series.mock_series_tests.some(({ test: seriesTest }) => seriesTest.id === test.id)
  );

  const handleAddTests = async () => {
    // ... (This function is unchanged)
    const authToken = token || undefined;
    setIsLoading(true);
    const testsToAdd = Array.from(selectedTests);
    
    try {
      await Promise.all(
        testsToAdd.map(testId => api.post(`/mock-series/${series.id}/tests/${testId}`, {}, authToken))
      );
      router.reload();
    } catch (err: unknown) {
      alert(`Failed to add tests: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
      setIsAddDialogOpen(false);
    }
  };

  const handleRemoveTest = async (testId: string) => {
    // ... (This function is unchanged)
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to remove this test from the series? The test itself will not be deleted.')) return;
    try {
      await api.delete(`/mock-series/${series.id}/tests/${testId}`, authToken);
      router.reload();
    } catch (err: unknown) {
      alert(`Failed to remove test: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };
  
  const handleTagSelection = (testId: string) => {
    // ... (This function is unchanged)
    setSelectedTests(prev => {
        const newSet = new Set(prev);
        if (newSet.has(testId)) {
            newSet.delete(testId);
        } else {
            newSet.add(testId);
        }
        return newSet;
    });
  };

  // --- ADDED FUNCTIONS FOR EDITING ---
  const openEditDialog = (testData: MockTest) => {
    setEditingTest({ ...testData });
    setIsEditDialogOpen(true);
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingTest) return;
    setIsLoading(true);

    const isEditMode = !!editingTest.id;
    // We only expect to edit from this page, so this should always be true
    const endpoint = isEditMode ? `/mock-tests/${editingTest.id}` : '/mock-tests';
    const method = isEditMode ? 'put' : 'post';
    
    try {
      const result = await api[method](endpoint, editingTest, authToken);
      
      // On success, close dialog and reload page, just like your other handlers
      setIsEditDialogOpen(false);
      router.reload();

    } catch (err: unknown) {
      alert(`Failed to save test: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };
  // --- END ADDED FUNCTIONS ---

  return (
    <div className='p-4'>
      <div className="flex items-center justify-between mb-2">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{series.title}</h1>
            <p className="text-gray-500">{series.description}</p>
        </div>
        <Button onPress={() => setIsAddDialogOpen(true)} className='bg-[#7828C8] text-white'>
            <PlusCircle className='w-4 h-4 text-white' />
            Add Test(s) to Series
        </Button>
      </div>

      <Card className="mt-6">
        <CardBody>
          <h2 className="text-xl font-bold tracking-tight mb-4">Tests in this Series</h2>
          <Table>
            <TableHeader>
                <TableColumn>Test Title</TableColumn>
                <TableColumn>Duration</TableColumn>
                <TableColumn>Marks</TableColumn>
                <TableColumn className="text-right">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {series.mock_series_tests.map(({ test }) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">
                      {test.title}
                  </TableCell>
                  <TableCell>{test.duration_minutes} min</TableCell>
                  <TableCell>{test.total_marks}</TableCell>
                  <TableCell className="flex gap-1 justify-end">
                    {/* --- THIS BUTTON IS NOW WIRED UP --- */}
                    <Button variant="ghost" size="sm" className='p-0'><Link href={`/admin/mock-tests/${test.id}`} className="hover:underline w-full flex justify-center h-full items-center">
                    <Eye className="h-4 w-4" /></Link></Button>
                    <Button variant="ghost" size="sm" onPress={() => openEditDialog(test)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onPress={() => handleRemoveTest(test.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* ADD TESTS DIALOG (Modal) */}
      <Modal isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        {/* ... (This modal is unchanged) ... */}
        <ModalContent className="sm:max-w-md">
          <ModalHeader>Add Existing Tests to Series</ModalHeader>
          <div className="h-72 my-4 overflow-y-auto">
            <div className="space-y-2 pr-4">
              {availableTests.length > 0 ? (
                availableTests.map(test => (
                  <div key={test.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50">
                    <Checkbox
                      id={`test-${test.id}`}
                      isSelected={selectedTests.has(test.id)}
                      onChange={() => handleTagSelection(test.id)}
                    />
                    <label htmlFor={`test-${test.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {test.title}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">No more tests available to add.</p>
              )}
            </div>
          </div>
          <ModalFooter>
            <Button type="button" onPress={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button type="button" onPress={handleAddTests} disabled={isLoading || selectedTests.size === 0}>
                {isLoading ? 'Adding...' : `Add ${selectedTests.size} Test(s)`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* --- ADDED EDIT TEST MODAL --- */}
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
                    isSelected={!!editingTest.is_free} // Use isSelected for heroui
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
      {/* --- END ADDED MODAL --- */}

    </div>
  );
};

export default SingleSeriesPage;