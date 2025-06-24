
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
  Search,
  Image,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Loader from "@/components/ui/loader";
import CodeVerificationModal from "./meeting/MeetcodeModal";
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
import Link from "next/link";

// Utility functions
const toDateTimeLocal = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toISOWithOffset = (dateTimeLocal) => {
  if (!dateTimeLocal) return "";
  const date = new Date(dateTimeLocal);
  return date.toISOString().replace("Z", "+05:30");
};

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function getInitials(email) {
  if (!email) return "?";
  const namePart = email.split("@")[0];
  const parts = namePart.split(/[.\-_]/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};




// Inline Meeting Form component
function MeetingForm({
  meeting = {},
  onSave,
  onCancel,
  isEditing = false,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    eventId: meeting.id || "",
    email: meeting.email || "it_chinmaya@outlook.com",
    summary: meeting.summary || "New Meeting",
    description: meeting.description || "",
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


// Inline Meeting Details component
function MeetingDetails({ meeting, onClose }) {
  return (
    <div className="bg-green-50 p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-green-800">{meeting.summary}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-3 text-green-700">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">
            {formatDate(meeting.start?.dateTime)}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-green-700">
          <Clock className="h-5 w-5" />
          <span className="font-medium">
            {formatTime(meeting.start?.dateTime)} -{" "}
            {formatTime(meeting.end?.dateTime)}
          </span>
        </div>
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
        <div className="flex items-center space-x-3 text-green-700">
          <Users className="h-5 w-5" />
          <div className="flex space-x-2">
            {Array.isArray(meeting.attendees) && meeting.attendees.length > 0 ? (
              meeting.attendees.map((attendee, idx) => (
                <div key={idx} className="relative group">
                  <div className="w-8 h-8 rounded-full bg-green-200 text-green-800 font-semibold flex items-center justify-center cursor-default select-none">
                    {getInitials(attendee.email)}
                  </div>
                  <span
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-green-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none transition-opacity duration-300 z-10"
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
      {meeting.conferenceData?.conferenceSolution?.name === "Google Meet" && (
        <div className="flex items-center space-x-4 p-4 bg-white border border-green-200 rounded-lg">
          <Image
              src={meeting.conferenceData.conferenceSolution.iconUri}
              alt="Google Meet"
              width={40}
              height={40}
              className="rounded"
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
      {meeting.description && (
        <div className="p-4 bg-white border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Description</h4>
          <p className="text-green-700 whitespace-pre-wrap">
            {meeting.description}
          </p>
        </div>
      )}
      <div className="text-sm text-green-600">
        Organized by:{" "}
        <span className="font-medium">
          {meeting.attendees?.find((a) => a.organizer)?.email || "N/A"}
        </span>
      </div>
    </div>
  );
}

export default function Meeting() {
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
  const email = "it_chinmaya@outlook.com";
  const [isModalOpen, setModalOpen] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dateFilter, setDateFilter] = useState("");
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");

  // Fetch meetings on mount
  useEffect(() => {
    dispatch(fetchMeetings(email));
  }, [dispatch, email]);

  // Filter and sort meetings
  const filteredMeetings = meetings
    .filter((meeting) => {
      const matchesSearch = meeting.summary
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const meetingDate = meeting.start?.dateTime
        ? new Date(meeting.start.dateTime).toISOString().split("T")[0]
        : "";
      const matchesDate =
        !dateFilter || meetingDate === dateFilter.split("T")[0];
      const matchesDateRange =
        !dateRangeStart ||
        !dateRangeEnd ||
        (new Date(meetingDate) >= new Date(dateRangeStart) &&
          new Date(meetingDate) <= new Date(dateRangeEnd));
      return matchesSearch && matchesDate && matchesDateRange;
    })
    .sort((a, b) => {
      const dateA = new Date(a.start?.dateTime || 0);
      const dateB = new Date(b.start?.dateTime || 0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleCreate = async (newMeeting) => {
    try {
      const response = await dispatch(createMeeting(newMeeting));
      console.log("✅ Meeting created successfully:", response);
      if (response.payload && response.payload.message === "User not authorized") {
        setVerificationUrl(response.payload.url);
        setModalOpen(true);
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
      updateMeeting({ eventId: selectedMeeting.id, meetingData: updatedMeeting })
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
    <div className="min-h-screen p-6">
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
          {/* Search and Filter Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-green-800 font-medium">
                  Search Meetings
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by meeting title..."
                    className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sort" className="text-green-800 font-medium">
                  Sort by Date
                </Label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md p-2"
                >
                  <option value="asc">Oldest First</option>
                  <option value="desc">Newest First</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFilter" className="text-green-800 font-medium">
                  Filter by Date
                </Label>
                <Input
                  id="dateFilter"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label
                    htmlFor="dateRangeStart"
                    className="text-green-800 font-medium"
                  >
                    Date Range Start
                  </Label>
                  <Input
                    id="dateRangeStart"
                    type="date"
                    value={dateRangeStart}
                    onChange={(e) => setDateRangeStart(e.target.value)}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="dateRangeEnd"
                    className="text-green-800 font-medium"
                  >
                    Date Range End
                  </Label>
                  <Input
                    id="dateRangeEnd"
                    type="date"
                    value={dateRangeEnd}
                    onChange={(e) => setDateRangeEnd(e.target.value)}
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
              <Button
                variant="outline"
                onClick={handleClearError}
                className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                Clear Error
              </Button>
            </Alert>
          )}

          {/* Meetings Table */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader />
            </div>
          ) : filteredMeetings.length === 0 ? (
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
                  {filteredMeetings.map((meeting) => (
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
                      <TableCell className="text-green-700">
                        {Array.isArray(meeting.attendees) &&
                        meeting.attendees.length > 0
                          ? `${meeting.attendees.length} attendees`
                          : "None"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Link href={`/meetings/${meeting.id}`} passHref>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-800 hover:bg-green-100"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        
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
                              handleDelete({ id: meeting.id, email })
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

          {/* Verification Modal */}
          <CodeVerificationModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            verificationUrl={verificationUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
}





