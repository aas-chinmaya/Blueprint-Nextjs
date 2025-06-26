"use client";

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { createMoM, fetchMoM, updateMoM } from '@/store/features/momSlice';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Save,
  X,
  Edit,
  Download,
  Plus,
  Loader2,
} from 'lucide-react';

// Helper function to format time
const formatTimes = (dateTime) => {
  if (!dateTime) return 'N/A';
  try {
    return format(new Date(dateTime), 'p');
  } catch {
    return 'N/A';
  }
};

function MeetingDetailsWithMOM2({ meetingId, TIME_ZONE }) {
  const meeting = {
    "meetingId": "k99abt7gg9hmi3gu4uhdooel54",
    "title": "New Meeting",
    "date": "2025-06-29T10:00:00+05:30",
    "location": "https://meet.google.com/aps-pjfq-ixt",
    "attendees": "it_chinmaya@outlook.com",
    "agenda": "wedfqwfqwf",
    "mom": [],
    "start": {
      "dateTime": "2025-06-29T10:00:00+05:30",
      "timeZone": "Asia/Kolkata"
    },
    "end": {
      "dateTime": "2025-06-29T10:30:00+05:30",
      "timeZone": "Asia/Kolkata"
    },
    "hangoutLink": "https://meet.google.com/aps-pjfq-ixt",
    "htmlLink": "https://www.google.com/calendar/event?eid=azk5YWJ0N2dnOWhtaTNndTR1aGRvb2VsNTQgaXRfY2hpbm1heWFAb3V0bG9vay5jb20",
    "conferenceData": {
      "createRequest": {
        "requestId": "meet-1750679842698",
        "conferenceSolutionKey": {
          "type": "hangoutsMeet"
        },
        "status": {
          "statusCode": "success"
        }
      },
      "entryPoints": [
        {
          "entryPointType": "video",
          "uri": "https://meet.google.com/aps-pjfq-ixt",
          "label": "meet.google.com/aps-pjfq-ixt"
        }
      ],
      "conferenceSolution": {
        "key": {
          "type": "hangoutsMeet"
        },
        "name": "Google Meet",
        "iconUri": "https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png"
      },
      "conferenceId": "aps-pjfq-ixt"
    }
  };

  const dispatch = useDispatch();
  const { mom, momLoading, momError } = useSelector((state) => state.mom);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Safely handle attendees
  const getAttendeesString = useCallback((attendees) => {
    if (Array.isArray(attendees)) {
      return attendees.join(', ');
    }
    return attendees ? String(attendees) : 'N/A';
  }, []);

  // Compute duration
  const getDurationString = useCallback(() => {
    const start = formatTimes(meeting?.start?.dateTime);
    const end = formatTimes(meeting?.end?.dateTime);
    return start && end ? `${start} - ${end}` : 'N/A';
  }, []);

  const [momForm, setMomForm] = useState({
    agenda: meeting?.agenda || '',
    meetingMode: meeting?.conferenceData?.conferenceSolution?.name || 'Online',
    duration: getDurationString(),
    participants: getAttendeesString(meeting?.attendees),
    summary: '',
    notes: '',
    createdBy: '',
    meetingId: meetingId || meeting.meetingId,
  });

  useEffect(() => {
    if (!meetingId) {
      setIsInitialLoading(false);
      toast({
        title: 'Error',
        description: 'Meeting ID is missing.',
        variant: 'destructive',
      });
      return;
    }

    let isMounted = true;
    setIsInitialLoading(true);

    dispatch(fetchMoM(meetingId))
      .unwrap()
      .then(() => {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setIsInitialLoading(false);
          toast({
            title: 'Error',
            description: `Failed to fetch MoM: ${error?.message || 'Unknown error'}`,
            variant: 'destructive',
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [meetingId, dispatch]);

  useEffect(() => {
    if (mom && mom.meetingId === meetingId) {
      setMomForm({
        agenda: mom.agenda || meeting?.agenda || '',
        meetingMode: mom.meetingMode || meeting?.conferenceData?.conferenceSolution?.name || 'Online',
        duration: mom.duration || getDurationString(),
        participants: Array.isArray(mom.participants)
          ? mom.participants.join(', ')
          : getAttendeesString(mom.participants) || getAttendeesString(meeting?.attendees),
        summary: mom.summary || '',
        notes: mom.notes || '',
        createdBy: mom.createdBy || '',
        meetingId: meetingId || meeting.meetingId,
      });
      setIsFormOpen(false);
      setIsEditMode(false);
    } else if (!mom && !momLoading && !isInitialLoading) {
      setMomForm({
        agenda: meeting?.agenda || '',
        meetingMode: meeting?.conferenceData?.conferenceSolution?.name || 'Online',
        duration: getDurationString(),
        participants: getAttendeesString(meeting?.attendees),
        summary: '',
        notes: '',
        createdBy: '',
        meetingId: meetingId || meeting.meetingId,
      });
      setIsFormOpen(false);
      setIsEditMode(false);
    }
  }, [mom, momLoading, isInitialLoading, meeting, meetingId, getAttendeesString, getDurationString]);

  const handleMomFormChange = (e, field) => {
    setMomForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!momForm.createdBy.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter the name of the person who created the MoM.',
        variant: 'destructive',
      });
      return;
    }

    if (!meetingId) {
      toast({
        title: 'Error',
        description: 'Meeting ID is missing.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const momData = {
        ...momForm,
        participants: momForm.participants
          ?.split(',')
          .map((p) => p.trim())
          .filter(Boolean) || [],
        meetingId: meetingId,
      };

      if (mom && isEditMode) {
        await dispatch(updateMoM(momData)).unwrap();
        toast({
          title: 'Success',
          description: 'MoM updated successfully!',
          variant: 'success',
        });
      } else {
        await dispatch(createMoM(momData)).unwrap();
        toast({
          title: 'Success',
          description: 'MoM created successfully!',
          variant: 'success',
        });
      }
      setIsFormOpen(false);
      setIsEditMode(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mom && isEditMode ? 'update' : 'create'} MoM: ${error?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  const handleDownloadMoM = () => {
    if (mom?.attachmentUrl) {
      window.open(mom.attachmentUrl, '_blank');
    } else {
      toast({
        title: 'Error',
        description: 'No MoM attachment available',
        variant: 'destructive',
      });
    }
  };

  const handleEditMoM = () => {
    if (!mom) {
      toast({
        title: 'Error',
        description: 'No MoM data available to edit.',
        variant: 'destructive',
      });
      return;
    }
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleCreateMoM = () => {
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
    if (mom) {
      setMomForm({
        agenda: mom.agenda || meeting?.agenda || '',
        meetingMode: mom.meetingMode || meeting?.conferenceData?.conferenceSolution?.name || 'Online',
        duration: mom.duration || getDurationString(),
        participants: Array.isArray(mom.participants)
          ? mom.participants.join(', ')
          : getAttendeesString(mom.participants) || getAttendeesString(meeting?.attendees),
        summary: mom.summary || '',
        notes: mom.notes || '',
        createdBy: mom.createdBy || '',
        meetingId: meetingId || meeting.meetingId,
      });
    } else {
      setMomForm({
        agenda: meeting?.agenda || '',
        meetingMode: meeting?.conferenceData?.conferenceSolution?.name || 'Online',
        duration: getDurationString(),
        participants: getAttendeesString(meeting?.attendees),
        summary: '',
        notes: '',
        createdBy: '',
        meetingId: meetingId || meeting.meetingId,
      });
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="text-primary font-medium">Loading Meeting Details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px] bg-gray-50 rounded-lg p-6">
      {momLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2 text-primary font-medium">Processing...</span>
        </div>
      )}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            {mom && !isFormOpen
              ? 'Meeting Details & MoM'
              : isEditMode
              ? 'Edit Minutes of Meeting'
              : 'Create Minutes of Meeting'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mom && !isFormOpen ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-4 w-4 text-primary" />
                    <strong>Agenda:</strong> {mom.agenda || 'N/A'}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-primary" />
                    <strong>Meeting Mode:</strong> {mom.meetingMode || 'NWI/A'}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-4 w-4 text-primary" />
                    <strong>Duration:</strong> {mom.duration || 'N/A'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-gray-700">
                    <Users className="h-4 w-4 text-primary" />
                    <strong>Participants:</strong>{' '}
                    {Array.isArray(mom.participants)
                      ? mom.participants.join(', ')
                      : getAttendeesString(mom.participants) || 'None'}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-4 w-4 text-primary" />
                    <strong>Summary:</strong> {mom.summary || 'N/A'}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-4 w-4 text-primary" />
                    <strong>Notes:</strong> {mom.notes || 'N/A'}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <Users className="h-4 w-4 text-primary" />
                    <strong>Created By:</strong> {mom.createdBy || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleEditMoM}
                  disabled={!mom}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit MoM
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDownloadMoM}
                  disabled={!mom?.attachmentUrl}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download MoM
                </Button>
              </div>
            </div>
          ) : !mom && !isFormOpen ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">No Minutes of Meeting found for this meeting.</p>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                onClick={handleCreateMoM}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create MoM
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 text-primary">
                    <FileText className="h-4 w-4" /> Agenda
                  </Label>
                  <Input
                    value={momForm.agenda}
                    onChange={(e) => handleMomFormChange(e, 'agenda')}
                    placeholder="Enter meeting agenda..."
                    className="mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 text-primary">
                    <Calendar className="h-4 w-4" /> Meeting Mode
                  </Label>
                  <Input
                    value={momForm.meetingMode}
                    onChange={(e) => handleMomFormChange(e, 'meetingMode')}
                    placeholder="Online/In-person"
                    className="mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 text-primary">
                    <Clock className="h-4 w-4" /> Duration
                  </Label>
                  <Input
                    value={momForm.duration}
                    onChange={(e) => handleMomFormChange(e, 'duration')}
                    placeholder="Start time - End time"
                    className="mt-1"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2 text-primary">
                    <Users className="h-4 w-4" /> Participants
                  </Label>
                  <Input
                    value={momForm.participants}
                    onChange={(e) => handleMomFormChange(e, 'participants')}
                    placeholder="Comma-separated names..."
                    className="mt-1"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label className="flex items-center gap-2 text-primary">
                  <FileText className="h-4 w-4" /> Summary
                </Label>
                <Textarea
                  value={momForm.summary}
                  onChange={(e) => handleMomFormChange(e, 'summary')}
                  placeholder="Enter meeting summary..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-primary">
                  <FileText className="h-4 w-4" /> Notes
                </Label>
                <Textarea
                  value={momForm.notes}
                  onChange={(e) => handleMomFormChange(e, 'notes')}
                  placeholder="Enter additional notes..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-primary">
                  <Users className="h-4 w-4" /> Created By
                </Label>
                <Input
                  value={momForm.createdBy}
                  onChange={(e) => handleMomFormChange(e, 'createdBy')}
                  placeholder="Recorder's name..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={handleSubmit}
                  disabled={momLoading}
                >
                  {momLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : isEditMode ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update MoM
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Submit MoM
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MeetingDetailsWithMOM2;