"use client"
import { useParams } from "next/navigation";
import MeetingDetailsWithMOM from "@/components/meetings/mom/MeetingDetailsWithMOM";
// this file should be de;leted later after testing the meeting  
export default function Page() {
    const { id } = useParams();
  return (
    <>
      <div className="px-4 lg:px-6">
    <MeetingDetailsWithMOM  id={id} />
    
      </div>
    </>
  );
}