import "@/styles/globals.css";
import "@/styles/main.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout"; // Corrected import
import { ReactNode, useEffect, useState } from "react"; // Import useEffect
import { HashLoader } from "react-spinners"; // Loading spinner
import Router from "next/router";
import { HeroUIProvider } from "@heroui/react";
import { Poppins, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { ThirdPartyScripts } from "@/components/ThirdPartyScripts";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
});



// This component handles the protection logic
const AdminAuthGuard = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "admin") {
        router.replace("/");
      }
    }
  }, [user, isLoading, router]);
  if (isLoading || !user || user.role !== "admin") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <HashLoader color="#8a79ab" size={100} />
      </div>
    );
  }
  return <AdminLayout>{children}</AdminLayout>;
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, [])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag("config", "G-Y96FVJBE7W", {
          page_path: url,
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);



  return (
    <AuthProvider>
      <style jsx global>{`
        :root {
          --font-poppins: ${poppins.style.fontFamily};
          --font-playfair: ${playfair.style.fontFamily};
        }
      `}</style>
      {loading && (
        <div className="max-h-screen min-h-screen max-w-screen min-w-screen fixed top-0 right-0 bg-white/60 flex justify-center items-center z-[999]">
          <div className="bg-white h-40 w-40 rounded-2xl flex items-center justify-center shadow-lg">
            <HashLoader color="#10B981" size={80} />
          </div>
        </div>
      )}
      {router.pathname.startsWith("/admin") ? (
        <HeroUIProvider>
          <AdminAuthGuard>
            <Component {...pageProps} />
          </AdminAuthGuard>
        </HeroUIProvider>
      ) : (
        <main className="font-sans">
          <Component {...pageProps} />
        </main>
      )}
      <ThirdPartyScripts />
    </AuthProvider>
  );
}
