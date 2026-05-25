'use client';

import { useState } from 'react';
import { ChevronUp, PlayCircle } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type SectionItem = {
  title: string;
  duration: string;
};

type Section = {
  title: string;
  lectures: number;
  duration: string;
  items: SectionItem[];
};

type CourseContentAccordionProps = {
  content: {
    totalLectures: number;
    totalSections: number;
    totalLength: string;
    sections: Section[];
  };
};

// --- MAIN COMPONENT ---
export default function CourseContentAccordion({ content }: CourseContentAccordionProps) {
  // State to track which sections are open. Stores an array of indices.
  const [openSections, setOpenSections] = useState<number[]>([0]); // Start with the first section open
  const [areAllExpanded, setAreAllExpanded] = useState(false);

  // Function to toggle a single section
  const handleToggleSection = (index: number) => {
    setOpenSections(prevOpenSections =>
      prevOpenSections.includes(index)
        ? prevOpenSections.filter(i => i !== index)
        : [...prevOpenSections, index]
    );
  };

  // Function to expand or collapse all sections at once
  const handleToggleExpandAll = () => {
    if (areAllExpanded) {
      setOpenSections([]);
    } else {
      // Create an array of all indices [0, 1, 2, ...]
      setOpenSections(content.sections.map((_, index) => index));
    }
    setAreAllExpanded(!areAllExpanded);
  };

  // If no sections and no lectures, show only total length
  if (content.totalSections === 0 && content.totalLectures === 0) {
    return (
      <section className="bg-white mt-12">
        <h2 className="text-2xl font-bold text-gray-800">
          Course Total Length: {content.totalLength}
        </h2>
      </section>
    );
  }

  return (
    <section className="bg-white mt-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Course Content</h2>
          <p className="text-sm text-gray-500 mt-1">
            {content.totalSections} Sections : {content.totalLectures} lectures : {content.totalLength} total length
          </p>
        </div>
        <button 
          onClick={handleToggleExpandAll}
          className="font-semibold text-indigo-600 text-sm hover:text-indigo-800 transition-colors"
        >
          {areAllExpanded ? 'Collapse all sections' : 'Expand all sections'}
        </button>
      </div>
      <div className='rounded-xl shadow-lg'>
        {content.sections.map((section, index) => {
          const isOpen = openSections.includes(index);
          return (
            <div key={index} className="bg-white">
              {/* Accordion Header */}
              <button 
                onClick={() => handleToggleSection(index)}
                className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <ChevronUp className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  <span>{section.title}</span>
                </div>
                <span className="text-xs font-medium text-gray-500">{section.lectures} lectures : {section.duration}</span>
              </button>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-200 ${
                  isOpen ? 'max-h-[500px]' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-4 pt-4">
                  <ul className="space-y-3 pl-8 border-l border-gray-200 ml-2.5">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3 text-gray-700">
                          <PlayCircle size={18} className="text-gray-500"/>
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{item.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

