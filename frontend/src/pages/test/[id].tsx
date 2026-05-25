import { GetServerSideProps, NextPage } from "next";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BannerHeader from "@/components/shared/BannerHeader";

// Types for our data
type MockQuestion = {
  id: string;
  question_text: string;
  options: Record<string, any>;
};

type MockTestDetails = {
  id: string;
  title: string;
  duration_minutes: number;
  mock_questions: MockQuestion[];
};

interface TestPageProps {
  test: MockTestDetails;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  try {
    const test = await api.get(`/mock-tests/${id}`);
    return { props: { test } };
  } catch (error) {
    return { notFound: true };
  }
};

const TestPage: NextPage<TestPageProps> = ({ test }) => {
  const { user, isLoading: isAuthLoading, token } = useAuth();
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.duration_minutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isSubmitting) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(true); // Auto-submit when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSubmitting]);

  // Protection effect: redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return <div className="flex h-screen items-center justify-center">Authenticating & Loading Test...</div>;
  }

  const currentQuestion = test.mock_questions[currentQuestionIndex];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    const authToken = token || undefined;
    if (!isAutoSubmit && !window.confirm("Are you sure you want to submit the test?")) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await api.post(`/mock-tests/${test.id}/submit`, { answers }, authToken);
      // For now, show an alert. We will build a dedicated result page later.
      alert(`Test Submitted! Your Score: ${result.score}`);
      router.push(`/mock-tests`); // This needs to be the series ID
    } catch (err: unknown) {
      alert(`Submission failed: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{test.title}</h1>
          <div className="text-xl font-bold bg-white px-4 py-2 rounded-lg shadow-md">
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {currentQuestion ? (
          <Card>
            <CardHeader>
              <CardTitle>Question {currentQuestionIndex + 1} of {test.mock_questions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">{currentQuestion.question_text}</p>
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                className="space-y-2"
              >
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3 p-3 rounded-md border has-[[data-state=checked]]:border-blue-600">
                    <RadioGroupItem value={key} id={`option-${key}`} />
                    <Label htmlFor={`option-${key}`} className="flex-1 cursor-pointer">{value}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center py-12">No questions found for this test.</p>
        )}

        <div className="flex justify-between mt-6">
          <Button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          {currentQuestionIndex === test.mock_questions.length - 1 ? (
            <Button onClick={() => handleSubmit()} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(test.mock_questions.length - 1, prev + 1))}
            >
              Next
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestPage;