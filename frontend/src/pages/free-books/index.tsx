import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { Download } from "lucide-react";

import { api } from "@/lib/api";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

import book from "../../../public/book.png";
import books from "../../../public/books.png"

export type DownloadableFile = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  downloads_count: number;
  created_at: string;
};

interface FilesPageProps {
  files: DownloadableFile[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const files = await api.get("/files");

    return {
      props: {
        files,
      },
    };
  } catch (error) {
    console.error("Failed to fetch files:", error);

    return {
      props: {
        files: [],
      },
    };
  }
};

const FilesPage: NextPage<FilesPageProps> = ({ files }) => {
  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Free Books Library
          </h1>

          <p className="text-gray-600 text-lg">
            Download books, notes, PDFs and study material for free.
          </p>
        </div>

        {/* Hero Banner */}
        <div className="relative h-56 md:h-80 rounded-3xl overflow-hidden mb-12">
          <Image
            src={books}
            alt="Free Books Library"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-3">
              📚 Free Books & Study Material
            </h2>

            <p className="max-w-2xl text-sm md:text-lg">
              Download free books, notes, current affairs PDFs,
              previous year papers and study material for all
              competitive examinations.
            </p>
          </div>
        </div>

        {/* Books Grid */}
        {files.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No books available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Book Cover */}
                <div className="relative aspect-[4/5]">
                  <Image
                    src={book}
                    alt={file.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-600 text-xs font-semibold mb-3">
                    PDF
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2">
                    {file.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 min-h-[60px]">
                    {file.description ||
                      "Free study material available for download."}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                    <Download className="w-4 h-4" />
                    <span>{file.downloads_count} Downloads</span>
                  </div>

                  <Link href={`/books/${file.slug}`}>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition-colors">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FilesPage;