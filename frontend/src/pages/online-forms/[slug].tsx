import React, { useState, JSX } from 'react';
import { GetServerSideProps } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle2, Loader2, IndianRupee, FileText, Shield } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

interface FormField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[] | null;
  order: number;
  meta?: Record<string, any>;
}

interface Form {
  id: string;
  title: string;
  slug: string;
  description?: string;
  published: boolean;
  price: number;
  fields: FormField[];
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

interface Submission {
  id: string;
  form_id: string;
  user_id: number;
  data: Record<string, any>;
  paid: boolean;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface SingleFormPageProps {
  form: Form | null;
}

const SingleFormPage: React.FC<SingleFormPageProps> = ({ form: initialForm }) => {
  const [form] = useState<Form | null>(initialForm);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (!initialForm) return {};
    const initialData: Record<string, any> = {};
    initialForm.fields.forEach(field => {
      initialData[field.key] = field.type === 'checkbox' ? false : '';
    });
    return initialData;
  });
  const [files, setFiles] = useState<Record<string, File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false);
  const [unpaidSubmission, setUnpaidSubmission] = useState<Submission | null>(null);
  const [checkingSubmission, setCheckingSubmission] = useState<boolean>(true);
  const { user } = useAuth();

  // Check if user has already submitted
  React.useEffect(() => {
    const checkSubmission = async () => {
      if (!user || !form) {
        setCheckingSubmission(false);
        return;
      }

      try {
        const response = await api.get(`/forms/${form.id}/check-submission/${user.id}`);
        if (response.hasSubmitted) {
          // Check if the submission is unpaid
          if (response.submission && !response.submission.paid && form.price > 0) {
            setUnpaidSubmission(response.submission);
          } else {
            setAlreadySubmitted(true);
          }
        }
      } catch (error) {
        console.error('Error checking submission:', error);
      } finally {
        setCheckingSubmission(false);
      }
    };

    checkSubmission();
  }, [user, form]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (form) {
      form.fields.forEach(field => {
        if (field.required) {
          // Check file fields
          if (field.type === 'file') {
            if (!files[field.key]) {
              newErrors[field.key] = `${field.label} is required`;
            }
          } else {
            // Check text/other fields
            const value = formData[field.key];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              newErrors[field.key] = `${field.label} is required`;
            }
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setErrors({ submit: 'You must be logged in to submit this form' });
      return;
    }

    try {
      setSubmitting(true);
      
      // Create FormData for file upload
      const submitFormData = new FormData();
      submitFormData.append('formId', form!.id);
      submitFormData.append('userId', user.id.toString());
      submitFormData.append('data', JSON.stringify(formData));

      // Append files with their field key as the field name
      Object.entries(files).forEach(([key, file]) => {
        submitFormData.append(key, file);
      });

      // Make request with FormData using api.ts
      const token = localStorage.getItem('token') || undefined;
      const response: { submission: Submission; order?: RazorpayOrder } = await api.postFormData(
        '/forms/submit',
        submitFormData,
        token
      );
      
      if (response.order) {
        // Paid form - initiate payment
        initiateRazorpayPayment(response.order, response.submission);
      } else {
        // Free form - show success
        setSubmitted(true);
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to submit form' });
    } finally {
      setSubmitting(false);
    }
  };

  const initiateRazorpayPayment = (order: RazorpayOrder, submission: Submission): void => {
    const options: RazorpayOptions = {
      key: process.env.RAZORPAY_KEY_ID ?? "", // Replace with your Razorpay key
      amount: order.amount,
      currency: order.currency,
      name: form!.title,
      description: form!.description || 'Form Submission Payment',
      order_id: order.id,
      handler: async (response: RazorpayResponse) => {
        try {
          await api.post('/forms/verify-payment', {
            submissionId: submission.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          });
          
          setSubmitted(true);
        } catch (error) {
          setErrors({ payment: 'Payment verification failed' });
        }
      },
      prefill: {
        name: formData.name || '',
        email: formData.email || '',
        contact: formData.phone || formData.mobile || ''
      },
      theme: {
        color: '#3b82f6'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleInputChange = (key: string, value: any): void => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  const handleFileChange = (key: string, file: File): void => {
    setFiles({ ...files, [key]: file });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  const renderField = (field: FormField): JSX.Element | null => {
    const fieldError = errors[field.key];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type={field.type}
              value={formData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.label}
              className={fieldError ? 'border-red-500' : ''}
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.key}
              value={formData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.label}
              rows={4}
              className={fieldError ? 'border-red-500' : ''}
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formData[field.key] || ''}
              onValueChange={(value) => handleInputChange(field.key, value)}
            >
              <SelectTrigger className={fieldError ? 'border-red-500' : ''}>
                <SelectValue placeholder={`Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, idx) => (
                  <SelectItem key={idx} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.key} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              value={formData[field.key] || ''}
              onValueChange={(value) => handleInputChange(field.key, value)}
            >
              {field.options?.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.key}-${idx}`} />
                  <Label htmlFor={`${field.key}-${idx}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.key} className="flex items-center space-x-2">
            <Checkbox
              id={field.key}
              checked={formData[field.key] || false}
              onCheckedChange={(checked) => handleInputChange(field.key, checked)}
            />
            <Label htmlFor={field.key} className="font-normal cursor-pointer">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {fieldError && <p className="text-sm text-red-500 ml-6">{fieldError}</p>}
          </div>
        );

      case 'file':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id={field.key}
                type="file"
                onChange={(e) => e.target.files && handleFileChange(field.key, e.target.files[0])}
                className={fieldError ? 'border-red-500' : ''}
              />
              {files[field.key] && (
                <span className="text-sm text-green-600 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Uploaded
                </span>
              )}
            </div>
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.key}
              type="date"
              value={formData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={fieldError ? 'border-red-500' : ''}
            />
            {fieldError && <p className="text-sm text-red-500">{fieldError}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (!form) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg border-4 border-red-200">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-red-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Form Not Found</h2>
              <p className="text-gray-600 text-lg mb-8">
                The form you're looking for doesn't exist or has been removed.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-emerald-800 to-emerald-500 hover:from-emerald-700 hover:to-emerald-400 text-white"
                  onClick={() => window.location.href = '/offline-forms'}
                >
                  View All Forms
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg border-4 border-emerald-200">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Form Submitted Successfully!</h2>
              <p className="text-gray-600 text-lg mb-8">
                Thank you for your submission. We have received your information.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-emerald-800 to-emerald-500 hover:from-emerald-700 hover:to-emerald-400 text-white"
                  onClick={() => window.location.href = '/offline-forms'}
                >
                  View All Forms
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading state while checking submission
  if (checkingSubmission) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg">
            <CardContent className="p-10 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-emerald-600" />
              <p className="text-gray-600 text-lg">Checking your submission status...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Show message if user has already submitted
  if (alreadySubmitted) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg border-4 border-yellow-200">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-yellow-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Already Submitted</h2>
              <p className="text-gray-600 text-lg mb-8">
                You have already submitted this form. Only one submission per user is allowed.
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-emerald-800 to-emerald-500 hover:from-emerald-700 hover:to-emerald-400 text-white"
                  onClick={() => window.location.href = '/offline-forms'}
                >
                  View All Forms
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Show payment button if user has unpaid submission
  if (unpaidSubmission) {
    const handlePayment = async () => {
      try {
        setSubmitting(true);
        // Create new payment order for existing submission
        const orderResponse = await api.post('/forms/create-payment-order', {
          submissionId: unpaidSubmission.id,
          amount: form!.price
        });

        if (orderResponse.order) {
          initiateRazorpayPayment(orderResponse.order, unpaidSubmission);
        }
      } catch (error: any) {
        setErrors({ payment: error.message || 'Failed to create payment order' });
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <Card className="shadow-lg border-4 border-orange-200">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <IndianRupee className="w-12 h-12 text-orange-700" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Payment Pending</h2>
              <p className="text-gray-600 text-lg mb-4">
                You have submitted this form but payment is still pending.
              </p>
              <p className="text-gray-700 text-xl font-bold mb-8">
                Amount to Pay: ₹{form!.price}
              </p>
              
              {errors.payment && (
                <Alert className="border-red-500 bg-red-50 mb-6">
                  <AlertDescription className="text-red-700">{errors.payment}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3">
                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-r from-emerald-800 to-emerald-500 hover:from-emerald-700 hover:to-emerald-400 text-white font-semibold"
                  onClick={handlePayment}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <IndianRupee className="w-5 h-5 mr-2" />
                      Complete Payment
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => window.location.href = '/offline-forms'}
                >
                  View All Forms
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 hover:bg-white"
          onClick={() => window.location.href = '/online-forms'}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forms
        </Button>

        {/* Form Header Card */}
        <Card className="shadow-lg border-4 border-emerald-200/90 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Logo Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-700 font-bold text-2xl">
                    {form.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                {/* Title and Description */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{form.title}</h1>
                  {form.description && (
                    <ul className="space-y-1.5 text-gray-600 text-base leading-relaxed">
                      {form.description
                        .split(/\r?\n/)
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span>
                            <span>{line}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{form.fields.length} Fields</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>{form.fields.filter(f => f.required).length} Required</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Badge */}
              {form.price > 0 && (
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 px-5 py-3 rounded-xl border-2 border-emerald-300">
                  <div className="flex items-center text-emerald-700 font-bold justify-center">
                    <IndianRupee className="w-6 h-6" />
                    <span className="text-2xl">{form.price}</span>
                  </div>
                  <p className="text-xs text-emerald-600 text-center mt-1">Payment Required</p>
                </div>
              )}
            </div>

            {form.price > 0 && (
              <Alert className="bg-emerald-50 border-emerald-300 mt-4">
                <AlertDescription className="text-emerald-800">
                  💳 This is a paid form. You will be redirected to the payment gateway after submission.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Form Fields Card */}
        <Card className="shadow-lg border-4 border-green-200/90">
          <CardHeader>
            <CardTitle className="text-xl">Fill out the form</CardTitle>
            <CardDescription>
              Fields marked with <span className="text-red-500 font-bold">*</span> are required
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">{errors.submit && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertTitle className="text-red-800">Error</AlertTitle>
                  <AlertDescription className="text-red-700">{errors.submit}</AlertDescription>
                </Alert>
              )}

              {errors.payment && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertTitle className="text-red-800">Payment Error</AlertTitle>
                  <AlertDescription className="text-red-700">{errors.payment}</AlertDescription>
                </Alert>
              )}

              {form.fields
                .sort((a, b) => a.order - b.order)
                .map(field => renderField(field))}

              <div className="pt-6 border-t-2 border-gray-200">
                <Button
                  type="submit"
                  className="w-full h-14 text-lg bg-gradient-to-r from-emerald-800 to-emerald-500 hover:from-emerald-700 hover:to-emerald-400 text-white font-semibold shadow-lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      {form.price > 0 ? '🔒 Submit & Pay' : '✓ Submit Form'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    // Fetch form data on the server
    const form: Form = await api.get(`/forms/slug/${slug}`);

    // Check if form is published
    if (!form.published) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        form,
      },
    };
  } catch (error) {
    console.error('Error fetching form:', error);
    return {
      props: {
        form: null,
      },
    };
  }
};

export default SingleFormPage;