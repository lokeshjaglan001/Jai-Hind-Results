import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function FaqPage() {
    return (
        <div className="bg-white">
            <Header />
            <section className="py-12 px-4 md:px-0 container mx-auto max-w-5xl">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">
                        FAQ
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                What is Haryana Job Alert?
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                Haryana Job Alert is a dedicated online portal that provides the latest information on government job vacancies (Sarkari Naukri), exam results, admit cards, answer keys, and other related updates primarily for the state of Haryana, as well as for central government positions.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                How can I check the latest government job vacancies?
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                You can check the latest vacancies by visiting our homepage. We have dedicated sections for "Latest Jobs", "Results", and "Admit Cards". All new openings are updated there regularly with all necessary details and application links.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                Is Haryana Job Alert free to use?
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                Yes, absolutely. All the information provided on Haryana Job Alert, including job notifications, results, and study materials, is completely free for all users. No registration or subscription is required to access the content.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );

}