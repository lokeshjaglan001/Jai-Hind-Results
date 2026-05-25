import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Target,
  Award,
  FileText,
  TrendingUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: Record<string, string>;
  correct_answer: string;
  marks: number;
}

interface MockTest {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  mock_questions: Question[];
}

interface AttemptData {
  id: string;
  test_id: string;
  user_id: string;
  answers: Record<string, string>;
  score: number;
  started_at: string;
  completed_at: string;
  mock_tests: MockTest;
  users: {
    id: string;
    full_name: string;
    email: string;
  };
}

export default function TestResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token, user, isLoading: authLoading } = useAuth();
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchAttempt = async () => {
      if (!id || !token) return;

      try {
        setLoading(true);
        const data = await api.get(`/mock-tests/attempts/${id}`, token);
        setAttempt(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load test results');
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchAttempt();
    }
  }, [id, token]);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading Results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !attempt) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error || 'Result not found'}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Button asChild>
              <Link href="/dashboard/results">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalQuestions = attempt.mock_tests.mock_questions.length;
  const totalMarks = attempt.mock_tests.total_marks;
  const percentage = totalMarks > 0 ? Math.round((attempt.score / totalMarks) * 100) : 0;
  
  // Calculate correct and incorrect answers
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  attempt.mock_tests.mock_questions.forEach((question) => {
    const userAnswer = attempt.answers[question.id.toString()];
    if (!userAnswer) {
      unansweredCount++;
    } else if (userAnswer === question.correct_answer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getPerformanceMessage = () => {
    if (percentage >= 80) return { message: 'Outstanding Performance! 🎉', color: 'text-green-600' };
    if (percentage >= 60) return { message: 'Good Job! Keep it up! 👍', color: 'text-blue-600' };
    if (percentage >= 40) return { message: 'You can do better! 💪', color: 'text-yellow-600' };
    return { message: 'Keep practicing! 📚', color: 'text-red-600' };
  };

  const performance = getPerformanceMessage();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Test Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {attempt.mock_tests.title}
          </h1>
          <p className="text-gray-600">{attempt.mock_tests.description}</p>
        </div>

        {/* Score Card */}
        <Card className={`mb-6 border-2 ${getScoreColor()}`}>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-lg font-medium mb-2">Your Score</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-bold">{percentage}%</span>
                  <span className="text-2xl text-gray-600">
                    ({attempt.score}/{totalMarks})
                  </span>
                </div>
                <p className={`text-xl font-semibold mt-3 ${performance.color}`}>
                  {performance.message}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{correctCount}</p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
                  <p className="text-sm text-gray-600">Incorrect</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-600">{unansweredCount}</p>
                  <p className="text-sm text-gray-600">Skipped</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Questions</p>
                  <p className="text-2xl font-bold">{totalQuestions}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Marks</p>
                  <p className="text-2xl font-bold">{totalMarks}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="text-2xl font-bold">{attempt.mock_tests.duration_minutes}</p>
                  <p className="text-xs text-gray-500">minutes</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed On</p>
                  <p className="text-sm font-bold">
                    {new Date(attempt.completed_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(attempt.completed_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toggle Answers Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Question Review</h2>
          <Button
            variant={showAnswers ? 'default' : 'outline'}
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? 'Hide Answers' : 'Show Correct Answers'}
          </Button>
        </div>

        {/* Questions Review */}
        <div className="space-y-4">
          {attempt.mock_tests.mock_questions.map((question, index) => {
            const userAnswer = attempt.answers[question.id.toString()];
            const isCorrect = userAnswer === question.correct_answer;
            const isUnanswered = !userAnswer;

            return (
              <Card
                key={question.id}
                className={`border-2 ${
                  isUnanswered
                    ? 'border-gray-300'
                    : isCorrect
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Question {index + 1}</Badge>
                        <Badge variant="outline">{question.marks} marks</Badge>
                        {isUnanswered ? (
                          <Badge variant="secondary" className="bg-gray-200">
                            <FileText className="w-3 h-3 mr-1" />
                            Unanswered
                          </Badge>
                        ) : isCorrect ? (
                          <Badge className="bg-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Correct
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Incorrect
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{question.question_text}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {question.question_type === 'mcq' &&
                      Object.entries(question.options || {}).map(([key, value]) => {
                        const isUserAnswer = userAnswer === key;
                        const isCorrectAnswer = question.correct_answer === key;

                        return (
                          <div
                            key={key}
                            className={`p-3 rounded-lg border-2 ${
                              showAnswers && isCorrectAnswer
                                ? 'border-green-500 bg-green-100'
                                : isUserAnswer && !isCorrect
                                ? 'border-red-500 bg-red-100'
                                : isUserAnswer
                                ? 'border-blue-500 bg-blue-100'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{key}.</span>
                                <span>{value}</span>
                              </div>
                              {isUserAnswer && (
                                <Badge variant="secondary" className="text-xs">
                                  Your Answer
                                </Badge>
                              )}
                              {showAnswers && isCorrectAnswer && (
                                <Badge className="bg-green-600 text-xs">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Correct Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}

                    {question.question_type !== 'mcq' && (
                      <div className="space-y-2">
                        <div
                          className={`p-3 rounded-lg border-2 ${
                            isCorrect
                              ? 'border-green-500 bg-green-100'
                              : 'border-red-500 bg-red-100'
                          }`}
                        >
                          <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                          <p className="font-medium">{userAnswer || 'Not answered'}</p>
                        </div>
                        {showAnswers && (
                          <div className="p-3 rounded-lg border-2 border-green-500 bg-green-100">
                            <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
                            <p className="font-medium">{question.correct_answer}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/mock-tests">
              <TrendingUp className="w-4 h-4 mr-2" />
              Take More Tests
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
