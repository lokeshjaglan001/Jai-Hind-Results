import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function TermsAndConditionsPage() {
    return (
        <div className="bg-white">
            <Header />
            <section className="py-12 px-4 md:px-0 container mx-auto max-w-5xl">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-4">
                        Terms and Conditions
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-10">
                        Last Updated: October 22, 2025
                    </p>

                    <div className="space-y-8">

                        {/* 1. Introduction */}
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                1. Introduction
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                Welcome to Haryana Job Alert ("we," "us," or "our"). These Terms and Conditions govern your use of our website (the "Website"), operated by SOFTRICITY Pvt Ltd. By accessing or using our Website, you agree to be bound by these Terms and Conditions in full. If you disagree with any part of these terms, you must not use our website.
                            </p>
                        </div>

                        {/* 2. Acceptance of Terms */}
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                2. Acceptance of Terms
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                By using this Website, you signify your acceptance of these terms. If you do not agree to these terms, please do not use our Website. Your continued use of the Website following the posting of changes to these terms will be deemed your acceptance of those changes.
                            </p>
                        </div>

                        {/* 3. Use of the Website */}
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                3. Use of the Website
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mb-2">
                                This Website is intended to provide information about job vacancies in Haryana. You agree to use this Website for lawful purposes only.
                            </p>
                            <ul className="list-disc list-inside md:text-lg text-sm text-gray-600 leading-relaxed space-y-1 pl-4">
                                <li>You must not use this Website in any way that causes, or may cause, damage to the Website or impairment of the availability or accessibility of the Website.</li>
                                <li>You must not use this Website to copy, store, host, transmit, send, use, publish, or distribute any material which consists of (or is linked to) any spyware, computer virus, or other malicious computer software.</li>
                                <li>You must be at least 16 years of age to use this website. By using this website, you warrant that you are at least 16 years of age.</li>
                            </ul>
                        </div>

                        {/* 4. Accuracy of Information */}
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                4. Accuracy of Information (Disclaimer)
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mb-2">
                                The information on Haryana Job Alert (job postings, deadlines, salaries, eligibility, etc.) is collected from various online and offline sources, including official government websites and news reports.
                            </p>
                            <ul className="list-disc list-inside md:text-lg text-sm text-gray-600 leading-relaxed space-y-1 pl-4">
                                <li>We do not guarantee the accuracy, completeness, or timeliness of any information on this Website.</li>
                                <li><strong className="font-medium text-gray-700">We are not a recruiting agency.</strong> We do not take part in any hiring process.</li>
                                <li>You are solely responsible for verifying the authenticity of any job posting before taking any action (such as applying or paying a fee). We strongly advise you to check the official government or company notification.</li>
                                <li>We will not be liable for any loss or damage arising from your reliance on information obtained from this Website.</li>
                            </ul>
                        </div>

                        {/* 5. Intellectual Property */}
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                5. Intellectual Property
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                Unless otherwise stated, we or our licensors own the intellectual property rights in the website and material on the website. This includes, but is not limited to, the design, layout, text, graphics, and logo. You may view and print pages for your own personal, non-commercial use, subject to the restrictions set out in these terms.
                            </p>
                        </div>

                        {/* 6. Third-Party Links */}
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                6. Third-Party Links
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                Our Website contains links to external, third-party websites (such as official application portals). We have no control over the content of these websites and am not responsible for their privacy policies or practices. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
                            </p>
                        </div>
                        
                        {/* 7. Limitation of Liability */}
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                7. Limitation of Liability
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                The Website is provided "as is" without any representations or warranties, express or implied. To the maximum extent permitted by applicable law, we exclude all liability for any direct, indirect, or consequential loss or damage incurred by any user in connection with our Website or in connection with the use, inability to use, or results of the use of our Website, any websites linked to it, and any materials posted on it.
                            </p>
                        </div>

                        {/* 8. Indemnification */}
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                8. Indemnification
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                You agree to indemnify and hold Haryana Job Alert and its employees, and agents harmless from and against all liabilities, legal fees, damages, losses, costs, and other expenses in relation to any claims or actions brought against us arising out of any breach by you of these Terms and Conditions or other liabilities arising out of your use of this Website.
                            </p>
                        </div>

                        {/* 9. Governing Law */}
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                9. Governing Law
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts in Panipat, Haryana.
                            </p>
                        </div>

                        {/* 10. Changes to These Terms */}
                        <div>
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900 mb-3">
                                10. Changes to These Terms
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                We reserve the right to revise these terms at any time. The revised terms will apply to the use of our website from the date of the publication of the revised terms on our website. Please check this page regularly to ensure you are familiar with the current version.
                            </p>
                        </div>

                        {/* 11. Contact Us */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                11. Contact Us
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mb-2">
                                If you have any questions about these Terms and Conditions, please contact us:
                            </p>
                            <ul className="list-disc list-inside md:text-lg text-sm text-gray-600 leading-relaxed space-y-1 pl-4">
                                <li><strong className="font-medium text-gray-700">By Email:</strong> test@softricity.in</li>
                                <li><strong className="font-medium text-gray-700">By Mail:</strong> Israna, Panipat, Haryana</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

