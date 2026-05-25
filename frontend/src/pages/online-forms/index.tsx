import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { ArrowUpRight, FileText, CheckCircle } from "lucide-react";
import BannerHeader from "@/components/shared/BannerHeader";

export type Form = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: any;
  published: boolean;
  fields: {
    id: string;
    key: string;
    label: string;
    type: string;
    required: boolean;
  }[];
  _count: {
    submissions: number;
  };
};

interface OfflineFormsPageProps {
  forms: Form[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const forms = await api.get('/forms');
    return { props: { forms } };
  } catch (error) {
    console.error("Failed to fetch forms:", error);
    return { props: { forms: [] } };
  }
};

const OfflineFormsPage: NextPage<OfflineFormsPageProps> = ({ forms }) => {
  const getLogoText = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  const formatPrice = (price: any) => {
    const priceValue = typeof price === 'object' && price !== null ? Number(price) : price;
    return priceValue === null || priceValue === 0 || isNaN(priceValue) ? 'Free' : `₹${priceValue}`;
  };

  const getFieldCount = (fields: any[]) => {
    return fields?.length || 0;
  };

  const getRequiredFieldCount = (fields: any[]) => {
    return fields?.filter(f => f.required).length || 0;
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Online Forms
          </h1>
          <p className="text-gray-600 text-lg">
            Fill out application forms and submit your application online
          </p>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No forms available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => {
              const fieldCount = getFieldCount(form.fields);
              const requiredCount = getRequiredFieldCount(form.fields);
              const detailUrl = `/online-forms/${form.slug}`;
              const logoText = getLogoText(form.title);

              return (
                <div
                  key={form.id}
                  className="bg-white rounded-2xl border-4 border-gray-200/90 shadow-sm p-5 flex flex-col hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-emerald-200 to-emerald-300 flex items-center justify-center">
                      <span className="text-emerald-700 font-bold text-lg">{logoText}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      <FileText className="w-3 h-3" />
                      <span>{form._count?.submissions || 0} Submissions</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-800 leading-tight mb-1.5 line-clamp-2">
                    {form.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    {fieldCount} Total Fields | {requiredCount} Required
                  </p>

                  {form.published && (
                    <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md self-start mb-3 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Published</span>
                    </div>
                  )}

                  <ul className="space-y-1.5 text-sm text-gray-600 mb-5 flex-grow">
                    {form.description ? (
                        form.description
                        .split(/\r?\n/)
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((line, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-500 mt-1">•</span>
                                <span className="line-clamp-2">{line}</span>
                            </li>
                        ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Fill out the application form</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Upload required documents</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Submit your application</span>
                        </li>
                      </>
                    )}
                  </ul>

                  <div className="space-y-2">
                    <div className="text-lg font-bold text-gray-800">
                      {formatPrice(form.price)}
                    </div>
                    <Link href={detailUrl}>
                      <button className="w-full bg-gradient-to-r from-emerald-800 to-emerald-500 hover:from-emerald-700 hover:to-emerald-400 text-white text-center rounded-lg px-4 py-2.5 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all">
                        <span>Fill Form</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OfflineFormsPage;
