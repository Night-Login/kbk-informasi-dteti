import { Search, ChevronDown } from "lucide-react";

export default function PublicationPage() {
    const publications = [
        {
            title: "Judul Publikasi (link) Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            type: "Jurnal",
            date: "07 Juli 2026",
            authors: "Orang yang terlibat, Orang x, Orang y, Orang Z,",
            tags: ["Artificial Intelligence", "Generative AI"],
        },
        {
            title: "Analisis Tren Teknologi Terbaru dalam Pengembangan AI",
            type: "Conference",
            date: "15 Agustus 2026",
            authors: "Dr. Siti Nurhaliza, Budi Santoso",
            tags: ["Artificial Intelligence", "Deep Learning"],
        },
        {
            title: "Dampak Otomatisasi pada Produktivitas Industri Manufaktur",
            type: "Jurnal",
            date: "22 September 2026",
            authors: "Rina Wijaya, Andi Prasetyo",
            tags: ["Artificial Intelligence", "Robotika"],
        },
        {
            title: "Strategi Pengelolaan Data Besar untuk Perusahaan Skala Menengah",
            type: "Jurnal",
            date: "03 Oktober 2026",
            authors: "Teguh Ramadhan, Laila Putri",
            tags: ["Artificial Intelligence", "Analisis Data"],
        },
        {
            title: "Peran Blockchain dalam Meningkatkan Keamanan Transaksi Digital",
            type: "Conference",
            date: "18 November 2026",
            authors: "Dewi Kartika, Ahmad Fauzi",
            tags: ["Artificial Intelligence", "Keamanan Siber"],
        },
    ];

    return (
        <main className="min-h-screen max-w-7xl mx-auto px-4 py-24 flex flex-col gap-8 text-black bg-white">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center mt-4">Publications</h1>

            {/* Search Bar */}
            <div className="flex justify-center">
                <div className="relative w-full max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search publication by title"
                        className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-lg outline-none focus:border-gray-600 bg-transparent"
                    />
                </div>
            </div>

            {/* Filters and Metadata */}
            <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-wrap items-center gap-3">
                    <button className="flex items-center justify-between gap-2 px-3 py-1 border border-gray-400 bg-white text-sm">
                        <span>Research Topic</span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="flex items-center justify-between gap-2 px-3 py-1 border border-gray-400 bg-white text-sm">
                        <span>Lecturer</span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="flex items-center justify-between gap-2 px-3 py-1 border border-gray-400 bg-white text-sm">
                        <span>Year</span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="px-3 py-1 bg-gray-300 text-sm font-semibold border border-transparent text-black">
                        Clear All
                    </button>
                </div>

                {/* Active Filters */}
                <div className="flex flex-col gap-2 mt-2">
                    <span className="text-sm text-gray-700">Active filter:</span>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-gray-200 text-sm">
                            Artificial Intelligence
                        </span>
                        <span className="px-3 py-1 bg-gray-200 text-sm">2026</span>
                    </div>
                </div>

                <p className="text-sm text-gray-700 mt-2">Showing 12 Publications</p>
            </div>

            {/* List */}
            <div className="flex flex-col border-t border-gray-400 mt-2">
                {publications.map((pub, idx) => (
                    <div
                        key={idx}
                        className="py-6 border-b border-gray-400 flex flex-col gap-1.5"
                    >
                        <h2 className="text-lg font-bold">{pub.title}</h2>
                        <p className="text-sm text-gray-700">
                            {pub.type} &bull; {pub.date} &bull; {pub.authors}
                        </p>
                        <div className="flex gap-2 mt-1">
                            {pub.tags.map((tag, tIdx) => (
                                <span
                                    key={tIdx}
                                    className="px-2 py-0.5 border border-gray-500 text-xs text-gray-800"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
