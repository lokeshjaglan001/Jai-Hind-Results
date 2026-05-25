import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function AboutPage() {
    return (
        <div className="bg-white">
            <Header />
            <section className="py-12 px-4 md:px-0 container mx-auto max-w-5xl">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">
                        About
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                Sarkari results 10+2 latest job
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                The most recent Sarkari Work, Sarkari Test result, online and offline forms, admit
                                card, syllabus, admission, answer key, scholarship, and notifications can all be
                                found here. If you want the latest updates related to Sarkari jobs on Haryana Job
                                Alert such as admit card notices, government exams, results, board updates, Bihar
                                10th result, and more, you can visit the Sarkari Result 10+2 Latest Job page regularly.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                Sarkari results
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                Haryana Job Alert is among the most popular websites in India that provides
                                details about Sarkari work exams, Sarkari result 2025, and other related updates.
                                It is a trusted portal where many job seekers find information about government
                                job openings, admit cards, exam schedules, and results.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );

}