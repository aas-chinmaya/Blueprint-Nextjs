








"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loader from "@/components/ui/loader";
import {
  fetchMeetings,
  setSelectedMeeting,
  clearSelectedMeeting,
} from "@/store/features/meetingSlice";
import {
  fetchMoM,
  createMoM,
  updateMoM,
  deleteMoM,
} from "@/store/features/momSlice";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Video,
  Link,
  FileText,
  Download,
  Image,
} from "lucide-react";

const getInitials = (email) => {
  if (!email) return "?";
  const namePart = email.split("@")[0];
  const parts = namePart.split(/[.\-_]/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

const MoMForm = ({ meetingId, onClose, existingMoM, selectedMeeting }) => {
  const dispatch = useDispatch();
  const email = "it_chinmaya@outlook.com";
  const [formData, setFormData] = useState({
    date: selectedMeeting?.start?.dateTime
      ? new Date(selectedMeeting.start.dateTime).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    time: selectedMeeting?.start?.dateTime
      ? new Date(selectedMeeting.start.dateTime).toLocaleTimeString("en-US", { hour12: false }).slice(0, 5)
      : new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5),
    agenda: "",
    meetingMode: "",
    duration: "",
    participants: selectedMeeting?.attendees?.map((a) => a.email).join(",") || "",
    summary: "",
    notes: "",
    createdBy: email,
    signature: null,
  });

  useEffect(() => {
    if (existingMoM) {
      setFormData({
        date: existingMoM.date,
        time: existingMoM.time || new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5),
        agenda: existingMoM.agenda,
        meetingMode: existingMoM.meetingMode,
        duration: existingMoM.duration,
        participants: existingMoM.participants?.join(",") || "",
        summary: existingMoM.summary || existingMoM.meetingSummary || "",
        notes: existingMoM.notes || "",
        createdBy: existingMoM.createdBy || email,
        signature: existingMoM.signature || null,
      });
    }
  }, [existingMoM, email]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSelectChange = (name) => (value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const momData = {
      meetingId,
      date: formData.date,
      time: formData.time,
      agenda: formData.agenda,
      meetingMode: formData.meetingMode,
      duration: formData.duration,
      participants: formData.participants,
      summary: formData.summary,
      notes: formData.notes,
      createdBy: formData.createdBy,
      signature: formData.signature,
    };

    if (existingMoM) {
      dispatch(updateMoM({ meetingId, momData }));
    } else {
      dispatch(createMoM({ meetingId, momData }));
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-green-50 border-green-200 rounded-2xl shadow-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800">
            {existingMoM ? "Edit Meeting Minutes" : "Create Meeting Minutes"}
          </DialogTitle>
        </DialogHeader>
      
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Date */}
  <div>
    <label className="block text-sm font-medium text-green-700">Date</label>
    <Input
      type="date"
      name="date"
      value={formData.date}
      onChange={handleChange}
      className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500 rounded-lg bg-white text-black"
      required
    />
  </div>

  {/* Time */}
  <div>
    <label className="block text-sm font-medium text-green-700">Time</label>
    <Input
      type="time"
      name="time"
      value={formData.time}
      onChange={handleChange}
      className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500 rounded-lg bg-white text-black"
      required
    />
  </div>

  {/* Agenda */}
  <div className="col-span-2">
    <label className="block text-sm font-medium text-green-700">Agenda</label>
    <Textarea
      name="agenda"
      value={formData.agenda}
      onChange={handleChange}
      className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500 rounded-lg bg-white text-black"
      required
    />
  </div>

  {/* Meeting Mode */}
  <div>
    <label className="block text-sm font-medium text-green-700">Meeting Mode</label>
    <Select
      name="meetingMode"
      value={formData.meetingMode}
      onValueChange={handleSelectChange("meetingMode")}
      required
    >
      <SelectTrigger className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500 rounded-lg bg-white text-black">
        <SelectValue placeholder="Select Mode" />
      </SelectTrigger>
      <SelectContent className="bg-white border-green-200">
        <SelectItem value="Online">Online</SelectItem>
        <SelectItem value="In-person">In-person</SelectItem>
        <SelectItem value="Hybrid">Hybrid</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Duration */}
  <div>
    <label className="block text-sm font-medium text-green-700">Duration</label>
    <Input
      type="text"
      name="duration"
      value={formData.duration}
      onChange={handleChange}
      className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500 rounded-lg bg-white text-black"
      placeholder="e.g., 1 hour"
      required
    />
  </div>

  {/* Participants */}
  <div className="col-span-2">
    <label className="block text-sm font-medium text-green-700">Participants</label>
    <Textarea
      name="participants"
      value={formData.participants}
      onChange={handleChange}
      className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500 rounded-lg bg-white text-black"
      placeholder="Enter participant emails, separated by commas"
      required
    />
  </div>

  {/* Summary */}
  <div className="col-span-2">
    <label className="block text-sm font-medium text-green-700">Meeting Summary</label>
    <Textarea
      name="summary"
      value={formData.summary}
      onChange={handleChange}
      className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500 rounded-lg bg-white text-black"
      required
    />
  </div>

  {/* Notes */}
  <div className="col-span-2">
    <label className="block text-sm font-medium text-green-700">Notes</label>
    <Textarea
      name="notes"
      value={formData.notes}
      onChange={handleChange}
      className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500 rounded-lg bg-white text-black"
    />
  </div>

  {/* Signature */}
  <div className="col-span-2">
    <label className="block text-sm font-medium text-green-700">Signature (Optional)</label>
    <Input
      type="file"
      name="signature"
      accept="image/*"
      onChange={handleChange}
      className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500 rounded-lg bg-white text-black"
    />
  </div>

  {/* Buttons */}
  <div className="col-span-2 flex justify-end space-x-2">
    <Button
      type="button"
      variant="outline"
      onClick={onClose}
      className="border-green-300 text-green-700 hover:bg-green-100 rounded-lg"
    >
      Cancel
    </Button>
    <Button
      type="submit"
      className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
    >
      {existingMoM ? "Update" : "Create"}
    </Button>
  </div>
</form>

      </DialogContent>
    </Dialog>
  );
};

