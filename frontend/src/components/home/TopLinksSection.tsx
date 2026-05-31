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
    <section className="bg-[#ffffff] px-4 sm:px-3 lg:px-6 overflow-hidden">

      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-[0.95fr_1.25fr] gap-8 lg:gap-16 items-center py-8 lg:py-20">
          {/* LEFT SIDE */}
          <div>

            <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold leading-tight text-gray-900">
              Your Journey to a
              <span className="block text-green-600">
                Government Job
              </span>
              Starts Here
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Get the latest job alerts, admit cards, results,
              answer keys, documents, government schemes and
              everything you need for your career in one place.
            </p>

            {/* FEATURE CHIPS */}
            <div className="flex flex-wrap gap-3 mt-8">

              {categories.slice(0, 8).map((category) => (

                <Link
                  key={category.id}
                  href={`/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  prefetch={false}
                >

                  <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all">

                    <CheckCircle2 className="w-4 h-4 text-green-500" />

                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>

                  </div>

                </Link>

              ))}

            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 my-4">
  {/* Login / Register */}
  <button
    onClick={() => setShowSignupForm(true)}
    className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-5 py-4 transition-all duration-150 hover:border-slate-600 hover:bg-slate-900"
  >
    <div className="flex items-center gap-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
        <LogIn className="h-6 w-6 text-white" />
      </div>
      <div className="text-left">
        <p className="text-sm font-medium leading-none text-white">Login / Register</p>
        <p className="mt-1 text-xs text-slate-400">Access jobs, results & admit cards</p>
      </div>
    </div>
    <ArrowRight className="h-6 w-6 shrink-0 text-slate-600 transition-transform duration-150 group-hover:translate-x-0.5" />
  </button>

  {/* Whatsapp */}
   <a href="https://whatsapp.com/channel/0029VbBbS0R7T8bTQRa9230i"
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 transition-all duration-150 hover:border-green-200 hover:bg-green-50/40"
  >
    <div className="flex items-center gap-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
        <Image src={wp} alt="WhatsApp" width={29} height={29} />
      </div>
      <div className="text-left">
        <p className="text-sm font-medium leading-none text-gray-900">Join WhatsApp</p>
        <p className="mt-1 text-xs text-gray-500">Instant government job updates</p>
      </div>
    </div>
    <ArrowRight className="h-6 w-6 shrink-0 text-gray-300 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-green-500" />
  </a>
</div>

            {/* TRUST TEXT */}
            <div className="flex flex-wrap gap-6 mt-8 text-sm font-medium text-gray-600">

              <span>✓ 100% Free</span>

              <span>✓ No Registration Fee</span>

              <span>✓ No Hidden Charges</span>

            </div>

          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="hidden lg:flex relative justify-center items-center">

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-orange-200/40
                via-transparent
                to-green-200/40
                blur-3xl
                scale-125
                -z-10
              "
            />

            <div
              className="
                relative
                w-full
                lg:scale-[1.25]
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
                  h-32
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
        <div className="mt-5 lg:mt-5 pb-15">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

              {/* Stat 1 */}
              <div className="p-4 sm:p-6 lg:p-8 flex items-center gap-3 lg:gap-5">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                  <BriefcaseBusiness className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-none">
                    500+
                  </h3>
                  <p className="text-sm lg:text-base text-gray-500 mt-1">
                    Government Jobs
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 sm:p-6 lg:p-8 flex items-center gap-3 lg:gap-5">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-none">
                    10k+
                  </h3>
                  <p className="text-sm lg:text-base text-gray-500 mt-1">
                    Students Enrolled
                  </p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 sm:p-6 lg:p-8 flex items-center gap-3 lg:gap-5">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-none">
                    100+
                  </h3>
                  <p className="text-sm lg:text-base text-gray-500 mt-1">
                    Admit Cards
                  </p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-4 sm:p-6 lg:p-8 flex items-center gap-3 lg:gap-5">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-yellow-50 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-none">
                    200+
                  </h3>
                  <p className="text-sm lg:text-base text-gray-500 mt-1">
                    Results Declared
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <AuthDialog
        open={showSignupForm}
        onOpenChange={setShowSignupForm}
      />

    </section >
  );
}

