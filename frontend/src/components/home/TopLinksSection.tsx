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
import freedomFighters from "@/assets/right-freedom-fighter-img.png";
import {
  BriefcaseBusiness,
  Users,
  FileText,
  Trophy,
  ArrowRight,
  LogIn,
} from "lucide-react";

interface TopLinksSectionProps {
  categories: Category[];
}

export default function TopLinksSection({
  categories,
}: TopLinksSectionProps) {
  const [showSignupForm, setShowSignupForm] = useState(false);
  const { user } = useAuth();

  return (
    <section className="bg-white px-4 md:px-8 xl:px-12 overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-[0.95fr_1.25fr] gap-8 lg:gap-16 items-center py-8 lg:py-16">
          {/* LEFT SIDE */}
          <div>
            <h1 className="text-4xl md:text-4xl xl:text-5xl font-extrabold leading-[1.15] text-gray-900 tracking-tight">
              Your Journey to a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-600">
                Government Job
              </span>
              <br /> Starts Here
            </h1>

            <p className="mt-4 text-base md:text-lg text-gray-600 max-w-xl leading-relaxed">
              Get the latest job alerts, admit cards, results,
              answer keys, documents, government schemes and
              everything you need for your career in one place.
            </p>

            {/* FEATURE CHIPS */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  prefetch={false}
                >
                  <div className="flex items-center gap-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/50 rounded-full px-3.5 py-1.5 transition-all duration-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-semibold text-zinc-700">
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row max-w-lg">
              {/* Login / Register */}
              <button
                onClick={() => setShowSignupForm(true)}
                className="group flex-1 flex items-center justify-between rounded-full bg-black text-white px-6 py-3.5 transition-all duration-200 hover:bg-zinc-900 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <LogIn className="h-5 w-5 text-white" />
                  <span className="text-sm font-semibold">Login / Register</span>
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Whatsapp */}
              <a
                href="https://whatsapp.com/channel/0029VbBbS0R7T8bTQRa9230i"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-1 flex items-center justify-between rounded-full border border-green-200 bg-green-50/50 px-6 py-3.5 transition-all duration-200 hover:bg-green-50 hover:border-green-300 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <Image src={wp} alt="WhatsApp" width={16} height={16} className="object-contain" />
                  </div>
                  <span className="text-sm font-semibold text-green-700">Join WhatsApp</span>
                </div>
                <ArrowRight className="h-5 w-5 text-green-600 transition-all duration-200 group-hover:translate-x-1" />
              </a>
            </div>

            {/* TRUST TEXT */}
            <div className="flex flex-wrap gap-5 mt-8 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1"><span className="text-green-600">✓</span> 100% Free</span>
              <span className="flex items-center gap-1"><span className="text-green-600">✓</span> No Registration Fee</span>
              <span className="flex items-center gap-1"><span className="text-green-600">✓</span> No Hidden Charges</span>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="hidden lg:flex relative justify-center items-center">
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-orange-100/30
                via-transparent
                to-green-100/30
                blur-3xl
                scale-125
                -z-10
              "
            />

            <div
              className="
                relative
                w-full
                lg:scale-[1.15]
                lg:translate-x-8
              "
            >
              <Image
                src={freedomFighters}
                alt="Freedom Fighters"
                priority
                className="
                  w-full
                  h-auto
                  object-contain
                  select-none
                  pointer-events-none
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  h-24
                  bg-gradient-to-b
                  from-transparent
                  via-[#ffffff]
                  to-[#ffffff]
                "
              />
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-4 lg:mt-8 pb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Stat 1 */}
            <div className="bg-zinc-50/50 border border-zinc-100/80 rounded-3xl p-5 sm:p-6 flex items-center gap-4 hover:bg-zinc-50/80 hover:shadow-sm transition-all duration-200">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <BriefcaseBusiness className="w-6 h-6 lg:w-7 lg:h-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-none">
                  500+
                </h3>
                <p className="text-xs lg:text-sm font-semibold text-gray-500 mt-1.5">
                  Government Jobs
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-zinc-50/50 border border-zinc-100/80 rounded-3xl p-5 sm:p-6 flex items-center gap-4 hover:bg-zinc-50/80 hover:shadow-sm transition-all duration-200">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 lg:w-7 lg:h-7 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-none">
                  10k+
                </h3>
                <p className="text-xs lg:text-sm font-semibold text-gray-500 mt-1.5">
                  Students Enrolled
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-zinc-50/50 border border-zinc-100/80 rounded-3xl p-5 sm:p-6 flex items-center gap-4 hover:bg-zinc-50/80 hover:shadow-sm transition-all duration-200">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-none">
                  100+
                </h3>
                <p className="text-xs lg:text-sm font-semibold text-gray-500 mt-1.5">
                  Admit Cards
                </p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-zinc-50/50 border border-zinc-100/80 rounded-3xl p-5 sm:p-6 flex items-center gap-4 hover:bg-zinc-50/80 hover:shadow-sm transition-all duration-200">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-yellow-50 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 lg:w-7 lg:h-7 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-none">
                  200+
                </h3>
                <p className="text-xs lg:text-sm font-semibold text-gray-500 mt-1.5">
                  Results Declared
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthDialog
        open={showSignupForm}
        onOpenChange={setShowSignupForm}
      />
    </section>
  );
}

