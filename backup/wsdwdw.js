
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock } from 'lucide-react';

// Helper functions
const toISOWithOffset = (dateTimeLocal) => {
  if (!dateTimeLocal) return '';
  const date = new Date(dateTimeLocal);
  return date.toISOString();
};

const toDateTimeLocal = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
  return localISOTime;
};

// Time slots available for booking
const timeSlots = [
  { value: '09:00', label: '9:00 AM' },
  { value: '09:30', label: '9:30 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '10:30', label: '10:30 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '12:30', label: '12:30 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '13:30', label: '1:30 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '14:30', label: '2:30 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '15:30', label: '3:30 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '16:30', label: '4:30 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '17:30', label: '5:30 PM' },
];

// Duration options
const durationOptions = [
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
];

function MeetingForm({ meeting = {}, onSave, onCancel, isEditing = false, loading = false }) {
  const [selectedDate, setSelectedDate] = useState(
    meeting.start ? new Date(meeting.start.dateTime) : new Date()
  );
  const [formData, setFormData] = useState({
    eventId: meeting.meetingId || '',
    email: meeting.email || 'it_chinmaya@outlook.com',
    summary: meeting.title || 'New Meeting',
    description: meeting.agenda || '',
    attendees: meeting.attendees ? meeting.attendees.map((a) => a.email).join(', ') : '',
    startTime: meeting.start ? new Date(meeting.start.dateTime).toTimeString().slice(0, 5) : '',
    duration: meeting.duration || '60',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeSlotChange = (timeSlot) => {
    setFormData({ ...formData, startTime: timeSlot });
  };

  const handleDurationChange = (duration) => {
    setFormData({ ...formData, duration });
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return '';
    const [hours, minutes] = time.split(':');
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return dateTime.toISOString().slice(0, 16);
  };

  const calculateEndTime = (startDateTime, durationMinutes) => {
    if (!startDateTime || !durationMinutes) return '';
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + parseInt(durationMinutes) * 60000);
    return endDate.toISOString().slice(0, 16);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDateTime = formatDateTime(selectedDate, formData.startTime);
    const endDateTime = calculateEndTime(startDateTime, formData.duration);

    onSave({
      email: formData.email,
      summary: formData.summary,
      description: formData.description,
      startTime: toISOWithOffset(startDateTime),
      endTime: toISOWithOffset(endDateTime),
      attendees: formData.attendees
        .split(',')
        .map((email) => ({ email: email.trim() }))
        .filter((attendee) => attendee.email),
      eventId: formData.eventId,
    });
  };

  const formatSelectedDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar and Time Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-green-800 font-medium mb-2 block">
                Select Date
              </Label>
              <Card className="border-green-200">
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                    className="rounded-md"
                    classNames={{
                      months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                      month: 'space-y-4',
                      caption: 'flex justify-center pt-1 relative items-center text-green-800',
                      caption_label: 'text-sm font-medium',
                      nav: 'space-x-1 flex items-center',
                      nav_button:
                        'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-green-100 rounded-md',
                      table: 'w-full border-collapse space-y-1',
                      head_row: 'flex',
                      head_cell: 'text-green-600 rounded-md w-9 font-normal text-[0.8rem]',
                      row: 'flex w-full mt-2',
                      cell:
                        'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-green-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                      day:
                        'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-green-100 rounded-md',
                      day_selected:
                        'bg-green-600 text-white hover:bg-green-700 focus:bg-green-600 focus:text-white',
                      day_today: 'bg-green-50 text-green-900 font-medium',
                      day_outside: 'text-gray-400 opacity-50',
                      day_disabled: 'text-gray-400 opacity-50 cursor-not-allowed',
                    }}
                  />
                </CardContent>
              </Card>
              {selectedDate && (
                <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
                  <p className="text-green-800 text-sm">
                    Selected: {formatSelectedDate(selectedDate)}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label className="text-green-800 font-medium mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Select Time Slot
              </Label>
              <Select onValueChange={handleTimeSlotChange} value={formData.startTime}>
                <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-green-800 font-medium mb-2 block">
                Meeting Duration
              </Label>
              <Select onValueChange={handleDurationChange} value={formData.duration}>
                <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Form Fields */}
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
                placeholder="Add meeting agenda or description..."
              />
            </div>
          </div>
        </div>

        {/* Meeting Summary */}
        {selectedDate && formData.startTime && (
          <div className="p-4 bg-green-100 rounded-md border border-green-200">
            <h4 className="text-green-800 font-medium mb-2">Meeting Summary:</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Date:</strong> {formatSelectedDate(selectedDate)}</p>
              <p>
                <strong>Time:</strong>{' '}
                {timeSlots.find((slot) => slot.value === formData.startTime)?.label}
              </p>
              <p>
                <strong>Duration:</strong>{' '}
                {durationOptions.find((opt) => opt.value === formData.duration)?.label}
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
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
            disabled={loading || !selectedDate || !formData.startTime}
            className="bg-green-700 hover:bg-green-800 text-white"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Meeting' : 'Create Meeting'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MeetingForm;


