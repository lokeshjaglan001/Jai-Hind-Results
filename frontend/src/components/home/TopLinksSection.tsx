import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { Category } from "@/pages/admin/getting-started/categories";
import Link from "next/link";
import Image from "next/image";
import { AuthDialog } from "../auth/AuthDialog";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import arrow from "@/assets/arrow.png";
import whiteArrow from "@/assets/white-arrow.jpg";
import wp from "@/assets/wp.png";
import wpIcon from "@/assets/wp-icon.png";
import bgFlagLeft from "@/assets/bgFlagLeft.png";
import bgFlagRight from "@/assets/bgFlagRight.png";

interface TopLinksSectionProps {
  categories: Category[];
}

export default function TopLinksSection({
  categories,
}: TopLinksSectionProps) {
  const [showSignupForm, setShowSignupForm] = useState(false);
  const { user } = useAuth();

  return (
    <section className="bg-white pb-2 px-2 sm:px-6 lg:px-8 mt-0 overflow-hidden">

      <div className="max-w-5xl mx-auto text-center">

        {/* HEADING */}
        <div className="flex items-center justify-center mb-3 sm:mb-2 sm:mt-6 px-4 sm:px-0 relative z-10">

          <h1 className="text-lg sm:text-2xl font-bold text-gray-800 tracking-tight leading-snug">
            Haryana <span className="text-red-500">Job</span> Alert is a{" "}
            <span className="text-red-500">FREE</span> Website to get
          </h1>

        </div>

        {/* LINKS + FLAGS */}
        <div className="relative flex justify-center items-center w-full py-6 sm:py-8 min-h-[170px] sm:min-h-[220px]">

          {/* LEFT FLAG */}
          <div className="absolute left-[-95px] sm:left-[-170px] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">

            <Image
              src={bgFlagLeft}
              alt="Left BG Flag"
              width={220}
              height={220}
              className="object-contain sm:w-[360px] sm:h-[360px]"
            />

          </div>

          {/* RIGHT FLAG */}
          <div className="absolute right-[-95px] sm:right-[-170px] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">

            <Image
              src={bgFlagRight}
              alt="Right BG Flag"
              width={220}
              height={220}
              className="object-contain sm:w-[360px] sm:h-[360px]"
            />

          </div>

          {/* CATEGORY LINKS */}
          <div className="relative z-10 max-w-3xl flex flex-wrap gap-x-4 gap-y-3 justify-center text-center px-2">

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                passHref
                legacyBehavior
                prefetch={false}
              >

                <span className="inline-flex items-center justify-center text-gray-700 font-semibold hover:scale-105 hover:text-gray-900 transition-transform duration-200">

                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1.5 flex-shrink-0" />

                  <span className="whitespace-nowrap underline decoration-gray-300 transition-all text-[13px] sm:text-sm text-center">
                    {category.name}
                  </span>

                  <ArrowUpRight className="min-w-3 min-h-3 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-1" />

                </span>

              </Link>
            ))}

          </div>

        </div>

        {/* BOTTOM TEXT */}
        <p className="mt-2 hidden sm:block text-gray-800 font-semibold text-md text-center gap-2 relative z-10">

          You can freely use this website without registration or login

          <span className="relative inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full ml-2">

            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600 animate-ping"></span>

            LIVE

          </span>

        </p>

        {/* BUTTONS */}
        <div className="mt-5 hidden sm:flex items-center justify-center gap-4 relative z-10">

          {user?.id ? (
            <button
              className="shine group w-full sm:w-auto bg-gradient-to-r from-[#222627] to-[#414245] rounded-xl shadow-md px-1 py-1 flex items-center justify-between font-semibold text-white hover:shadow-lg cursor-pointer hover:scale-105 duration-300 transition-transform hover:bg-gradient-to-b hover:from-[#1c1e47] hover:via-[#2b2d6c] hover:to-[#34387e]"
              onClick={() =>
                (window.location.href =
                  user.role === "admin"
                    ? "/admin"
                    : "/dashboard")
              }
            >

              <span className="sm:text-sm text-sm pl-3 text-nowrap">
                Dashboard
              </span>

              <span className="ml-4 w-10 h-10 rounded-lg bg-green-400 group-hover:bg-white object-cover flex items-center justify-center">

                <Image
                  src={arrow}
                  width={48}
                  height={48}
                  alt="arrow"
                  className="rounded-lg group-hover:hidden block"
                />

                <Image
                  src={whiteArrow}
                  width={48}
                  height={48}
                  alt="arrow"
                  className="rounded-lg group-hover:block hidden"
                />

              </span>

            </button>
          ) : (
            <button
              className="shine group w-full sm:w-auto bg-gradient-to-r from-[#222627] to-[#414245] rounded-xl shadow-md px-1 py-1 flex items-center justify-between font-semibold text-white hover:shadow-lg cursor-pointer hover:scale-105 duration-300 transition-transform hover:bg-gradient-to-b hover:from-[#1c1e47] hover:via-[#2b2d6c] hover:to-[#34387e]"
              onClick={() => setShowSignupForm(true)}
            >

              <span className="sm:text-sm text-sm pl-3 text-nowrap">
                Login / Register
              </span>

              <span className="ml-4 w-10 h-10 rounded-lg bg-green-400 group-hover:bg-white object-cover flex items-center justify-center">

                <Image
                  src={arrow}
                  width={48}
                  height={48}
                  alt="arrow"
                  className="rounded-lg group-hover:hidden block"
                />

                <Image
                  src={whiteArrow}
                  width={48}
                  height={48}
                  alt="arrow"
                  className="rounded-lg group-hover:block hidden"
                />

              </span>

            </button>
          )}

          <button className="shine w-full sm:w-auto bg-gradient-to-r from-[#222627] to-[#414245] rounded-xl shadow-md p-1 flex items-center justify-between font-semibold text-white hover:shadow-lg transition-transform cursor-pointer hover:scale-105 duration-300 hover:bg-gradient-to-b hover:from-[#1c1e47] hover:via-[#2b2d6c] hover:to-[#34387e]">

            <a
              href="https://whatsapp.com/channel/0029VbBbS0R7T8bTQRa9230i"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between"
            >

              <span className="text-sm pl-3 text-nowrap">
                Join WhatsApp
              </span>

              <Image
                src={wp}
                alt="Contact avatar"
                className="w-10 h-10 rounded-lg ml-4 group-hover:hidden block"
                width={32}
                height={32}
                placeholder="blur"
              />

              <Image
                src={wpIcon}
                alt="Contact avatar"
                className="w-10 h-10 p-1 rounded-lg ml-4 group-hover:block hidden"
                width={32}
                height={32}
                placeholder="blur"
              />

            </a>

          </button>

        </div>

      </div>

      <AuthDialog
        open={showSignupForm}
        onOpenChange={setShowSignupForm}
      />

    </section>
  );
}