import FancyContainer from "@/components/about/FancyContainer";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUsPage() {
    return (
        <div className="bg-white">
            <Header />
            <section className="py-12 px-4 md:px-0 container mx-auto max-w-5xl">
                {/* <FancyContainer /> */}
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">
                        Contact Us
                    </h2>

                    <p className="md:text-lg text-sm text-gray-600 leading-relaxed text-center mb-12 max-w-2xl mx-auto">
                        We'd love to hear from you! Whether you have a question about a job posting, feedback on our website, or any other inquiry, feel free to reach out using the form below or through our contact details.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        
                        {/* Column 1: Contact Form */}
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                    placeholder="👉 Enter your full name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                    placeholder="👉 Enter your email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                    placeholder="👉 Write the subject of your query"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                                    placeholder="👉 Type your message here…"
                                ></textarea>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>

                        {/* Column 2: Contact Details */}
                        <div className="space-y-8">
                            <h3 className="md:text-2xl text-lg font-bold text-gray-900">
                                Our Information
                            </h3>
                            <p className="md:text-lg text-sm text-gray-600 leading-relaxed">
                                You can also reach us directly through the following:
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Email</h4>
                                        <a href="mailto:test@softricity.in" className="md:text-lg text-sm text-gray-600 hover:text-indigo-600">
                                            contact@theharyanajobalert.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Phone</h4>
                                        <a href="tel:+918814099576" className="md:text-lg text-sm text-gray-600 hover:text-indigo-600">
                                            +91 88140 99576
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Address</h4>
                                        <p className="md:text-lg text-sm text-gray-600">
                                            Panipat, Haryana, India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

