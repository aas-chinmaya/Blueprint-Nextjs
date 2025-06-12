"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Pencil,
  Eye,
  Trash2,
  Plus,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import {
  fetchMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  setSelectedMeeting,
  clearSelectedMeeting,
  setCreateModalOpen,
  setEditModalOpen,
  setViewModalOpen,
  closeAllModals,
  clearError,
} from "@/store/features/meetingSlice";
// Utility function to convert ISO 8601 with offset to datetime-local format
const toDateTimeLocal = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Convert to local time and format as YYYY-MM-DDTHH:mm
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Utility function to convert datetime-local to ISO 8601 with +05:30 offset
const toISOWithOffset = (dateTimeLocal) => {
  if (!dateTimeLocal) return "";
  const date = new Date(dateTimeLocal);
  // Format as ISO 8601 with +05:30 offset
  return date.toISOString().replace("Z", "+05:30");
};

// Utility function to format date for display
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Utility function to format time for display
const formatTime = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Form component for creating/editing meetings
function MeetingForm({
  meeting = {},
  onSave,
  onCancel,
  isEditing = false,
  loading = false,
}) {
  const [formData, setFormData] = React.useState({
    eventId: meeting.id || "",
    email: meeting.email || "it_chinmaya@outlook.com",
    summary: meeting.summary || "new meeting",
    description: meeting.description || "defewfewfwefe",
    startTime: meeting.start ? toDateTimeLocal(meeting.start.dateTime) : "",
    endTime: meeting.end ? toDateTimeLocal(meeting.end.dateTime) : "",
    attendees: meeting.attendees
      ? meeting.attendees.map((a) => a.email).join(", ")
      : "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      startTime: toISOWithOffset(formData.startTime),
      endTime: toISOWithOffset(formData.endTime),
      attendees: formData.attendees
        .split(",")
        .map((email) => ({ email: email.trim() }))
        .filter((attendee) => attendee.email),
    });
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-green-800 font-medium">
            Organizer Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <Label htmlFor="summary" className="text-green-800 font-medium">
            Meeting Summary
          </Label>
          <Input
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime" className="text-green-800 font-medium">
              Start Time
            </Label>
            <Input
              id="startTime"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="border-green-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <Label htmlFor="endTime" className="text-green-800 font-medium">
              End Time
            </Label>
            <Input
              id="endTime"
              name="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="border-green-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="attendees" className="text-green-800 font-medium">
            Attendee Emails (comma-separated)
          </Label>
          <Input
            id="attendees"
            name="attendees"
            value={formData.attendees}
            onChange={handleChange}
            placeholder="email1@example.com, email2@example.com"
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <Label htmlFor="description" className="text-green-800 font-medium">
            Description
          </Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md p-2"
            rows={4}
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-green-300 text-green-700 hover:bg-green-50"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-700 hover:bg-green-800 text-white"
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Meeting"
              : "Create Meeting"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// View meeting details component

function MeetingDetails({ meeting, onClose }) {
  function getInitials(email) {
    if (!email) return "?";
    const namePart = email.split("@")[0];
    const parts = namePart.split(/[.\-_]/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }

  return (
    <div className="bg-green-50 p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-green-800">{meeting.summary}</h3>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="flex items-center space-x-3 text-green-700">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">
            {formatDate(meeting.start?.dateTime)}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center space-x-3 text-green-700">
          <Clock className="h-5 w-5" />
          <span className="font-medium">
            {formatTime(meeting.start?.dateTime)} -{" "}
            {formatTime(meeting.end?.dateTime)}
          </span>
        </div>

        {/* Location / Meeting Link */}
        <div className="flex items-center space-x-3 text-green-700">
          <MapPin className="h-5 w-5" />
          {meeting.hangoutLink ? (
            <a
              href={meeting.hangoutLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-green-900"
            >
              Google Meet
            </a>
          ) : (
            <span className="font-medium">Online</span>
          )}
        </div>

        {/* Attendees */}
    
        <div className="flex items-center space-x-3 text-green-700">
          <Users className="h-5 w-5" />
          <div className="flex space-x-2">
            {Array.isArray(meeting.attendees) &&
            meeting.attendees.length > 0 ? (
              meeting.attendees.map((attendee, idx) => (
                <div key={idx} className="relative group">
                  <div className="w-8 h-8 rounded-full bg-green-200 text-green-800 font-semibold flex items-center justify-center cursor-default select-none">
                    {getInitials(attendee.email)}
                  </div>
                  {/* Tooltip */}
                  <span
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                           opacity-0 group-hover:opacity-100
                           bg-green-800 text-white text-xs rounded py-1 px-2
                           whitespace-nowrap pointer-events-none
                           transition-opacity duration-300
                           z-10"
                  >
                    {attendee.email}
                  </span>
                </div>
              ))
            ) : (
              <span className="font-medium">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Google Meet Visual */}
      {meeting.conferenceData?.conferenceSolution?.name === "Google Meet" && (
        <div className="flex items-center space-x-4 p-4 bg-white border border-green-200 rounded-lg">
          <img
            src={meeting.conferenceData.conferenceSolution.iconUri}
            alt="Google Meet"
            className="w-10 h-10 rounded"
          />
          <div className="flex flex-col">
            <span className="text-green-800 font-semibold">
              Join Google Meet
            </span>
            <a
              href={meeting.hangoutLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline"
            >
              {meeting.conferenceData.entryPoints[0]?.label}
            </a>
          </div>
        </div>
      )}

      {/* Description */}
      {meeting.description && (
        <div className="p-4 bg-white border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Description</h4>
          <p className="text-green-700 whitespace-pre-wrap">
            {meeting.description}
          </p>
        </div>
      )}

      {/* Organizer */}
      <div className="text-sm text-green-600">
        Organized by:{" "}
        <span className="font-medium">
          {meeting.attendees?.find((a) => a.organizer)?.email}
        </span>
      </div>
    </div>
    //     <div className="flex items-center space-x-3 text-green-700">
    //   <Users className="h-5 w-5" />
    //   <div className="flex space-x-2">
    //     {Array.isArray(meeting.attendees) && meeting.attendees.length > 0 ? (
    //       meeting.attendees.map((attendee, idx) => (
    //         <div key={idx} className="relative group">
    //           <div
    //             className="w-8 h-8 rounded-full bg-green-200 text-green-800 font-semibold flex items-center justify-center cursor-default select-none"
    //           >
    //             {getInitials(attendee.email)}
    //           </div>
    //           {/* Tooltip */}
    //           <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
    //                            opacity-0 group-hover:opacity-100
    //                            bg-green-800 text-white text-xs rounded py-1 px-2
    //                            whitespace-nowrap pointer-events-none
    //                            transition-opacity duration-300
    //                            z-10">
    //             {attendee.email}
    //           </span>
    //         </div>
    //       ))
    //     ) : (
    //       <span className="font-medium">None</span>
    //     )}
    //   </div>
    // </div>
  );
}
import CodeVerificationModal from './MeetcodeModal';
import Loader from "@/components/ui/loader";
export default function Meeting() {

  //important 
  const [isModalOpen, setModalOpen] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState('');
 const email="it_chinmaya@outlook.com"

  const [open, setOpen] = useState(false);
  const toggleAttendees = () => {
    setShowAttendees((prev) => !prev);
  };
  const dispatch = useDispatch();
  const meetingsState = useSelector((state) => state.meetings || {});
  const {
    meetings = [],
    selectedMeeting = null,
    loading = false,
    error = null,
    modals = { isCreateOpen: false, isEditOpen: false, isViewOpen: false },
    createLoading = false,
    updateLoading = false,
    deleteLoading = false,
  } = meetingsState;

  // Fetch meetings on component mount
  useEffect(() => {
    dispatch(fetchMeetings(email));
    // dispatch(fetchMeetings("it_chinmaya@outlook.com"));
  // }, [dispatch,meetings]);
  }, [dispatch]);
  console.log("meeting list",meetings)

//first
  // const handleCreate = async (newMeeting) => {
  //   await dispatch(createMeeting(newMeeting));
  //   dispatch(clearSelectedMeeting());
  // };

//last

const handleCreate = async (newMeeting) => {
    try {
      const response = await dispatch(createMeeting(newMeeting));

      if (response.payload && response.payload.message === "User not authorized") {
        setVerificationUrl(response.payload.url); // save the verification URL
        setModalOpen(true); // open the modal
      } else {
        dispatch(clearSelectedMeeting());
        dispatch(setCreateModalOpen(false));
      }
    } catch (error) {
      console.error("❌ Error creating meeting:", error);
    }
  };



  const handleEdit = async (updatedMeeting) => {
    await dispatch(
      updateMeeting({ id: selectedMeeting.id, meetingData: updatedMeeting })
    );
    dispatch(clearSelectedMeeting());
  };

  const handleDelete = async ({ id, email }) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      await dispatch(deleteMeeting({ id, email }));
    }
  };

  const openEditModal = (meeting) => {
    dispatch(setSelectedMeeting(meeting));
    dispatch(setEditModalOpen(true));
  };

  const openViewModal = (meeting) => {
    dispatch(setSelectedMeeting(meeting));
    dispatch(setViewModalOpen(true));
  };

  const handleCloseModals = () => {
    dispatch(closeAllModals());
    dispatch(clearSelectedMeeting());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen">
      <Card className="mx-auto border-green-200 shadow-lg">
        <CardHeader className="border-b border-green-200">
          <CardTitle className="flex justify-between items-center text-green-800">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6" />
              <span className="text-2xl font-bold">All Meetings</span>
            </div>
            <Dialog
              open={modals.isCreateOpen}
              onOpenChange={(open) => dispatch(setCreateModalOpen(open))}
            >
              <DialogTrigger asChild>
                <Button className="bg-green-700 hover:bg-green-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Meeting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-green-800">
                    Create New Meeting
                  </DialogTitle>
                </DialogHeader>
                <MeetingForm
                  onSave={handleCreate}
                  onCancel={handleCloseModals}
                  loading={createLoading}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
     

          {loading ? (
            <div className="flex justify-center items-center py-8">
             <Loader/>
            </div>
          ) : meetings.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-green-700">No meetings found.</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-green-50">
                    <TableHead className="text-green-800 font-semibold">
                      Title
                    </TableHead>
                    <TableHead className="text-green-800 font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-green-800 font-semibold">
                      Time
                    </TableHead>
                    <TableHead className="text-green-800 font-semibold">
                      Link
                    </TableHead>
                    <TableHead className="text-green-800 font-semibold">
                      Attendees
                    </TableHead>
                    <TableHead className="text-green-800 font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.id} className="hover:bg-green-50">
                      <TableCell className="font-medium text-green-800">
                        {meeting.summary}
                      </TableCell>
                      <TableCell className="text-green-700">
                        {formatDate(meeting.start?.dateTime)}
                      </TableCell>
                      <TableCell className="text-green-700">
                        {formatTime(meeting.start?.dateTime)} -{" "}
                        {formatTime(meeting.end?.dateTime)}
                      </TableCell>
                      <TableCell className="text-green-700">
                        {meeting.hangoutLink ? (
                          <a
                            href={meeting.hangoutLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
                          >
                            Join Meeting
                          </a>
                        ) : (
                          "Online"
                        )}
                      </TableCell>

                      {/* <TableCell className="text-green-700">
                        {Array.isArray(meeting.attendees) ? meeting.attendees.map(a => a.email).join(", ") : "None"}
                      </TableCell> */}
                      <TableCell className="text-green-700">
                        {Array.isArray(meeting.attendees) &&
                        meeting.attendees.length > 0
                          ? `${meeting.attendees.length} attendees`
                          : "None"}
                      </TableCell>

                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewModal(meeting)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-100"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(meeting)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete({
                                id: meeting.id,
                                email: email
                                // email: meeting.attendees?.find(
                                //   (a) => a.organizer
                                // )?.email,
                              })
                            }
                            disabled={deleteLoading}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Edit Meeting Modal */}
          <Dialog
            open={modals.isEditOpen}
            onOpenChange={(open) => dispatch(setEditModalOpen(open))}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-green-800">
                  Edit Meeting
                </DialogTitle>
              </DialogHeader>
              {selectedMeeting && (
                <MeetingForm
                  meeting={selectedMeeting}
                  onSave={handleEdit}
                  onCancel={handleCloseModals}
                  isEditing={true}
                  loading={updateLoading}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* View Meeting Modal */}
          <Dialog
            open={modals.isViewOpen}
            onOpenChange={(open) => dispatch(setViewModalOpen(open))}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-green-800">
                  Meeting Details
                </DialogTitle>
              </DialogHeader>
              {selectedMeeting && (
                <MeetingDetails
                  meeting={selectedMeeting}
                  onClose={handleCloseModals}
                />
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

       {/* Only the modal renders on unauthorized */}
      <CodeVerificationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        verificationUrl={verificationUrl}
      />
    </div>
  );
}




