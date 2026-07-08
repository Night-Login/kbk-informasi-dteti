import React from 'react';
import { PersonLite } from '../types/person';

interface LecturerCardProps {
  lecturer: PersonLite;
}

export default function LecturerCard({ lecturer }: LecturerCardProps) {
  return (
    <div className="bg-primary-200 p-6 flex flex-col gap-5 w-full max-w-[300px] mx-auto">
      {/* Profile Image */}
      <div className="w-full aspect-square rounded-full overflow-hidden bg-primary-300 relative mx-auto">
        {lecturer.profilePictureUrl ? (
          <img
            src={lecturer.profilePictureUrl}
            alt={lecturer.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #fff 25%, #fff 75%, #000 75%, #000)',
            backgroundPosition: '0 0, 10px 10px',
            backgroundSize: '20px 20px'
          }}></div>
        )}
      </div>

      {/* Basic Info */}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-bold text-[17px] text-primary-1000 leading-tight">
          {lecturer.fullName}
        </h3>
        <p className="text-[13px] text-primary-800">
          {lecturer.position}
        </p>
        <p className="text-[13px] text-primary-800 mt-1">
          Supervision: {lecturer.isSupervisorAvailable ? 'Available' : 'Unavailable'}
        </p>
      </div>

      {/* Contact & Location Info */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[13px] text-primary-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{lecturer.contact.labName || "Lab XYZ"}</span>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-primary-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>{lecturer.contact.phone || "(+62)81234567890"}</span>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-primary-800 break-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>{lecturer.contact.email}</span>
        </div>
      </div>
    </div>
  );
}
