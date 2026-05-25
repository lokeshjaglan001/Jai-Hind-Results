import AdBanner from "../shared/AdBanner";

type CourseDescriptionProps = {
    description: string;
};

export default function CourseDescription({ description }: CourseDescriptionProps) {
    return (
        <section className="bg-white mt-12">
            {/* <AdBanner text={"Google Ads"} className="md:hidden h-48 mb-12"/> */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <div className="prose max-w-none text-gray-600">
                <p>{description}</p>
            </div>
            {/* <AdBanner text={"Google Ads"} className="md:hidden h-48 mb-12 mt-12"/> */}
        </section>
    );
}
