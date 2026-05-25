import { useState, useRef } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Pencil, Trash2, Upload, PlusCircle, Download } from 'lucide-react';

// --- HeroUI Imports ---
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalFooter } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';

type MockQuestion = {
  id: string;
  question_text: string;
  options: Record<string, any>;
  correct_answer: string;
  marks: number | null;
};

type MockTestDetails = {
  id: string;
  title: string;
  description: string | null;
  mock_questions: MockQuestion[];
};

interface SingleTestPageProps {
  initialTest: MockTestDetails;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  try {
    const test = await api.get(`/mock-tests/${id}`);
    return { props: { initialTest: test } };
  } catch (error) {
    console.error(`Failed to fetch mock test with id ${id}:`, error);
    return { notFound: true };
  }
};

const SingleTestPage: NextPage<SingleTestPageProps> = ({ initialTest }) => {
  const { token } = useAuth();
  const router = useRouter();
  const [test, setTest] = useState<MockTestDetails>(initialTest);
  
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [editingQuestion, setEditingQuestion] = useState<Partial<MockQuestion> | null>(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('test_id', test.id);
    try {
      const response = await api.postFormData('/mock-questions/upload/csv', formData, token || undefined);
      alert('CSV uploaded successfully!');
      router.reload();
    } catch (err: unknown) {
      alert(`Upload failed: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
      setIsCsvDialogOpen(false);
    }
  };

  const openQuestionDialog = (question: Partial<MockQuestion> | null = null) => {
    const defaultOptions = { a: '', b: '', c: '', d: '' };
    setEditingQuestion(question 
      ? { ...question, options: { ...defaultOptions, ...question.options } } 
      : { question_text: '', options: defaultOptions, correct_answer: '', marks: 1 }
    );
    setIsQuestionDialogOpen(true);
  };
  
  const handleSaveQuestion = async (e: React.FormEvent) => {
    const authToken = token || undefined;
    e.preventDefault();
    if (!editingQuestion) return;
    setIsLoading(true);

    const isEditMode = !!editingQuestion.id;
    const endpoint = isEditMode ? `/mock-questions/${editingQuestion.id}` : '/mock-questions';
    const method = isEditMode ? 'put' : 'post';

    // FIX: Filter out blank options before saving
    const cleanOptions: Record<string, any> = {};
    if (editingQuestion.options) {
      Object.entries(editingQuestion.options).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          cleanOptions[key] = value;
        }
      });
    }
    
    const payload = { 
      ...editingQuestion,
      options: cleanOptions, // Use the cleaned options
      test_id: Number(test.id) 
    };

    try {
      await api[method](endpoint, payload, authToken);
      router.reload();
    } catch (err: unknown) {
      alert(`Failed to save question: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
      setIsQuestionDialogOpen(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const authToken = token || undefined;
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/mock-questions/${questionId}`, authToken);
      router.reload();
    } catch (err: unknown) {
      alert(`Failed to delete question: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    }
  };

  const downloadSampleCsv = () => {
    const sampleData = [
      ['question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer'],
      ['What is 2 + 2?', '3', '4', '5', '6', 'b'],
      ['What is the capital of France?', 'Berlin', 'Paris', 'Madrid', 'Rome', 'b'],
      ['Which is a programming language?', 'Python', 'Snake', 'Cobra', 'Viper', 'a']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_questions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='p-4'>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{test.title}</h1>
          <p className="text-gray-500">{test.description || 'Manage the questions for this test below.'}</p>
        </div>
        <div className="flex gap-2">
            <Button onPress={() => openQuestionDialog()} className='bg-[#7828C8] text-white'>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
            </Button>
            <Button variant="bordered" onPress={() => setIsCsvDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload CSV
            </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardBody>
          <h2 className="text-xl font-bold tracking-tight mb-4">Questions ({test.mock_questions.length})</h2>
          <Table>
            <TableHeader>
                <TableColumn className="w-[50%]">Question Text</TableColumn>
                <TableColumn>Options</TableColumn>
                <TableColumn>Correct Answer</TableColumn>
                <TableColumn>Marks</TableColumn>
                <TableColumn className="text-right">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {test.mock_questions.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.question_text}</TableCell>
                  <TableCell>
                    {/* Replaced Tooltip with Popover to support complex content */}
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="bordered" size="sm">View</Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <pre className="text-xs">{JSON.stringify(q.options, null, 2)}</pre>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>{q.correct_answer}</TableCell>
                  <TableCell>{q.marks}</TableCell>
                  <TableCell className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onPress={() => openQuestionDialog(q)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onPress={() => handleDeleteQuestion(q.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* CSV Upload Modal */}
      <Modal isOpen={isCsvDialogOpen} onOpenChange={setIsCsvDialogOpen} className='px-4'>
        <ModalContent>
          <ModalHeader className='pl-0'>Bulk Upload Questions</ModalHeader>
          <form onSubmit={handleCsvUpload} className="space-y-4 py-4">
            <div className="space-y-2">
                <Input 
                    id="csv-file" 
                    type="file" 
                    label="CSV File"
                    accept=".csv" 
                    ref={fileInputRef}
                    onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                    required 
                />
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                      <strong>Required columns:</strong> question_text, option_a, option_b, option_c, option_d, correct_answer
                  </p>
                  <p className="text-xs text-gray-500">
                      <strong>Correct answer:</strong> Use the letter (a, b, c, d) that matches the correct option
                  </p>
                  <Button 
                    type="button" 
                    variant="flat" 
                    size="sm" 
                    onPress={downloadSampleCsv}
                    className="mt-2"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download Sample CSV
                  </Button>
                </div>
            </div>
            <ModalFooter>
              <Button type="button" variant="bordered" onPress={() => setIsCsvDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading} className='bg-[#7828C8] text-white'>{isLoading ? 'Uploading...' : 'Upload File'}</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      
      {/* Create/Edit Question Modal */}
      <Modal isOpen={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen} className='px-4'>
        <ModalContent className="sm:max-w-[600px]">
          <ModalHeader className='pl-0'>{editingQuestion?.id ? 'Edit' : 'Create'} Question</ModalHeader>
          {editingQuestion && (
            <form onSubmit={handleSaveQuestion} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Textarea label="Question Text" id="q-text" value={editingQuestion.question_text || ''} onChange={(e) => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(editingQuestion.options || {}).map(key => (
                    <div key={key} className="space-y-2">
                        <Input id={`q-opt-${key}`} label="Option" value={editingQuestion.options?.[key] || ''} onChange={(e) => setEditingQuestion({ ...editingQuestion, options: {...editingQuestion.options, [key]: e.target.value }})} />
                    </div>
                ))}
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Input id="q-correct" label="Correct Answer Key" value={editingQuestion.correct_answer || ''} onChange={(e) => setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })} placeholder="e.g., 'a'" required/>
                </div>
                <div className="space-y-2">
                    <Input id="q-marks" label="Marks" type="number" value={String(editingQuestion.marks)} onChange={(e) => setEditingQuestion({ ...editingQuestion, marks: parseInt(e.target.value) })} required/>
                </div>
              </div>
              {/* Added original sticky classes to ModalFooter for scrolling form */}
              <ModalFooter className="sticky bottom-0 bg-white pt-4"> 
                <Button type="button" variant="bordered" onPress={() => setIsQuestionDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading} className='bg-[#7828C8] text-white'>{isLoading ? 'Saving...' : 'Save Question'}</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SingleTestPage;