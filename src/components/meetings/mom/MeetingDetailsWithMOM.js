
"use client"

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import {
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Button,
} from '@/components/ui/button';
import {
  Label,
} from '@/components/ui/label';
import {
  Input,
} from '@/components/ui/input';
import {
  MessageSquare,
  Tag,
  UserIcon,
  Download,
  Edit2,
  Loader2,
  PlusCircle,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createMoM, fetchMoM, updateMoM } from '@/store/features/momSlice';

// Helper function to format time
const formatTimes = (dateTime) => {
  if (!dateTime) return '';
  try {
    return format(new Date(dateTime), 'p'); // e.g., "10:00 AM"
  } catch {
    return '';
  }
};

function MeetingDetailsWithMOM({ isOpen,id, onClose, meeting, TIME_ZONE }) {
  const dispatch = useDispatch();
   const contactId = id;
  const { mom, momLoading, momError } = useSelector((state) => state.mom);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Safely handle attendees based on its type
  const getAttendeesString = (attendees) => {
    if (Array.isArray(attendees)) {
      return attendees.join(', ');
    }
    return attendees ? String(attendees) : '';
  };

  // Compute duration as "startTime - endTime"
  const getDurationString = () => {
    const start = formatTimes(meeting?.start?.dateTime);
    const end = formatTimes(meeting?.end?.dateTime);
    return start && end ? `${start} - ${end}` : '';
  };

  const [momForm, setMomForm] = useState({
    agenda: meeting?.agenda || '',
    meetingMode: meeting?.meetingMode || 'Online',
    duration: getDurationString() || '',
    participants: getAttendeesString(meeting?.attendees) || '',
    summary: '',
    notes: '',
    createdBy: '',
    meetingId: meeting?.meetingId || '',
  });

  useEffect(() => {
    if (meeting?.meetingId && isOpen) {
      setIsInitialLoading(true);
      dispatch(fetchMoM(meeting.meetingId)).finally(() => {
        setIsInitialLoading(false);
      });
    }
  }, [meeting?.meetingId, isOpen, dispatch]);

  useEffect(() => {
    if (mom && mom.meetingId === meeting?.meetingId) {
      setMomForm({
        agenda: mom.agenda || meeting?.agenda || '',
        meetingMode: mom.meetingMode || meeting?.meetingMode || 'Online',
        duration: mom.duration || getDurationString() || '',
        participants: Array.isArray(mom.participants) ? mom.participants.join(', ') : getAttendeesString(mom.participants) || getAttendeesString(meeting?.attendees) || '',
        summary: mom.summary || '',
        notes: mom.notes || '',
        createdBy: mom.createdBy || '',
        meetingId: meeting?.meetingId || '',
      });
      setIsFormOpen(false);
      setIsEditMode(false);
    } else if (!mom && !momLoading && !isInitialLoading) {
      setMomForm({
        agenda: meeting?.agenda || '',
        meetingMode: meeting?.meetingMode || 'Online',
        duration: getDurationString() || '',
        participants: getAttendeesString(meeting?.attendees) || '',
        summary: '',
        notes: '',
        createdBy: '',
        meetingId: meeting?.meetingId || '',
      });
      setIsFormOpen(false);
      setIsEditMode(false);
    }
  }, [mom, momLoading, isInitialLoading, meeting]);

  const handleMomFormChange = (e, field) => {
    setMomForm({ ...momForm, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!momForm.createdBy.trim()) {
      toast({ title: 'Error', description: 'Please enter the name of the person who created the MoM.', variant: 'destructive' });
      return;
    }
    try {
      const momData = {
        ...momForm,
        participants: momForm.participants?.split(',').map((p) => p.trim()).filter(Boolean) || [],
        meetingId: meeting.meetingId,
      };
      if (mom && isEditMode) {
        await dispatch(updateMoM(momData)).unwrap();
        toast({ title: 'Success', description: 'MoM updated successfully!', variant: 'success' });
      } else {
        await dispatch(createMoM(momData)).unwrap();
        toast({ title: 'Success', description: 'MoM created successfully!', variant: 'success' });
      }
      setIsFormOpen(false);
      setIsEditMode(false);
    } catch (error) {
      toast({ title: 'Error', description: `Failed to ${mom && isEditMode ? 'update' : 'create'} MoM: ${error?.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  const handleDownloadMoM = () => {
    if (mom?.attachmentUrl) {
      window.open(mom.attachmentUrl, '_blank');
    } else {
      toast({ title: 'Error', description: 'No MoM attachment available', variant: 'destructive' });
    }
  };

  const handleEditMoM = () => {
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
        meetingMode: mom.meetingMode || meeting?.meetingMode || 'Online',
        duration: mom.duration || getDurationString() || '',
        participants: Array.isArray(mom.participants) ? mom.participants.join(', ') : getAttendeesString(mom.participants) || getAttendeesString(meeting?.attendees) || '',
        summary: mom.summary || '',
        notes: mom.notes || '',
        createdBy: mom.createdBy || '',
        meetingId: meeting?.meetingId || '',
      });
    } else {
      setMomForm({
        agenda: meeting?.agenda || '',
        meetingMode: meeting?.meetingMode || 'Online',
        duration: getDurationString() || '',
        participants: getAttendeesString(meeting?.attendees) || '',
        summary: '',
        notes: '',
        createdBy: '',
        meetingId: meeting?.meetingId || '',
      });
    }
  };

  if (isInitialLoading) {
    return (
      <div className="relative min-h-[400px] bg-gradient-to-b from-green-50 to-white rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
          <span className="mt-3 text-green-700 text-lg font-medium">Loading Meeting Details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px] bg-gradient-to-b from-green-50 to-white rounded-lg">
      {momLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
          <span className="ml-3 text-green-700 text-lg font-medium">Processing...</span>
        </div>
      )}
      <DialogHeader className="border-b border-green-100 pb-4 px-6 pt-6">
        <DialogTitle className="text-2xl text-green-800 font-semibold">
          {mom && !isFormOpen ? 'Meeting Details Preview' : isEditMode ? 'Edit Minutes of Meeting' : 'Create Minutes of Meeting'}
        </DialogTitle>
      </DialogHeader>

      {mom && !isFormOpen ? (
        <div className="space-y-6 p-6">
          <div className="p-6 bg-white shadow-lg rounded-lg border border-green-100 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-green-800">Minutes of Meeting</h4>
              <Button
                variant="outline"
                className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors duration-200"
                onClick={handleEditMoM}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit MoM
              </Button>
            </div>
            <div className="space-y-4 text-green-700">
              <p><strong className="font-medium">Agenda:</strong> {mom.agenda || meeting?.agenda || 'N/A'}</p>
              <p><strong className="font-medium">Meeting Mode:</strong> {mom.meetingMode || meeting?.meetingMode || 'N/A'}</p>
              <p><strong className="font-medium">Duration:</strong> {mom.duration || getDurationString() || 'N/A'}</p>
              <p><strong className="font-medium">Participants:</strong> {Array.isArray(mom.participants) ? mom.participants.join(', ') : getAttendeesString(mom.participants) || 'None'}</p>
              <p><strong className="font-medium">Summary:</strong> {mom.summary || 'N/A'}</p>
              <p><strong className="font-medium">Notes:</strong> {mom.notes || 'N/A'}</p>
              <p><strong className="font-medium">Created By:</strong> {mom.createdBy || 'N/A'}</p>
              <p><strong className="font-medium">Meeting Date:</strong> {mom.date || meeting?.date || 'N/A'}</p>
            </div>
            <Button
              variant="outline"
              className="mt-6 border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors duration-200"
              onClick={handleDownloadMoM}
            >
              <Download className="h-4 w-4 mr-2" />
              Download MoM
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-100 hover:text-green-800"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      ) : !mom && !isFormOpen ? (
        <div className="space-y-6 p-6">
          <div className="p-6 bg-white shadow-lg rounded-lg border border-green-100 transition-all duration-300">
            <h4 className="text-xl font-semibold text-green-800 mb-4">No Minutes of Meeting Found</h4>
            <p className="text-green-700">No MoM has been created for this meeting yet.</p>
            <Button
              className="mt-6 bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
              onClick={handleCreateMoM}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create MoM
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-100 hover:text-green-800"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-green-600 font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Agenda
              </Label>
              <Input
                value={momForm.agenda || ''}
                onChange={(e) => handleMomFormChange(e, 'agenda')}
                placeholder="Enter meeting agenda..."
                className="border-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-600 bg-white rounded-md shadow-sm"
                readOnly={true}
              />
            </div>
            <div>
              <Label className="text-green-600 font-medium flex items-center">
                <Tag className="h-4 w-4 mr-2" /> Meeting Mode
              </Label>
              <Input
                value={momForm.meetingMode || ''}
                onChange={(e) => handleMomFormChange(e, 'meetingMode')}
                placeholder="Online/In-person"
                className="border-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-600 bg-white rounded-md shadow-sm"
                readOnly={true}
              />
            </div>
            <div>
              <Label className="text-green-600 font-medium flex items-center">
                <Tag className="h-4 w-4 mr-2" /> Duration
              </Label>
              <Input
                value={momForm.duration || ''}
                onChange={(e) => handleMomFormChange(e, 'duration')}
                placeholder="Start time - End time"
                className="border-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-600 bg-white rounded-md shadow-sm"
                readOnly={true}
              />
            </div>
            <div>
              <Label className="text-green-600 font-medium flex items-center">
                <UserIcon className="h-4 w-4 mr-2" /> Participants
              </Label>
              <Input
                value={momForm.participants || ''}
                onChange={(e) => handleMomFormChange(e, 'participants')}
                placeholder="Comma-separated names..."
                className="border-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-600 bg-white rounded-md shadow-sm"
                readOnly={true}
              />
            </div>
            <div>
              <Label className="text-green-600 font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Summary
              </Label>
              <textarea
                value={momForm.summary || ''}
                onChange={(e) => handleMomFormChange(e, 'summary')}
                placeholder="Enter meeting summary..."
                className="w-full border-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-600 bg-white rounded-md p-3 shadow-sm resize-none"
                rows={4}
              />
            </div>
            <div>
              <Label className="text-green-600 font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Notes
              </Label>
              <textarea
                value={momForm.notes || ''}
                onChange={(e) => handleMomFormChange(e, 'notes')}
                placeholder="Enter additional notes..."
                className="w-full border-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-600 bg-white rounded-md p-3 shadow-sm resize-none"
                rows={4}
              />
            </div>
            <div>
              <Label className="text-green-600 font-medium flex items-center">
                <UserIcon className="h-4 w-4 mr-2" /> Created By
              </Label>
              <Input
                value={momForm.createdBy || ''}
                onChange={(e) => handleMomFormChange(e, 'createdBy')}
                placeholder="Recorder's name..."
                className="border-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-600 bg-white rounded-md shadow-sm"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors duration-200"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
              onClick={handleSubmit}
              disabled={momLoading}
            >
              {momLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : isEditMode ? (
                'Update MoM'
              ) : (
                'Submit MoM'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingDetailsWithMOM;