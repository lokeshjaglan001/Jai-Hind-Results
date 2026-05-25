import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Download, FileText, IndianRupee } from "lucide-react";
import BannerHeader from "@/components/shared/BannerHeader";

export type DownloadableFile = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  price: any;
  downloads_count: number;
  created_at: string;
};

interface FilesPageProps {
  files: DownloadableFile[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const files = await api.get('/files');
    return { props: { files } };
  } catch (error) {
    console.error("Failed to fetch files:", error);
    return { props: { files: [] } };
  }
};

const FilesPage: NextPage<FilesPageProps> = ({ files }) => {
  const getLogoText = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  const formatPrice = (price: any) => {
    const priceValue = typeof price === 'object' && price !== null ? Number(price) : price;
    return priceValue === null || priceValue === 0 || isNaN(priceValue) ? 'Free' : `₹${priceValue}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Offline Forms
          </h1>
          <p className="text-gray-600 text-lg">
            Purchase offline forms and start your application process easily.
          </p>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No files available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => {
              const detailUrl = `/offline-forms/${file.slug}`;
              const logoText = getLogoText(file.title);

              return (
                <div
                  key={file.id}
                  className="bg-white rounded-2xl border-4 border-gray-200/90 shadow-sm p-5 flex flex-col hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-lg">{logoText}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      <Download className="w-3 h-3" />
                      <span>{file.downloads_count} Downloads</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">
                    {file.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {file.description || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-1.5">
                      {formatPrice(file.price) === 'Free' ? (
                        <span className="text-emerald-600 font-semibold text-lg">Free</span>
                      ) : (
                        <>
                          <IndianRupee className="w-4 h-4 text-gray-700" />
                          <span className="text-gray-800 font-semibold text-lg">{formatPrice(file.price)}</span>
                        </>
                      )}
                    </div>

                    <Link href={detailUrl}>
                      <button className="px-4 py-2 bg-gradient-to-r from-[#f97316] via-white to-[#15803d] hover:from-[#ea580c] hover:via-gray-100 hover:to-[#166534] text-black text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                        View Details
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

export default FilesPage;
