// // app/meeting/[id]/page.js
// "use client";

// import { useParams } from "next/navigation";
// import MeetingDetails from "@/components/meetings2/MeetingDetails";

// export default function MeetingDetailsPage() {
//   const { id } = useParams(); // Extract meeting ID from URL
//   return <MeetingDetails meetingId={id} />;
// }





"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  Eye,
  FileText,
  MessageSquare,
  Tag,
  CheckCircle,
  User,
} from "lucide-react";
import { format, parseISO } from "date-fns";

// Static dummy meetings data
const dummyMeetingsData = [
  {
    contactId: "CId-june-25-003",
    meetings: [
      {
        meetingId: "M001",
        title: "Initial Consultation",
        date: "2025-05-15T10:00:00Z",
        location: "Zoom Meeting",
        attendees: ["John Doe", "Jane Smith"],
        agenda: "Discuss project requirements",
        mom: {
          summary: "Discussed project scope and timeline.",
          actionItems: [
            { task: "Send proposal draft", assignee: "John Doe", dueDate: "2025-05-20" },
            { task: "Schedule follow-up", assignee: "Jane Smith", dueDate: "2025-05-18" },
          ],
          decisions: ["Agreed on project start date: June 1, 2025"],
          recordedBy: "Jane Smith",
          recordedDate: "2025-05-15",
        },
      },
      {
        meetingId: "CId-june-25-004",
        title: "Follow-up Meeting",
        date: "2025-05-22T14:00:00Z",
        location: "Office HQ",
        attendees: ["John Doe", "Jane Smith", "Bob Johnson"],
        agenda: "Review proposal and finalize contract",
        mom: null, // No MoM yet
      },
    ],
  },
  {
    contactId: "CId-june-25-005",
    meetings: [
      {
        meetingId: "M003",
        title: "Product Demo",
        date: "2025-06-01T11:00:00Z",
        location: "Google Meet",
        attendees: ["Alice Brown", "Mike Wilson"],
        agenda: "Demonstrate product features",
        mom: null, // No MoM yet
      },
    ],
  },
];

