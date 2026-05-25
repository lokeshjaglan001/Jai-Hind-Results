'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

const faqData: Faq[] = [
  {
    id: 1,
    question: 'What is Haryana Job Alert?',
    answer: 'Haryana Job Alert is a dedicated online portal that provides the latest information on government job vacancies (Sarkari Naukri), exam results, admit cards, answer keys, and other related updates primarily for the state of Haryana, as well as for central government positions.'
  },
  {
    id: 2,
    question: 'How can I check the latest government job vacancies?',
    answer: 'You can check the latest vacancies by visiting our homepage. We have dedicated sections for "Latest Jobs", "Results", and "Admit Cards". All new openings are updated there regularly with all necessary details and application links.'
  },
  {
    id: 3,
    question: 'Is Haryana Job Alert free to use?',
    answer: 'Yes, absolutely. All the information provided on Haryana Job Alert, including job notifications, results, and study materials, is completely free for all users. No registration or subscription is required to access the content.'
  }
];

interface FaqItemProps {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ faq, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="border-b border-gray-200 py-6 px-4 md:px-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 rounded-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full transition-transform duration-300">
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 pt-4' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}


export default function FaqSection() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section className="bg-white py-12 px-2">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">
          FAQ&#39;s
        </h2>

        <div>
          {faqData.map(faq => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openFaqId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


