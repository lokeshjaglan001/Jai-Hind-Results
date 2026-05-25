import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white">
            <Header />
            <section className="py-12 px-4 md:px-0 container mx-auto max-w-5xl">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-4">
                        Privacy Policy
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
                                Welcome to Haryana Job Alert ("we," "us," or "our"). We are committed to protecting the privacy of our visitors. This Privacy Policy outlines the types of personal information that is received and collected by Haryana Job Alert (the "Website") and how it is used.
                                This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they share and/or collect on Haryana Job Alert. This policy is not applicable to any information collected offline or via channels other than this website.
                                Our website is operated by SOFTRICITY Pvt Ltd.
                            </p>
                        </div>

                        {/* 2. Consent */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                2. Consent
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                            </p>
                        </div>

                        {/* 3. Information We Collect */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                3. Information We Collect
                            </h3>
                            
                            <h4 className="md:text-xl text-md font-semibold text-gray-800 mb-2 mt-4">
                                A. Personal Information
                            </h4>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mb-2">
                                We may ask you to provide personally identifiable information when you interact with our Website. This may include:
                            </p>
                            <ul className="list-disc list-inside md:text-lg text-sm text-gray-600 leading-relaxed space-y-1 pl-4">
                                <li><strong className="font-medium text-gray-700">Email Address:</strong> When you subscribe to our job alerts, newsletter, or contact us.</li>
                                <li><strong className="font-medium text-gray-700">Name:</strong> If you leave a comment or contact us.</li>
                                <li><strong className="font-medium text-gray-700">Phone Number:</strong> If you provide it through our contact forms.</li>
                                <li><strong className="font-medium text-gray-700">Comments and other content:</strong> Any information you voluntarily provide in comment sections or forums.</li>
                            </ul>

                            <h4 className="md:text-xl text-md font-semibold text-gray-800 mb-2 mt-4">
                                B. Non-Personal Information & Log Files
                            </h4>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mb-2">
                                Haryana Job Alert follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes:
                            </p>
                            <ul className="list-disc list-inside md:text-lg text-sm text-gray-600 leading-relaxed space-y-1 pl-4">
                                <li>Internet Protocol (IP) addresses</li>
                                <li>Browser type (e.g., Chrome, Firefox)</li>
                                <li>Internet Service Provider (ISP)</li>
                                <li>Date and time stamp</li>
                                <li>Referring/exit pages</li>
                                <li>Possibly the number of clicks</li>
                            </ul>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mt-2">
                                This information is used to analyze trends, administer the site, track users' movement on the website, and gather demographic information. This information is not linked to any information that is personally identifiable.
                            </p>

                            <h4 className="md:text-xl text-md font-semibold text-gray-800 mb-2 mt-4">
                                C. Cookies and Web Beacons
                            </h4>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                Like any other website, Haryana Job Alert uses "cookies." These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                            </p>
                        </div>

                        {/* 4. How We Use Your Information */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                4. How We Use Your Information
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mb-2">
                                We use the information we collect in various ways, including to:
                            </p>
                            <ul className="list-disc list-inside md:text-lg text-sm text-gray-600 leading-relaxed space-y-1 pl-4">
                                <li>Provide, operate, and maintain our website.</li>
                                <li>Send you job alerts, emails, and newsletters that you have subscribed to.</li>
                                <li>Improve, personalize, and expand our website and its content.</li>
                                <li>Understand and analyze how you use our website.</li>
                                <li>Respond to your comments, questions, and requests.</li>
                                <li>Prevent fraud and ensure the security of our website.</li>
                            </ul>
                        </div>

                        {/* 5. Third-Party Advertisers */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                5. Third-Party Advertisers (e.g., Google AdSense)
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mb-2">
                                We may use third-party advertising companies to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                            </p>
                            <ul className="list-disc list-inside md:text-lg text-sm text-gray-600 leading-relaxed space-y-1 pl-4 my-2">
                                <li>Google, as a third-party vendor, uses cookies to serve ads on our site.</li>
                                <li>Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet.</li>
                                <li>Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.</li>
                            </ul>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                Haryana Job Alert has no access to or control over these cookies that are used by third-party advertisers. We advise you to consult the respective privacy policies of these third-party ad servers for more detailed information on their practices as well as for instructions about how to opt-out of certain practices.
                            </p>
                        </div>

                        {/* 6. Third-Party Links */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                6. Third-Party Links
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                Our Website provides links to other websites, such as official government job portals or application pages. We are not responsible for the privacy practices or the content of these third-party sites. We encourage you to read the privacy policies of any website you visit.
                            </p>
                        </div>

                        {/* 7. Data Security */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                7. Data Security
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                We implement a variety of security measures to maintain the safety of your personal information. However, please remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                            </p>
                        </div>

                        {/* 8. Children's Information */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                8. Children's Information
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                Our website is not intended for use by children under the age of 13. We do not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
                            </p>
                        </div>

                        {/* 9. Your Data Rights */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                9. Your Data Rights
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mb-2">
                                Depending on your location, you may have the right to:
                            </p>
                            <ul className="list-disc list-inside md:text-lg text-sm text-gray-600 leading-relaxed space-y-1 pl-4">
                                <li><strong className="font-medium text-gray-700">Access:</strong> Request copies of your personal data.</li>
                                <li><strong className="font-medium text-gray-700">Rectification:</strong> Request that we correct any information you believe is inaccurate or incomplete.</li>
                                <li><strong className="font-medium text-gray-700">Erasure:</strong> Request that we erase your personal data, under certain conditions.</li>
                                <li><strong className="font-medium text-gray-700">Object to Processing:</strong> Object to our processing of your personal data, under certain conditions.</li>
                            </ul>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mt-2">
                                To exercise any of these rights, please contact us at our email address.
                            </p>
                        </div>

                        {/* 10. Changes to This Privacy Policy */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                10. Changes to This Privacy Policy
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                            </p>
                        </div>

                        {/* 11. Contact Us */}
                        <div>
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                                11. Contact Us
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed mb-2">
                                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us:
                            </p>
                            <ul className="list-disc list-inside md:text-lg text-sm text-gray-600 leading-relaxed space-y-1 pl-4">
                                <li><strong className="font-medium text-gray-700">By Email:</strong> test@softricity.in</li>
                                <li><strong className="font-medium text-gray-700">By Mail:</strong> Israna, Panipat, Haryana</li>
                                <li><strong className="font-medium text-gray-700">Website:</strong> theharyanajobalert.com</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