export default function MeetingDetails({ meetingId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const email = "it_chinmaya@outlook.com";
  const [showMoMForm, setShowMoMForm] = useState(false);
  const [editingMoM, setEditingMoM] = useState(null);

  const { meetings = [], selectedMeeting = null, loading = false } = useSelector(
    (state) => state.meetings || {}
  );
  const { mom = null, momLoading = false } = useSelector(
    (state) => state.mom || {}
  );

  useEffect(() => {
    dispatch(fetchMoM(meetingId));
    const meeting = meetings.find((m) => m.id === meetingId);
    if (meeting) {
      dispatch(setSelectedMeeting(meeting));
    } else {
      dispatch(fetchMeetings(email)).then(() => {
        const fetchedMeeting = meetings.find((m) => m.id === meetingId);
        if (fetchedMeeting) {
          dispatch(setSelectedMeeting(fetchedMeeting));
        } else {
          router.push("/meetings");
        }
      });
    }

    return () => {
      dispatch(clearSelectedMeeting());
    };
  }, [dispatch, meetingId, email,meetings, router]);

  const handleDeleteMoM = () => {
    if (confirm("Are you sure you want to delete this MoM?")) {
      dispatch(deleteMoM(meetingId));
    }
  };

  const handleDownloadMoM = async () => {
    try {
      const response = await fetch(`/mom/${meetingId}/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mom),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MoM_${meetingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading MoM PDF:", error);
      alert("Failed to download MoM PDF");
    }
  };

  const relatedMeetings = meetings
    .filter(
      (m) =>
        m.id !== meetingId &&
        (m.attendees?.some((a) =>
          selectedMeeting?.attendees?.some((sa) => sa.email === a.email)
        ) ||
          Math.abs(
            new Date(m.start.dateTime) - new Date(selectedMeeting?.start.dateTime)
          ) < 7 * 24 * 60 * 60 * 1000)
    )
    .slice(0, 5);

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString("en-US", { dateStyle: "medium" });
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString("en-US", { timeStyle: "short" });
  };

  if (loading || momLoading || !selectedMeeting) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex-1 space-y-6">
        <div className="bg-green-50 p-6 rounded-2xl shadow-md w-full  mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-green-800">{selectedMeeting.summary || "Untitled Meeting"}</h3>
            <Button
              variant="outline"
              onClick={() => router.push("/meetings")}
              className="text-green-600 border-green-300 hover:bg-green-100 hover:text-green-800 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2 text-green-600" />
              Back to Meetings
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 text-green-700">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="font-medium text-black">{formatDate(selectedMeeting.start.dateTime)}</span>
            </div>
            <div className="flex items-center space-x-3 text-green-700">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="font-medium text-black">
                {formatTime(selectedMeeting.start.dateTime)} - {formatTime(selectedMeeting.end.dateTime)}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-green-700">
              <Link className="h-5 w-5 text-green-600" />
              {selectedMeeting.hangoutLink ? (
                <a
                  href={selectedMeeting.hangoutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-green-600 underline hover:text-green-900"
                >
                  Google Meet
                </a>
              ) : (
                <span className="font-medium text-black">Online</span>
              )}
            </div>
            <div className="flex items-center space-x-3 text-green-700">
              <Users className="h-5 w-5 text-green-600" />
              <div className="flex space-x-2">
                {Array.isArray(selectedMeeting.attendees) && selectedMeeting.attendees.length > 0 ? (
                  selectedMeeting.attendees.map((attendee, idx) => (
                    <div key={idx} className="relative group">
                      <div className="w-8 h-8 rounded-full bg-green-200 text-green-800 font-semibold flex items-center justify-center cursor-default select-none">
                        {getInitials(attendee.email)}
                      </div>
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-green-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none transition-opacity duration-300 z-10">
                        {attendee.email}
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="font-medium text-black">None</span>
                )}
              </div>
            </div>
          </div>
          {selectedMeeting.conferenceData?.conferenceSolution?.name === "Google Meet" && (
            <div className="flex items-center space-x-4 p-4 bg-white border border-green-200 rounded-lg">
              <Image
                src={selectedMeeting.conferenceData.conferenceSolution.iconUri}
                alt="Google Meet"
                 width={10}
  height={10}
  className="rounded"
              />
              <div className="flex flex-col">
                <span className="text-green-800 font-semibold">Join Google Meet</span>
                <a
                  href={selectedMeeting.hangoutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline"
                >
                  {selectedMeeting.conferenceData.entryPoints[0]?.label}
                </a>
              </div>
            </div>
          )}
          {selectedMeeting.description && (
            <div className="p-4 bg-white border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Description</h4>
              <p className="text-black whitespace-pre-wrap">{selectedMeeting.description}</p>
            </div>
          )}
          <div className="text-sm text-green-600">
            Organized by: <span className="font-medium text-black">{selectedMeeting.attendees?.find((a) => a.organizer)?.email}</span>
          </div>
        </div>
        {relatedMeetings.length > 0 && (
          <div className="bg-green-50 p-6 rounded-2xl shadow-md w-full  mx-auto space-y-6 mt-6">
            <h3 className="text-xl font-bold text-green-800">Recent Meetings</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {relatedMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="border-b border-green-200 pb-3 cursor-pointer hover:bg-green-100 p-3 rounded-lg transition-colors"
                    onClick={() => router.push(`/meetings/${meeting.id}`)}
                  >
                    <p className="text-green-800 font-semibold">{meeting.summary}</p>
                    <p className="text-green-600 text-sm">
                      {formatDate(meeting.start.dateTime)} {formatTime(meeting.start.dateTime)}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
      <div className="w-full lg:w-80 p-4 lg:p-6">
        <div className="bg-green-50 p-6 rounded-2xl shadow-md space-y-4">
          <h3 className="text-xl font-bold text-green-800">Meeting Actions</h3>
          <Button
            onClick={() => setShowMoMForm(true)}
            className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <FileText className="w-5 h-5 mr-2 text-white" />
            {mom ? "Edit MoM" : "Create MoM"}
          </Button>
          {mom && (
            <>
              <Button
                onClick={handleDownloadMoM}
                className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                <Download className="w-5 h-5 mr-2 text-white" />
                Download MoM PDF
              </Button>
              <div className="space-y-3 p-4 bg-white border border-green-200 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800">Meeting Minutes</h4>
                <p className="text-black"><strong>Date:</strong> {mom.date}</p>
                <p className="text-black"><strong>Time:</strong> {mom.time}</p>
                <p className="text-black"><strong>Agenda:</strong> {mom.agenda}</p>
                <p className="text-black"><strong>Mode:</strong> {mom.meetingMode}</p>
                <p className="text-black"><strong>Duration:</strong> {mom.duration}</p>
                <p className="text-black"><strong>Participants:</strong> {mom.participants}</p>
                <p className="text-black"><strong>Summary:</strong> {mom.summary}</p>
                <p className="text-black"><strong>Notes:</strong> {mom.notes || "None"}</p>
                <p className="text-black"><strong>Created By:</strong> {mom.createdBy}</p>
                {mom.signature && (
                  <p className="text-black"><strong>Signature:</strong> <a href={mom.signature} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">View Signature</a></p>
                )}
                {mom.attachment && (
                  <p className="text-black"><strong>Attachment:</strong> <a href={mom.attachment} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">View PDF</a></p>
                )}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setEditingMoM(mom)}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleDeleteMoM}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {(showMoMForm || editingMoM) && (
        <MoMForm
          meetingId={meetingId}
          onClose={() => {
            setShowMoMForm(false);
            setEditingMoM(null);
          }}
          existingMoM={editingMoM}
          selectedMeeting={selectedMeeting}
        />
      )}
    </div>
  );
}




