import React from 'react';
import LecturerCard from '@/components/LecturerCard';
import dummyLecturers from '@/data/dummy-lecturers.json';
import { PersonLite } from '@/types/person';

export default function People() {
    const categories = [
        "Artificial Intelligence",
        "Cybersecurity & Privacy",
        "Data & Knowledge System",
        "Human-Centered Computing",
        "Networks & Distributed Systems",
        "Software & Computing System"
    ];

    return (
        <main className="min-h-screen bg-white w-full px-8 py-12 font-sans">
            <h1 className="text-[32px] font-bold text-center mb-12 text-primary-1000">People</h1>

            {/* Search */}
            <div className="mb-6 max-w-sm">
                <input
                    type="text"
                    placeholder="Search name"
                    className="w-full border border-primary-400 p-2 text-[15px] bg-white text-primary-900 placeholder:text-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
                />
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className="bg-primary-200 hover:bg-primary-300 text-primary-1000 p-3 text-[14px] leading-tight transition-colors text-left flex items-start min-h-[60px]"
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Lecturer Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-6 gap-y-8">
                {dummyLecturers.map((lecturer) => (
                    <LecturerCard key={lecturer.id} lecturer={lecturer as PersonLite} />
                ))}
                {/* Duplicating the dummy data once to fill the grid more (like the 8 items in lofi) */}
                {dummyLecturers.slice(0, 3).map((lecturer) => (
                    <LecturerCard key={lecturer.id + "-copy"} lecturer={lecturer as PersonLite} />
                ))}
            </div>
        </main>
    );
}