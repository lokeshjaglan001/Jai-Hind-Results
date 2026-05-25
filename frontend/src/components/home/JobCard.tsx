import { CheckCircle2, ArrowRight } from 'lucide-react';
import AdBanner from '../shared/AdBanner';

const resultsData = {
  title: 'Results',
  description: 'These are links for Government results',
  color: 'from-indigo-500 to-blue-500',
  links: [
    { id: 1, text: 'DSSSB Jail Warder Final Result 2025 - Out', href: '#' },
    { id: 2, text: 'UPSSSC PET Answer Key 2025 - Out', href: '#' },
    { id: 3, text: 'BSEB Sakshamta Pariksha 3rd Result With Score Card 2025 - Out', href: '#' },
    { id: 4, text: 'Railway RRB Group D Exam Date 2025 - Out', href: '#' },
    { id: 5, text: 'LNMU UG Spot Admission Merit List 2025-29', href: '#' },
    { id: 6, text: 'BSEB DElEd 1st & 2nd Year Result (Session 2024-26 & 2023-25)', href: '#' },
  ],
};

const admitCardsData = {
  title: 'Admit Cards',
  description: 'These are links for Admit cards',
  color: 'from-indigo-500 to-blue-500',
  links: [
    { id: 1, text: 'Indian Coast Guard Navik GD & Yantrik 01/2026 & 02/2026 Exam City Details - Out', href: '#' },
    { id: 2, text: 'CISF Constable Driver PET / PST Admit Card 2025 - Out', href: '#' },
    { id: 3, text: 'SSC CGL Tier - I Admit Card 2025 - Out', href: '#' },
    { id: 4, text: 'NIACL AO Scale I Admit Card 2025 - Out', href: '#' },
    { id: 5, text: 'Rajasthan Police Constable Exam City Details 2025 - Out', href: '#' },
  ],
};

const latestJobsData = {
  title: 'Latest Jobs',
  description: 'These are links for Latest Jobs',
  color: 'from-indigo-500 to-blue-500',
  links: [
    { id: 1, text: 'DSSSB Primary Teacher PRT Online Form 2025', href: '#' },
    { id: 2, text: 'UP Police SI Online Form 2025 (4543 Post)', href: '#' },
    { id: 3, text: 'Bihar STET 2025 Online Form IBPS RRB 14th Online Form 2025 - (13217 Posts)', href: '#' },
    { id: 4, text: 'Indian Army NCC 123rd Course April 2026 Online Form - Last Date Today', href: '#' },
    { id: 5, text: 'Jharkhand JSSC ANM Online Form 2025 - Last Date Today', href: '#' },
  ],
};

const JobCard = ({ data }: { data: typeof resultsData }) => (
    <div className="flex flex-col h-full">
        <div className={`bg-gradient-to-r ${data.color} text-white text-center font-bold text-2xl py-4 rounded-t-2xl`}>
            {data.title}
        </div>
        <div className="bg-black text-white text-center text-sm py-2">
            {data.description}
        </div>
        <div className="bg-gray-100 py-6 px-1 rounded-b-2xl flex-grow">
            <ul className="space-y-4">
                {data.links.map(link => (
                    <li key={link.id}>
                        <a href={link.href} className="flex items-start gap-2 text-gray-700 hover:text-indigo-600 group">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="flex-grow">{link.text}</span>
                            <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 ml-2 group-hover:bg-indigo-600 transition-colors">
                                <ArrowRight className="w-3 h-3 text-white" />
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);


export default function JobSection() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <JobCard data={resultsData} />
          <JobCard data={admitCardsData} />
          {/* <AdBanner text="Google Ads Section" className="h-24 md:hidden" /> */}
          <JobCard data={latestJobsData} />
        </div>
      </div>
    </section>
  );
}