const MeetingsPage = () => {
  const { id } = useParams();
  const [isMeetingDetailsModalOpen, setIsMeetingDetailsModalOpen] = useState(false);
  const [isCreateMomModalOpen, setIsCreateMomModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [momForm, setMomForm] = useState({
    summary: "",
    actionItems: [{ task: "", assignee: "", dueDate: "" }],
    decisions: [""],
    recordedBy: "",
    recordedDate: new Date().toISOString().split("T")[0],
  });

  // Find meetings for the contact ID
  const contactMeetings = dummyMeetingsData.find((data) => data.contactId === id)?.meetings || [];

  // Handle view meeting details
  const handleViewMeetingDetails = (meeting) => {
    setSelectedMeeting(meeting);
    setIsMeetingDetailsModalOpen(true);
  };

  // Handle open create MoM modal
  const handleOpenCreateMom = (meeting) => {
    setSelectedMeeting(meeting);
    setIsCreateMomModalOpen(true);
  };

  // Handle MoM form changes
  const handleMomFormChange = (e, field, index = null) => {
    if (field === "actionItems") {
      const updatedActionItems = [...momForm.actionItems];
      updatedActionItems[index][e.target.name] = e.target.value;
      setMomForm({ ...momForm, actionItems: updatedActionItems });
    } else if (field === "decisions") {
      const updatedDecisions = [...momForm.decisions];
      updatedDecisions[index] = e.target.value;
      setMomForm({ ...momForm, decisions: updatedDecisions });
    } else {
      setMomForm({ ...momForm, [field]: e.target.value });
    }
  };

  // Add new action item
  const addActionItem = () => {
    setMomForm({
      ...momForm,
      actionItems: [...momForm.actionItems, { task: "", assignee: "", dueDate: "" }],
    });
  };

  // Add new decision
  const addDecision = () => {
    setMomForm({ ...momForm, decisions: [...momForm.decisions, ""] });
  };

  // Handle MoM form submission (dummy action)
  const handleMomSubmit = () => {
    console.log("MoM Submitted:", momForm);
    setIsCreateMomModalOpen(false);
    setMomForm({
      summary: "",
      actionItems: [{ task: "", assignee: "", dueDate: "" }],
      decisions: [""],
      recordedBy: "",
      recordedDate: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="min-h-screen p-6">
      <Card className="border-green-300 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-800 flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2" />
            Meetings for Contact ID: {id}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Meetings Table */}
          <div className="overflow-x-auto rounded-lg border border-green-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50 hover:bg-green-100">
                  <TableHead className="text-green-800 font-semibold">Meeting ID</TableHead>
                  <TableHead className="text-green-800 font-semibold">Title</TableHead>
                  <TableHead className="text-green-800 font-semibold">Date</TableHead>
                  <TableHead className="text-green-800 font-semibold">Location</TableHead>
                  <TableHead className="text-green-800 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactMeetings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-green-700 text-lg">
                        No meetings found for this contact.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  contactMeetings.map((meeting) => (
                    <TableRow key={meeting.meetingId} className="hover:bg-green-50">
                      <TableCell>{meeting.meetingId}</TableCell>
                      <TableCell>{meeting.title}</TableCell>
                      <TableCell>{format(parseISO(meeting.date), "PPP HH:mm")}</TableCell>
                      <TableCell>{meeting.location}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-700 hover:bg-green-100"
                            onClick={() => handleViewMeetingDetails(meeting)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-700 hover:bg-green-100"
                            onClick={() => handleOpenCreateMom(meeting)}
                            disabled={!!meeting.mom}
                            title="Create MoM"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Create MoM
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Details Modal */}
      <Dialog
        open={isMeetingDetailsModalOpen}
        onOpenChange={() => setIsMeetingDetailsModalOpen(false)}
      >
        <DialogContent className="border-green-300 bg-green-50 max-w-2xl rounded-2xl shadow-xl">
          <DialogHeader className="bg-green-100 p-4 rounded-t-2xl">
            <DialogTitle className="text-green-800 text-2xl font-bold flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2" />
              Meeting Details
            </DialogTitle>
          </DialogHeader>
          {selectedMeeting ? (
            <div className="space-y-4 text-green-900 p-6">
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Meeting ID:</strong> {selectedMeeting.meetingId}
                </p>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Title:</strong> {selectedMeeting.title}
                </p>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Date:</strong> {format(parseISO(selectedMeeting.date), "PPP HH:mm")}
                </p>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Location:</strong> {selectedMeeting.location}
                </p>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Attendees:</strong> {selectedMeeting.attendees.join(", ")}
                </p>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                <p>
                  <strong>Agenda:</strong> {selectedMeeting.agenda}
                </p>
              </div>
              {selectedMeeting.mom ? (
                <>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                    <p>
                      <strong>MoM Summary:</strong> {selectedMeeting.mom.summary}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <Tag className="h-5 w-5 mr-2 text-green-600" />
                      <p>
                        <strong>Action Items:</strong>
                      </p>
                    </div>
                    <ul className="list-disc pl-8">
                      {selectedMeeting.mom.actionItems.map((item, index) => (
                        <li key={index}>
                          {item.task} (Assignee: {item.assignee}, Due: {item.dueDate})
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      <p>
                        <strong>Decisions:</strong>
                      </p>
                    </div>
                    <ul className="list-disc pl-8">
                      {selectedMeeting.mom.decisions.map((decision, index) => (
                        <li key={index}>{decision}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-600" />
                    <p>
                      <strong>Recorded By:</strong> {selectedMeeting.mom.recordedBy}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
                    <p>
                      <strong>Recorded Date:</strong> {selectedMeeting.mom.recordedDate}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-green-700">No MoM recorded for this meeting.</div>
              )}
            </div>
          ) : (
            <div className="text-green-700 text-lg p-6">No meeting selected.</div>
          )}
          <DialogFooter className="p-4">
            <Button
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-100"
              onClick={() => setIsMeetingDetailsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create MoM Modal */}
      <Dialog
        open={isCreateMomModalOpen}
        onOpenChange={() => setIsCreateMomModalOpen(false)}
      >
        <DialogContent className="border-green-300 bg-green-50 max-w-2xl rounded-2xl shadow-xl">
          <DialogHeader className="bg-green-100 p-4 rounded-t-2xl">
            <DialogTitle className="text-green-800 text-2xl font-bold flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              Create Minutes of Meeting
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-6">
            <div>
              <label className="text-green-800 font-semibold flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Summary
              </label>
              <Textarea
                value={momForm.summary}
                onChange={(e) => handleMomFormChange(e, "summary")}
                placeholder="Enter meeting summary..."
                className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
              />
            </div>
            <div>
              <label className="text-green-800 font-semibold flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Action Items
              </label>
              {momForm.actionItems.map((item, index) => (
                <div key={index} className="space-y-2 mt-2">
                  <Input
                    name="task"
                    value={item.task}
                    onChange={(e) => handleMomFormChange(e, "actionItems", index)}
                    placeholder="Task description"
                    className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
                  />
                  <Input
                    name="assignee"
                    value={item.assignee}
                    onChange={(e) => handleMomFormChange(e, "actionItems", index)}
                    placeholder="Assignee"
                    className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
                  />
                  <Input
                    name="dueDate"
                    type="date"
                    value={item.dueDate}
                    onChange={(e) => handleMomFormChange(e, "actionItems", index)}
                    className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                className="mt-2 border-green-500 text-green-700 hover:bg-green-100"
                onClick={addActionItem}
              >
                Add Action Item
              </Button>
            </div>
            <div>
              <label className="text-green-800 font-semibold flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Decisions
              </label>
              {momForm.decisions.map((decision, index) => (
                <Input
                  key={index}
                  value={decision}
                  onChange={(e) => handleMomFormChange(e, "decisions", index)}
                  placeholder="Decision description"
                  className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
                />
              ))}
              <Button
                variant="outline"
                className="mt-2 border-green-500 text-green-700 hover:bg-green-100"
                onClick={addDecision}
              >
                Add Decision
              </Button>
            </div>
            <div>
              <label className="text-green-800 font-semibold flex items-center">
                <User className="h-5 w-5 mr-2" />
                Recorded By
              </label>
              <Input
                value={momForm.recordedBy}
                onChange={(e) => handleMomFormChange(e, "recordedBy")}
                placeholder="Recorder's name"
                className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
              />
            </div>
            <div>
              <label className="text-green-800 font-semibold flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Recorded Date
              </label>
              <Input
                type="date"
                value={momForm.recordedDate}
                onChange={(e) => handleMomFormChange(e, "recordedDate")}
                className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
              />
            </div>
            <Button
              className="bg-green-600 text-white hover:bg-green-700 w-full"
              onClick={handleMomSubmit}
            >
              Submit MoM
            </Button>
          </div>
          <DialogFooter className="p-4">
            <Button
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-100"
              onClick={() => setIsCreateMomModalOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingsPage;