export default function AboutSection() {
  return (
    <section className="bg-white py-12 px-4 md:px-0">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">
          About
        </h2>

        <div className="space-y-8">
          <div className="md:text-lg text-sm text-gray-600 leading-relaxed space-y-6">
            <p>
              The Haryana Job Alert is India’s reliable platform for fast and accurate Government Job Alerts, Sarkari Exam Notifications, Results, Admit Cards, Offline Forms, Sarkari Yojana updates, and Government Scheme information.
            </p>
            <p>
              We serve students preparing for government exams, aspirants appearing for entrance tests, and every citizen seeking verified scheme-related updates.
            </p>
            <p>
              Our mission is to make every government opportunity accessible, understandable, and timely, ensuring no student or citizen misses important information that can shape their future.
            </p>
            <div>
              <p className="font-semibold mb-4">With a strong commitment to accuracy, speed, and clarity, we stand apart through:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>100% verified updates from official sources</li>
                <li>Instant notifications on jobs, results, and exams</li>
                <li>Simple, student-friendly information</li>
                <li>All categories under one roof—jobs, exams, results, admit cards, forms & schemes</li>
                <li>Zero misinformation policy</li>
              </ul>
            </div>
            <p>
              At The Haryana Job Alert, we work every day to keep India informed, aware, and empowered.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
