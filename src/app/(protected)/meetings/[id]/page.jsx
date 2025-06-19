// // app/meeting/[id]/page.js
// "use client";

// import { useParams } from "next/navigation";
// import MeetingDetails from "@/components/meetings2/MeetingDetails";

// export default function MeetingDetailsPage() {
//   const { id } = useParams(); // Extract meeting ID from URL
//   return <MeetingDetails meetingId={id} />;
// }




// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'next/navigation';
// import { fetchMeetingsByContactId,
   
//  } from '@/store/features/meetingSlice';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Calendar as CalendarIcon,
//   Eye,
//   FileText,
//   Edit,
//   Trash2,
//   MessageSquare,
//   Tag,
//   CheckCircle,
//   User,
//   Link,
// } from 'lucide-react';
// import { format, parseISO } from 'date-fns';

// const MeetingsPage = () => {
//   const dispatch = useDispatch();
//   const { id } = useParams(); // contactId from route
//   const contactId = id;
//   const { contactMeetings, contactMeetingsLoading, contactMeetingsError } = useSelector(
//     (state) => state.meetings
//   );

//   const [meetingsData, setMeetingsData] = useState([]);
//   const [isMeetingDetailsModalOpen, setIsMeetingDetailsModalOpen] = useState(false);
//   const [isCreateMomModalOpen, setIsCreateMomModalOpen] = useState(false);
//   const [isEditMeetingModalOpen, setIsEditMeetingModalOpen] = useState(false);
//   const [isCreateMeetingModalOpen, setIsCreateMeetingModalOpen] = useState(false);
//   const [isEditMomModalOpen, setIsEditMomModalOpen] = useState(false);
//   const [selectedMeeting, setSelectedMeeting] = useState(null);
//   const [selectedMom, setSelectedMom] = useState(null);

//   const [momForm, setMomForm] = useState({
//     id: '',
//     summary: '',
//     actionItems: [{ task: '', assignee: '', dueDate: '' }],
//     decisions: [''],
//     recordedBy: '',
//     recordedDate: new Date().toISOString().split('T')[0],
//   });
//   const [meetingForm, setMeetingForm] = useState({
//     id: '',
//     summary: '',
//     description: '',
//     startDateTime: new Date().toISOString().split('.')[0],
//     endDateTime: new Date(new Date().getTime() + 60 * 60 * 1000)
//       .toISOString()
//       .split('.')[0],
//     attendees: '',
//     hangoutLink: '',
//   });

//   useEffect(() => {
//     if (contactId) {
//       dispatch(fetchMeetingsByContactId(contactId));
//     }
//   }, [contactId, dispatch]);

//   useEffect(() => {
//     if (contactMeetings.length > 0) {
//       console.log('Fetched contactMeetings:', contactMeetings);
//       const mappedMeetings = contactMeetings.map((meeting) => ({
//         meetingId: meeting.id,
//         title: meeting.summary || 'Untitled',
//         date: meeting.start?.dateTime || new Date().toISOString(),
//         location: meeting.hangoutLink || 'N/A',
//         attendees: meeting.attendees
//           ?.map((attendee) => attendee.email)
//           .join(', ') || '',
//         agenda: meeting.description || '',
//         mom: meeting.mom || [],
//         start: meeting.start,
//         end: meeting.end,
//         hangoutLink: meeting.hangoutLink,
//         htmlLink: meeting.htmlLink,
//         conferenceData: meeting.conferenceData,
//       }));
//       setMeetingsData(mappedMeetings);
//     } else {
//       console.log('No meetings fetched or empty contactMeetings');
//       setMeetingsData([]);
//     }
//   }, [contactMeetings]);

//   const generateId = (prefix) => {
//     return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
//   };

//   const handleViewMeetingDetails = (meeting) => {
//     setSelectedMeeting(meeting);
//     setIsMeetingDetailsModalOpen(true);
//   };

//   const handleOpenCreateMom = (meeting) => {
//     setSelectedMeeting(meeting);
//     setMomForm({
//       id: generateId('MOM'),
//       summary: '',
//       actionItems: [{ task: '', assignee: '', dueDate: '' }],
//       decisions: [''],
//       recordedBy: '',
//       recordedDate: new Date().toISOString().split('T')[0],
//     });
//     setIsCreateMomModalOpen(true);
//   };

//   const handleOpenEditMeeting = (meeting) => {
//     setSelectedMeeting(meeting);
//     setMeetingForm({
//       id: meeting.meetingId,
//       summary: meeting.title || '',
//       description: meeting.agenda || '',
//       startDateTime: meeting.start?.dateTime
//         ? parseISO(meeting.start.dateTime).toISOString().split('.')[0]
//         : new Date().toISOString().split('.')[0],
//       endDateTime: meeting.end?.dateTime
//         ? parseISO(meeting.end.dateTime).toISOString().split('.')[0]
//         : new Date(new Date().getTime() + 60 * 60 * 1000)
//             .toISOString()
//             .split('.')[0],
//       attendees: meeting.attendees || '',
//       hangoutLink: meeting.hangoutLink || '',
//     });
//     setIsEditMeetingModalOpen(true);
//   };

//   const handleOpenCreateMeeting = () => {
//     setMeetingForm({
//       id: generateId('M'),
//       summary: '',
//       description: '',
//       startDateTime: new Date().toISOString().split('.')[0],
//       endDateTime: new Date(new Date().getTime() + 60 * 60 * 1000)
//         .toISOString()
//         .split('.')[0],
//       attendees: '',
//       hangoutLink: '',
//     });
//     setIsCreateMeetingModalOpen(true);
//   };

//   const handleOpenEditMom = (meeting, mom) => {
//     setSelectedMeeting(meeting);
//     setSelectedMom(mom);
//     setMomForm({
//       id: mom.id || '',
//       summary: mom.summary || '',
//       actionItems:
//         mom.actionItems?.map((item) => ({ ...item })) || [
//           { task: '', assignee: '', dueDate: '' },
//         ],
//       decisions: mom.decisions?.length ? [...mom.decisions] : [''],
//       recordedBy: mom.recordedBy || '',
//       recordedDate: mom.recordedDate || new Date().toISOString().split('T')[0],
//     });
//     setIsEditMomModalOpen(true);
//   };

//   const handleMomFormChange = (e, field, index = null) => {
//     if (field === 'actionItems') {
//       const updatedActionItems = [...momForm.actionItems];
//       updatedActionItems[index][e.target.name] = e.target.value;
//       setMomForm({ ...momForm, actionItems: updatedActionItems });
//     } else if (field === 'decisions') {
//       const updatedDecisions = [...momForm.decisions];
//       updatedDecisions[index] = e.target.value;
//       setMomForm({ ...momForm, decisions: updatedDecisions });
//     } else {
//       setMomForm({ ...momForm, [field]: e.target.value });
//     }
//   };

//   const handleMeetingFormChange = (e, field) => {
//     setMeetingForm({ ...meetingForm, [field]: e.target.value });
//   };

//   const addActionItem = () => {
//     setMomForm({
//       ...momForm,
//       actionItems: [...momForm.actionItems, { task: '', assignee: '', dueDate: '' }],
//     });
//   };

//   const addDecision = () => {
//     setMomForm({ ...momForm, decisions: [...momForm.decisions, ''] });
//   };

//   const handleMomSubmit = (isEdit = false) => {
//     const updatedMeetingsData = meetingsData.map((meeting) => {
//       if (meeting.meetingId === selectedMeeting.meetingId) {
//         if (isEdit) {
//           const updatedMom = meeting.mom.map((m) =>
//             m.id === momForm.id ? { ...momForm } : m
//           );
//           return { ...meeting, mom: updatedMom };
//         } else {
//           return { ...meeting, mom: [...meeting.mom, { ...momForm }] };
//         }
//       }
//       return meeting;
//     });

//     setMeetingsData(updatedMeetingsData);
//     setIsCreateMomModalOpen(false);
//     setIsEditMomModalOpen(false);
//     setMomForm({
//       id: '',
//       summary: '',
//       actionItems: [{ task: '', assignee: '', dueDate: '' }],
//       decisions: [''],
//       recordedBy: '',
//       recordedDate: new Date().toISOString().split('T')[0],
//     });
//   };

//   const handleMeetingSubmit = (isEdit = false) => {
//     const newMeeting = {
//       meetingId: meetingForm.id,
//       title: meetingForm.summary,
//       date: meetingForm.startDateTime,
//       location: meetingForm.hangoutLink,
//       attendees: meetingForm.attendees
//         .split(',')
//         .map((a) => a.trim())
//         .filter((a) => a),
//       agenda: meetingForm.description,
//       mom: [],
//       start: { dateTime: meetingForm.startDateTime, timeZone: 'Asia/Kolkata' },
//       end: { dateTime: meetingForm.endDateTime, timeZone: 'Asia/Kolkata' },
//       hangoutLink: meetingForm.hangoutLink,
//     };

//     let updatedMeetingsData;
//     if (isEdit) {
//       updatedMeetingsData = meetingsData.map((meeting) =>
//         meeting.meetingId === meetingForm.id ? newMeeting : meeting
//       );
//     } else {
//       updatedMeetingsData = [...meetingsData, newMeeting];
//     }

//     setMeetingsData(updatedMeetingsData);
//     setIsEditMeetingModalOpen(false);
//     setIsCreateMeetingModalOpen(false);
//     setMeetingForm({
//       id: '',
//       summary: '',
//       description: '',
//       startDateTime: new Date().toISOString().split('.')[0],
//       endDateTime: new Date(new Date().getTime() + 60 * 60 * 1000)
//         .toISOString()
//         .split('.')[0],
//       attendees: '',
//       hangoutLink: '',
//     });
//   };

//   const handleDeleteMeeting = (meetingId) => {
//     const updatedMeetingsData = meetingsData.filter(
//       (meeting) => meeting.meetingId !== meetingId
//     );
//     setMeetingsData(updatedMeetingsData);
//   };

//   if (contactMeetingsLoading) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center">
//         <p className="text-green-700 text-lg">Loading meetings...</p>
//       </div>
//     );
//   }

//   if (contactMeetingsError) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center">
//         <p className="text-red-500 text-lg">Error: {contactMeetingsError}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6">
//       <Card className="border-green-300 shadow-2xl rounded-2xl overflow-hidden">
//         <CardHeader>
//           <CardTitle className="text-3xl font-bold text-green-800 flex items-center justify-between">
//             <div className="flex items-center">
//               <CalendarIcon className="h-6 w-6 mr-2" />
//               Meetings for Contact ID: {id}
//             </div>
//             <Button
//               className="bg-green-600 text-white hover:bg-green-700"
//               onClick={handleOpenCreateMeeting}
//             >
//               Create Meeting
//             </Button>
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="overflow-x-auto rounded-lg border border-green-200">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-green-50 hover:bg-green-100">
//                   <TableHead className="text-green-800 font-semibold">Meeting ID</TableHead>
//                   <TableHead className="text-green-800 font-semibold">Title</TableHead>
//                   <TableHead className="text-green-800 font-semibold">Date</TableHead>
//                   <TableHead className="text-green-800 font-semibold">Meeting Link</TableHead>
//                   <TableHead className="text-green-800 font-semibold">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {meetingsData.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={5} className="text-center py-8">
//                       <div className="text-green-700 text-lg">
//                         No meetings found for this contact.
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   meetingsData.map((meeting) => (
//                     <TableRow key={meeting.meetingId} className="hover:bg-green-50">
//                       <TableCell>{meeting.meetingId || 'N/A'}</TableCell>
//                       <TableCell>{meeting.title || 'Untitled'}</TableCell>
//                       <TableCell>
//                         {meeting.start?.dateTime
//                           ? format(parseISO(meeting.start.dateTime), 'PPP HH:mm')
//                           : 'Invalid Date'}
//                       </TableCell>
//                       <TableCell>
//                         {meeting.hangoutLink ? (
//                           <a
//                             href={meeting.hangoutLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-green-600 hover:underline"
//                           >
//                             Join Meeting
//                           </a>
//                         ) : (
//                           'N/A'
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="border-green-500 text-green-700 hover:bg-green-100"
//                             onClick={() => handleViewMeetingDetails(meeting)}
//                             title="View Details"
//                           >
//                             <Eye className="h-4 w-4 mr-1" />
//                             View
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="border-green-500 text-green-700 hover:bg-green-100"
//                             onClick={() => handleOpenEditMeeting(meeting)}
//                             title="Edit Meeting"
//                           >
//                             <Edit className="h-4 w-4 mr-1" />
//                             Edit
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="border-green-500 text-green-700 hover:bg-green-100"
//                             onClick={() => handleDeleteMeeting(meeting.meetingId)}
//                             title="Delete Meeting"
//                           >
//                             <Trash2 className="h-4 w-4 mr-1" />
//                             Delete
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="border-green-500 text-green-700 hover:bg-green-100"
//                             onClick={() => handleOpenCreateMom(meeting)}
//                             disabled={meeting.mom?.length > 0}
//                             title="Create MoM"
//                           >
//                             <FileText className="h-4 w-4 mr-1" />
//                             Create MoM
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog
//         open={isMeetingDetailsModalOpen}
//         onOpenChange={() => setIsMeetingDetailsModalOpen(false)}
//       >
//         <DialogContent className="border-green-300 bg-green-50 max-w-2xl rounded-2xl shadow-xl">
//           <DialogHeader className="bg-green-100 p-4 rounded-t-2xl">
//             <DialogTitle className="text-green-800 text-2xl font-bold flex items-center">
//               <CalendarIcon className="h-6 w-6 mr-2" />
//               Meeting Details
//             </DialogTitle>
//           </DialogHeader>
//           {selectedMeeting ? (
//             <div className="space-y-4 text-green-900 p-6">
//               <div className="flex items-center">
//                 <Tag className="h-5 w-5 mr-2 text-green-600" />
//                 <p>
//                   <strong>Meeting ID:</strong> {selectedMeeting.meetingId || 'N/A'}
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
//                 <p>
//                   <strong>Title:</strong> {selectedMeeting.title || 'Untitled'}
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
//                 <p>
//                   <strong>Start:</strong>{' '}
//                   {selectedMeeting.start?.dateTime
//                     ? format(parseISO(selectedMeeting.start.dateTime), 'PPP HH:mm')
//                     : 'Invalid Date'}
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
//                 <p>
//                   <strong>End:</strong>{' '}
//                   {selectedMeeting.end?.dateTime
//                     ? format(parseISO(selectedMeeting.end.dateTime), 'PPP HH:mm')
//                     : 'Invalid Date'}
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <Link className="h-5 w-5 mr-2 text-green-600" />
//                 <p>
//                   <strong>Meeting Link:</strong>{' '}
//                   {selectedMeeting.hangoutLink ? (
//                     <a
//                       href={selectedMeeting.hangoutLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-green-600 hover:underline"
//                     >
//                       Join Meeting
//                     </a>
//                   ) : (
//                     'N/A'
//                   )}
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <User className="h-5 w-5 mr-2 text-green-600" />
//                 <p>
//                   <strong>Attendees:</strong> {selectedMeeting.attendees || 'None'}
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
//                 <p>
//                   <strong>Description:</strong> {selectedMeeting.agenda || 'N/A'}
//                 </p>
//               </div>
//               {selectedMeeting.mom?.length > 0 ? (
//                 selectedMeeting.mom.map((mom) => (
//                   <div key={mom.id} className="border-t border-green-200 pt-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <FileText className="h-5 w-5 mr-2 text-green-600" />
//                         <p>
//                           <strong>MoM Summary:</strong> {mom.summary || 'N/A'}
//                         </p>
//                       </div>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="border-green-500 text-green-700 hover:bg-green-100"
//                         onClick={() => handleOpenEditMom(selectedMeeting, mom)}
//                         title="Edit MoM"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <div>
//                       <div className="flex items-center mb-2">
//                         <Tag className="h-5 w-5 mr-2 text-green-600" />
//                         <p>
//                           <strong>Action Items:</strong>
//                         </p>
//                       </div>
//                       <ul className="list-disc pl-8">
//                         {mom.actionItems?.map((item, index) => (
//                           <li key={index}>
//                             {item.task || 'N/A'} (Assignee: {item.assignee || 'None'}, Due:{' '}
//                             {item.dueDate || 'N/A'})
//                           </li>
//                         )) || <li>No action items</li>}
//                       </ul>
//                     </div>
//                     <div>
//                       <div className="flex items-center mb-2">
//                         <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
//                         <p>
//                           <strong>Decisions:</strong>
//                         </p>
//                       </div>
//                       <ul className="list-disc pl-8">
//                         {mom.decisions?.map((decision, index) => (
//                           <li key={index}>{decision || 'N/A'}</li>
//                         )) || <li>No decisions</li>}
//                       </ul>
//                     </div>
//                     <div className="flex items-center">
//                       <User className="h-5 w-5 mr-2 text-green-600" />
//                       <p>
//                         <strong>Recorded By:</strong> {mom.recordedBy || 'N/A'}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       {mom.recordedDate && (
//                         <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
//                       )}
//                       <p>
//                         <strong>Recorded Date:</strong> {mom.recordedDate || 'N/A'}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-green-700">No MoM recorded for this meeting.</div>
//               )}
//             </div>
//           ) : (
//             <div className="text-green-700 text-lg p-6">No meeting selected.</div>
//           )}
//           <DialogFooter className="p-4">
//             <Button
//               variant="outline"
//               className="border-green-500 text-green-700 hover:bg-green-100"
//               onClick={() => setIsMeetingDetailsModalOpen(false)}
//             >
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={isCreateMomModalOpen}
//         onOpenChange={() => setIsCreateMomModalOpen(false)}
//       >
//         <DialogContent className="border-green-300 bg-green-50 max-w-2xl rounded-2xl shadow-xl">
//           <DialogHeader className="bg-green-100 p-4 rounded-t-2xl">
//             <DialogTitle className="text-green-800 text-2xl font-bold flex items-center">
//               <FileText className="h-6 w-6 mr-2" />
//               Create Minutes of Meeting
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 p-6">
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <MessageSquare className="h-5 w-5 mr-2" />
//                 Summary
//               </label>
//               <Textarea
//                 value={momForm.summary}
//                 onChange={(e) => handleMomFormChange(e, 'summary')}
//                 placeholder="Enter meeting summary..."
//                 className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <Tag className="h-5 w-5 mr-2" />
//                 Action Items
//               </label>
//               {momForm.actionItems.map((item, index) => (
//                 <div key={index} className="space-y-2 mt-2">
//                   <Input
//                     name="task"
//                     value={item.task}
//                     onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
//                     placeholder="Task description"
//                     className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//                   />
//                   <Input
//                     name="assignee"
//                     value={item.assignee}
//                     onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
//                     placeholder="Assignee"
//                     className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//                   />
//                   <Input
//                     name="dueDate"
//                     type="date"
//                     value={item.dueDate}
//                     onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
//                     className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//                   />
//                 </div>
//               ))}
//               <Button
//                 variant="outline"
//                 className="mt-2 border-green-500 text-green-700 hover:bg-green-700 hover:text-white"
//                 onClick={addActionItem}
//               >
//                 Add Action Item
//               </Button>
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <CheckCircle className="h-5 w-5 mr-2" />
//                 Decisions
//               </label>
//               {momForm.decisions.map((decision, index) => (
//                 <Input
//                   key={index}
//                   value={decision}
//                   onChange={(e) => handleMomFormChange(e, 'decisions', index)}
//                   placeholder="Decision description"
//                   className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//                 />
//               ))}
//               <Button
//                 variant="outline"
//                 className="mt-2 border-green-500 text-green-700 hover:bg-green-700 hover:text-white"
//                 onClick={addDecision}
//               >
//                 Add Decision
//               </Button>
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <User className="h-5 w-5 mr-2" />
//                 Recorded By
//               </label>
//               <Input
//                 value={momForm.recordedBy}
//                 onChange={(e) => handleMomFormChange(e, 'recordedBy')}
//                 placeholder="Recorder's name..."
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <CalendarIcon className="h-5 w-5 mr-2" />
//                 Recorded Date
//               </label>
//               <Input
//                 type="date"
//                 value={momForm.recordedDate}
//                 onChange={(e) => handleMomFormChange(e, 'recordedDate')}
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <Button
//               className="bg-green-600 text-white hover:bg-green-700 w-full rounded-lg"
//               onClick={() => handleMomSubmit(false)}
//             >
//               Submit MoM
//             </Button>
//           </div>
//           <DialogFooter className="p-4">
//             <Button
//               variant="outline"
//               className="border-green-500 text-green-700 hover:bg-green-700 hover:text-white"
//               onClick={() => setIsCreateMomModalOpen(false)}
//             >
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={isEditMomModalOpen}
//         onOpenChange={() => setIsEditMomModalOpen(false)}
//       >
//         <DialogContent className="border-green-300 bg-green-50 max-w-2xl rounded-2xl shadow-xl">
//           <DialogHeader className="bg-green-100 p-4 rounded-t-2xl">
//             <DialogTitle className="text-green-800 text-2xl font-bold flex items-center">
//               <FileText className="h-6 w-6 mr-2" />
//               Edit Minutes of Meeting
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 p-6">
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <MessageSquare className="h-5 w-5 mr-2" />
//                 Summary
//               </label>
//               <Textarea
//                 value={momForm.summary}
//                 onChange={(e) => handleMomFormChange(e, 'summary')}
//                 placeholder="Enter meeting summary..."
//                 className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <Tag className="h-5 w-5 mr-2" />
//                 Action Items
//               </label>
//               {momForm.actionItems.map((item, index) => (
//                 <div key={index} className="space-y-2 mt-2">
//                   <Input
//                     name="task"
//                     value={item.task}
//                     onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
//                     placeholder="Task description"
//                     className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//                   />
//                   <Input
//                     name="assignee"
//                     value={item.assignee}
//                     onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
//                     placeholder="Assignee"
//                     className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//                   />
//                   <Input
//                     name="dueDate"
//                     type="date"
//                     value={item.dueDate}
//                     onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
//                     className="border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//                   />
//                 </div>
//               ))}
//               <Button
//                 variant="outline"
//                 className="mt-2 border-green-500 text-green-700 hover:bg-green-700 hover:text-white"
//                 onClick={addActionItem}
//               >
//                 Add Action Item
//               </Button>
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <CheckCircle className="h-5 w-5 mr-2" />
//                 Decisions
//               </label>
//               {momForm.decisions.map((decision, index) => (
//                 <Input
//                   key={index}
//                   value={decision}
//                   onChange={(e) => handleMomFormChange(e, 'decisions', index)}
//                   placeholder="Decision description"
//                   className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//                 />
//               ))}
//               <Button
//                 variant="outline"
//                 className="mt-2 border-green-500 text-green-700 hover:bg-green-700 hover:text-white"
//                 onClick={addDecision}
//               >
//                 Add Decision
//               </Button>
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <User className="h-5 w-5 mr-2" />
//                 Recorded By
//               </label>
//               <Input
//                 value={momForm.recordedBy}
//                 onChange={(e) => handleMomFormChange(e, 'recordedBy')}
//                 placeholder="Recorder's name..."
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <CalendarIcon className="h-5 w-5 mr-2" />
//                 Recorded Date
//               </label>
//               <Input
//                 type="date"
//                 value={momForm.recordedDate}
//                 onChange={(e) => handleMomFormChange(e, 'recordedDate')}
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <Button
//               className="bg-green-600 text-white hover:bg-green-700 w-full rounded-lg"
//               onClick={() => handleMomSubmit(true)}
//             >
//               Update MoM
//             </Button>
//           </div>
//           <DialogFooter className="p-4">
//             <Button
//               variant="outline"
//               className="border-green-500 text-green-700 hover:bg-green-700 hover:text-white"
//               onClick={() => setIsEditMomModalOpen(false)}
//             >
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={isEditMeetingModalOpen}
//         onOpenChange={() => setIsEditMeetingModalOpen(false)}
//       >
//         <DialogContent className="border-green-300 bg-green-50 max-w-2xl rounded-2xl shadow-xl">
//           <DialogHeader className="bg-green-100 p-4 rounded-t-2xl">
//             <DialogTitle className="text-green-800 text-2xl font-bold flex items-center">
//               <CalendarIcon className="h-6 w-6 mr-2" />
//               Edit Meeting
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 p-6">
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <MessageSquare className="h-5 w-5 mr-2" />
//                 Title
//               </label>
//               <Input
//                 value={meetingForm.summary}
//                 onChange={(e) => handleMeetingFormChange(e, 'summary')}
//                 placeholder="Meeting title..."
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <CalendarIcon className="h-5 w-5 mr-2" />
//                 Start Date & Time
//               </label>
//               <Input
//                 type="datetime-local"
//                 value={meetingForm.startDateTime}
//                 onChange={(e) => handleMeetingFormChange(e, 'startDateTime')}
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <CalendarIcon className="h-5 w-5 mr-2" />
//                 End Date & Time
//               </label>
//               <Input
//                 type="datetime-local"
//                 value={meetingForm.endDateTime}
//                 onChange={(e) => handleMeetingFormChange(e, 'endDateTime')}
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <Link className="h-5 w-5 mr-2" />
//                 Meeting Link
//               </label>
//               <Input
//                 value={meetingForm.hangoutLink}
//                 onChange={(e) => handleMeetingFormChange(e, 'hangoutLink')}
//                 placeholder="Meeting link..."
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <User className="h-5 w-5 mr-2" />
//                 Attendees
//               </label>
//               <Input
//                 value={meetingForm.attendees}
//                 onChange={(e) => handleMeetingFormChange(e, 'attendees')}
//                 placeholder="Comma-separated attendees..."
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <MessageSquare className="h-5 w-5 mr-2" />
//                 Description
//               </label>
//               <Textarea
//                 value={meetingForm.description}
//                 onChange={(e) => handleMeetingFormChange(e, 'description')}
//                 placeholder="Meeting description..."
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <Button
//               className="bg-green-600 text-white hover:bg-green-700 w-full rounded-lg"
//               onClick={() => handleMeetingSubmit(true)}
//             >
//               Update Meeting
//             </Button>
//           </div>
//           <DialogFooter className="p-4">
//             <Button
//               variant="outline"
//               className="border-green-500 text-green-700 hover:bg-green-700 hover:text-white"
//               onClick={() => setIsEditMeetingModalOpen(false)}
//             >
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={isCreateMeetingModalOpen}
//         onOpenChange={() => setIsCreateMeetingModalOpen(false)}
//       >
//         <DialogContent className="border-green-300 bg-green-50 max-w-2xl rounded-2xl shadow-xl">
//           <DialogHeader className="bg-green-100 p-4 rounded-t-2xl">
//             <DialogTitle className="text-green-800 text-2xl font-bold flex items-center">
//               <CalendarIcon className="h-6 w-6 mr-2" />
//               Create Meeting
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 p-6">
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <MessageSquare className="h-5 w-5 mr-2" />
//                 Title
//               </label>
//               <Input
//                 value={meetingForm.summary}
//                 onChange={(e) => handleMeetingFormChange(e, 'summary')}
//                 placeholder="Meeting title..."
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <CalendarIcon className="h-5 w-5 mr-2" />
//                 Start Date & Time
//               </label>
//               <Input
//                 type="datetime-local"
//                 value={meetingForm.startDateTime}
//                 onChange={(e) => handleMeetingFormChange(e, 'startDateTime')}
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <CalendarIcon className="h-5 w-5 mr-2" />
//                 End Date & Time
//               </label>
//               <Input
//                 type="datetime-local"
//                 value={meetingForm.endDateTime}
//                 onChange={(e) => handleMeetingFormChange(e, 'endDateTime')}
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <Link className="h-5 w-5 mr-2" />
//                 Meeting Link
//               </label>
//               <Input
//                 value={meetingForm.hangoutLink}
//                 onChange={(e) => handleMeetingFormChange(e, 'hangoutLink')}
//                 placeholder="Meeting link..."
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <User className="h-5 w-5 mr-2" />
//                 Attendees
//               </label>
//               <Input
//                 value={meetingForm.attendees}
//                 onChange={(e) => handleMeetingFormChange(e, 'attendees')}
//                 placeholder="Comma-separated attendees..."
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="text-green-800 font-semibold flex items-center">
//                 <MessageSquare className="h-5 w-5 mr-2" />
//                 Description
//               </label>
//               <Textarea
//                 value={meetingForm.description}
//                 onChange={(e) => handleMeetingFormChange(e, 'description')}
//                 placeholder="Meeting description..."
//                 className="mt-2 border-green-500 focus:ring-green-500 text-green-900 rounded-lg"
//               />
//             </div>
//             <Button
//               className="bg-green-600 text-white hover:bg-green-700 w-full rounded-lg"
//               onClick={() => handleMeetingSubmit(false)}
//             >
//               Create Meeting
//             </Button>
//           </div>
//           <DialogFooter className="p-4">
//             <Button
//               variant="outline"
//               className="border-green-500 text-green-700 hover:bg-green-700 hover:text-white"
//               onClick={() => setIsCreateMeetingModalOpen(false)}
//             >
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default MeetingsPage;








'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import {
  fetchMeetingsByContactId,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  clearError,
} from '@/store/features/meetingSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  FileText,
  MessageSquare,
  Tag,
  CheckCircle,
  User as UserIcon,
  Link,
} from 'lucide-react';
import Loader from '@/components/ui/loader';

// Utility functions
const toDateTimeLocal = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toISOWithOffset = (dateTimeLocal) => {
  if (!dateTimeLocal) return '';
  const date = new Date(dateTimeLocal);
  return date.toISOString().replace('Z', '+05:30');
};

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const getInitials = (email) => {
  if (!email) return '?';
  const namePart = email.split('@')[0];
  const parts = namePart.split(/[.\-_]/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Meeting Form Component
function MeetingForm({ meeting = {}, onSave, onCancel, isEditing = false, loading = false }) {
  console.log('MeetingForm', meeting);
  const [formData, setFormData] = useState({
    eventId: meeting.meetingId || '',
    email: meeting.email || 'it_chinmaya@outlook.com',
    summary: meeting.title || 'New Meeting',
    description: meeting.agenda || '',
    startTime: meeting.start ? toDateTimeLocal(meeting.start.dateTime) : '',
    endTime: meeting.end ? toDateTimeLocal(meeting.end.dateTime) : '',
    attendees: meeting.attendees || '',
   
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      email: formData.email,
      summary: formData.summary,
      description: formData.description,
      startTime: toISOWithOffset(formData.startTime),
      endTime: toISOWithOffset(formData.endTime),
      attendees: formData.attendees
        .split(',')
        .map((email) => ({ email: email.trim() }))
        .filter((attendee) => attendee.email),
   
      eventId: formData.eventId,
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
            {loading ? 'Saving...' : isEditing ? 'Update Meeting' : 'Create Meeting'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Meeting Details Component
function MeetingDetails({ meeting, onClose }) {
  return (
    <div className="bg-green-50 p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-green-800">{meeting.title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-3 text-green-700">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">{formatDate(meeting.date)}</span>
        </div>
        <div className="flex items-center space-x-3 text-green-700">
          <Clock className="h-5 w-5" />
          <span className="font-medium">
            {formatTime(meeting.start?.dateTime)} - {formatTime(meeting.end?.dateTime)}
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
            {meeting.attendees?.length > 0 ? (
              meeting.attendees.split(', ').map((email, idx) => (
                <div key={idx} className="relative group">
                  <div className="w-8 h-8 rounded-full bg-green-200 text-green-800 font-semibold flex items-center justify-center cursor-default select-none">
                    {getInitials(email)}
                  </div>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-green-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none transition-opacity duration-300 z-10">
                    {email}
                  </span>
                </div>
              ))
            ) : (
              <span className="font-medium">None</span>
            )}
          </div>
        </div>
      </div>
      {meeting.hangoutLink && (
        <div className="flex items-center space-x-4 p-4 bg-white border border-green-200 rounded-lg">
          <div className="w-10 h-10 rounded bg-green-200 flex items-center justify-center">
            <Link className="h-6 w-6 text-green-800" />
          </div>
          <div className="flex flex-col">
            <span className="text-green-800 font-semibold">Join Google Meet</span>
            <a
              href={meeting.hangoutLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline"
            >
              {meeting.hangoutLink}
            </a>
          </div>
        </div>
      )}
      {meeting.agenda && (
        <div className="p-4 bg-white border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Description</h4>
          <p className="text-green-700 whitespace-pre-wrap">{meeting.agenda}</p>
        </div>
      )}
    </div>
  );
}

// MeetingsPage Component
const MeetingsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const contactId = id;
  const {
    contactMeetings,
    contactMeetingsLoading,
    contactMeetingsError,
    createLoading,
    updateLoading,
    deleteLoading,
    error,
  } = useSelector((state) => state.meetings);

  const [meetingsData, setMeetingsData] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [modals, setModals] = useState({
    isCreateOpen: false,
    isEditOpen: false,
    isViewOpen: false,
    isCreateMomOpen: false,
    isEditMomOpen: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [dateFilter, setDateFilter] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [momForm, setMomForm] = useState({
    id: '',
    summary: '',
    actionItems: [{ task: '', assignee: '', dueDate: '' }],
    decisions: [''],
    recordedBy: '',
    recordedDate: new Date().toISOString().split('T')[0],
  });
  const [selectedMom, setSelectedMom] = useState(null);

  useEffect(() => {
    if (contactId) {
      dispatch(fetchMeetingsByContactId(contactId));
    }
  }, [contactId, dispatch]);

  useEffect(() => {
    if (contactMeetings.length > 0) {
      const mappedMeetings = contactMeetings.map((meeting) => ({
        meetingId: meeting.id,
        title: meeting.summary || 'Untitled',
        date: meeting.start?.dateTime || new Date().toISOString(),
        location: meeting.hangoutLink || 'N/A',
        attendees: meeting.attendees
          ?.map((attendee) => attendee.email)
          .join(', ') || '',
        agenda: meeting.description || '',
        mom: meeting.mom || [],
        start: meeting.start,
        end: meeting.end,
        hangoutLink: meeting.hangoutLink,
        htmlLink: meeting.htmlLink,
        conferenceData: meeting.conferenceData,
      }));
      setMeetingsData(mappedMeetings);
    } else {
      setMeetingsData([]);
    }
  }, [contactMeetings]);

  const generateId = (prefix) => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleCreate = async (newMeeting) => {
    try {
      await dispatch(createMeeting(newMeeting)).unwrap();
      setModals({ ...modals, isCreateOpen: false });
    } catch (err) {
      console.error('Error creating meeting:', err);
    }
  };

  const handleEdit = async (updatedMeeting) => {
    console.log('Updating meeting:', updatedMeeting);
    try {
      await dispatch(updateMeeting({ meetingData: updatedMeeting })).unwrap();
      setModals({ ...modals, isEditOpen: false });
      setSelectedMeeting(null);
    } catch (err) {
      console.error('Error updating meeting:', err);
    }
  };

  const handleDelete = async (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await dispatch(
          deleteMeeting({ id: meetingId, email: 'it_chinmaya@outlook.com' })
        ).unwrap();
      } catch (err) {
        console.error('Error deleting meeting:', err);
      }
    }
  };

  const handleView = (meeting) => {
    setSelectedMeeting(meeting);
    setModals({ ...modals, isViewOpen: true });
  };

  const handleOpenCreateMom = (meeting) => {
    setSelectedMeeting(meeting);
    setMomForm({
      id: generateId('MOM'),
      summary: '',
      actionItems: [{ task: '', assignee: '', dueDate: '' }],
      decisions: [''],
      recordedBy: '',
      recordedDate: new Date().toISOString().split('T')[0],
    });
    setModals({ ...modals, isCreateMomOpen: true });
  };

  const handleOpenEditMom = (meeting, mom) => {
    setSelectedMeeting(meeting);
    setSelectedMom(mom);
    setMomForm({
      id: mom.id || '',
      summary: mom.summary || '',
      actionItems:
        mom.actionItems?.map((item) => ({ ...item })) || [
          { task: '', assignee: '', dueDate: '' },
        ],
      decisions: mom.decisions?.length ? [...mom.decisions] : [''],
      recordedBy: mom.recordedBy || '',
      recordedDate: mom.recordedDate || new Date().toISOString().split('T')[0],
    });
    setModals({ ...modals, isEditMomOpen: true });
  };

  const handleMomFormChange = (e, field, index = null) => {
    if (field === 'actionItems') {
      const updatedActionItems = [...momForm.actionItems];
      updatedActionItems[index][e.target.name] = e.target.value;
      setMomForm({ ...momForm, actionItems: updatedActionItems });
    } else if (field === 'decisions') {
      const updatedDecisions = [...momForm.decisions];
      updatedDecisions[index] = e.target.value;
      setMomForm({ ...momForm, decisions: updatedDecisions });
    } else {
      setMomForm({ ...momForm, [field]: e.target.value });
    }
  };

  const addActionItem = () => {
    setMomForm({
      ...momForm,
      actionItems: [...momForm.actionItems, { task: '', assignee: '', dueDate: '' }],
    });
  };

  const addDecision = () => {
    setMomForm({ ...momForm, decisions: [...momForm.decisions, ''] });
  };

  const handleMomSubmit = (isEdit = false) => {
    const updatedMeetingsData = meetingsData.map((meeting) => {
      if (meeting.meetingId === selectedMeeting.meetingId) {
        if (isEdit) {
          const updatedMom = meeting.mom.map((m) =>
            m.id === momForm.id ? { ...momForm } : m
          );
          return { ...meeting, mom: updatedMom };
        } else {
          return { ...meeting, mom: [...meeting.mom, { ...momForm }] };
        }
      }
      return meeting;
    });

    setMeetingsData(updatedMeetingsData);
    setModals({ ...modals, isCreateMomOpen: false, isEditMomOpen: false });
    setMomForm({
      id: '',
      summary: '',
      actionItems: [{ task: '', assignee: '', dueDate: '' }],
      decisions: [''],
      recordedBy: '',
      recordedDate: new Date().toISOString().split('T')[0],
    });
    setSelectedMom(null);
  };

  const handleCloseModals = () => {
    setModals({
      isCreateOpen: false,
      isEditOpen: false,
      isViewOpen: false,
      isCreateMomOpen: false,
      isEditMomOpen: false,
    });
    setSelectedMeeting(null);
    dispatch(clearError());
  };

  const filteredMeetings = meetingsData
    .filter((meeting) => {
      const matchesSearch = meeting.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const meetingDate = meeting.date
        ? new Date(meeting.date).toISOString().split('T')[0]
        : '';
      const matchesDate =
        !dateFilter || meetingDate === dateFilter.split('T')[0];
      const matchesDateRange =
        !dateRangeStart ||
        !dateRangeEnd ||
        (new Date(meetingDate) >= new Date(dateRangeStart) &&
          new Date(meetingDate) <= new Date(dateRangeEnd));
      return matchesSearch && matchesDate && matchesDateRange;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // if (contactMeetingsLoading) {
  //   return (
  //     <div className="min-h-screen p-6 flex items-center justify-center">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen p-6">
      <Card className="mx-auto border-green-200 shadow-lg">
        <CardHeader className="border-b border-green-200">
          <CardTitle className="flex justify-between items-center text-green-800">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6" />
              <span className="text-2xl font-bold">Meetings for Contact ID: {id}</span>
            </div>
            <Button
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={() => setModals({ ...modals, isCreateOpen: true })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Meeting
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
              <Button
                variant="outline"
                onClick={() => dispatch(clearError())}
                className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                Clear Error
              </Button>
            </Alert>
          )}
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
                  <Label htmlFor="dateRangeStart" className="text-green-800 font-medium">
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
                  <Label htmlFor="dateRangeEnd" className="text-green-800 font-medium">
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

          <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50">
                  <TableHead className="text-green-800 font-semibold">Title</TableHead>
                  <TableHead className="text-green-800 font-semibold">Date</TableHead>
                  <TableHead className="text-green-800 font-semibold">Time</TableHead>
                  <TableHead className="text-green-800 font-semibold">Link</TableHead>
                  <TableHead className="text-green-800 font-semibold">Attendees</TableHead>
                  <TableHead className="text-green-800 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-green-700">No meetings found.</div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.meetingId} className="hover:bg-green-50">
                      <TableCell className="font-medium text-green-800">
                        {meeting.title}
                      </TableCell>
                      <TableCell className="text-green-700">
                        {formatDate(meeting.date)}
                      </TableCell>
                      <TableCell className="text-green-700">
                        {formatTime(meeting.start?.dateTime)} -{' '}
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
                          'Online'
                        )}
                      </TableCell>
                      <TableCell className="text-green-700">
                        {meeting.attendees ? `${meeting.attendees.split(', ').length} attendees` : 'None'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(meeting)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-100"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedMeeting(meeting);
                              setModals({ ...modals, isEditOpen: true });
                            }}
                            className="text-green-600 hover:text-green-800 hover:bg-green-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(meeting.meetingId)}
                            disabled={deleteLoading}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenCreateMom(meeting)}
                            disabled={meeting.mom?.length > 0}
                            className="text-green-600 hover:text-green-800 hover:bg-green-100"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog
            open={modals.isCreateOpen}
            onOpenChange={(open) => setModals({ ...modals, isCreateOpen: open })}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-green-800">Create New Meeting</DialogTitle>
              </DialogHeader>
              <MeetingForm
                onSave={handleCreate}
                onCancel={handleCloseModals}
                loading={createLoading}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            open={modals.isEditOpen}
            onOpenChange={(open) => setModals({ ...modals, isEditOpen: open })}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-green-800">Edit Meeting</DialogTitle>
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

          <Dialog
            open={modals.isViewOpen}
            onOpenChange={(open) => setModals({ ...modals, isViewOpen: open })}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-green-800">Meeting Details</DialogTitle>
              </DialogHeader>
              {selectedMeeting && (
                <>
                  <MeetingDetails meeting={selectedMeeting} onClose={handleCloseModals} />
                  {selectedMeeting.mom?.length > 0 && (
                    <div className="mt-6 p-4 bg-white border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Minutes of Meeting</h4>
                      {selectedMeeting.mom.map((mom) => (
                        <div key={mom.id} className="mb-4">
                          <div className="flex items-center justify-between">
                            <p className="text-green-700">
                              <strong>Summary:</strong> {mom.summary || 'N/A'}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditMom(selectedMeeting, mom)}
                              className="text-green-600 hover:text-green-800 hover:bg-green-100"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-green-700">
                            <strong>Action Items:</strong>
                          </p>
                          <ul className="list-disc pl-5 text-green-700">
                            {mom.actionItems?.map((item, index) => (
                              <li key={index}>
                                {item.task || 'N/A'} (Assignee: {item.assignee || 'None'}, Due:{' '}
                                {item.dueDate || 'N/A'})
                              </li>
                            )) || <li>No action items</li>}
                          </ul>
                          <p className="text-green-700">
                            <strong>Decisions:</strong>
                          </p>
                          <ul className="list-disc pl-5 text-green-700">
                            {mom.decisions?.map((decision, index) => (
                              <li key={index}>{decision || 'N/A'}</li>
                            )) || <li>No decisions</li>}
                          </ul>
                          <p className="text-green-700">
                            <strong>Recorded By:</strong> {mom.recordedBy || 'N/A'}
                          </p>
                          <p className="text-green-700">
                            <strong>Recorded Date:</strong> {mom.recordedDate || 'N/A'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={modals.isCreateMomOpen}
            onOpenChange={(open) => setModals({ ...modals, isCreateMomOpen: open })}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-green-800">Create Minutes of Meeting</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 p-6">
                <div>
                  <Label className="text-green-800 font-medium flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Summary
                  </Label>
                  <textarea
                    value={momForm.summary}
                    onChange={(e) => handleMomFormChange(e, 'summary')}
                    placeholder="Enter meeting summary..."
                    className="w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md p-2"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-green-800 font-medium flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Action Items
                  </Label>
                  {momForm.actionItems.map((item, index) => (
                    <div key={index} className="space-y-2 mt-2">
                      <Input
                        name="task"
                        value={item.task}
                        onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
                        placeholder="Task description"
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                      />
                      <Input
                        name="assignee"
                        value={item.assignee}
                        onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
                        placeholder="Assignee"
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                      />
                      <Input
                        name="dueDate"
                        type="date"
                        value={item.dueDate}
                        onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="mt-2 border-green-300 text-green-700 hover:bg-green-50"
                    onClick={addActionItem}
                  >
                    Add Action Item
                  </Button>
                </div>
                <div>
                  <Label className="text-green-800 font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Decisions
                  </Label>
                  {momForm.decisions.map((decision, index) => (
                    <Input
                      key={index}
                      value={decision}
                      onChange={(e) => handleMomFormChange(e, 'decisions', index)}
                      placeholder="Decision description"
                      className="mt-2 border-green-300 focus:border-green-500 focus:ring-green-500"
                    />
                  ))}
                  <Button
                    variant="outline"
                    className="mt-2 border-green-300 text-green-700 hover:bg-green-50"
                    onClick={addDecision}
                  >
                    Add Decision
                  </Button>
                </div>
                <div>
                  <Label className="text-green-800 font-medium flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Recorded By
                  </Label>
                  <Input
                    value={momForm.recordedBy}
                    onChange={(e) => handleMomFormChange(e, 'recordedBy')}
                    placeholder="Recorder's name..."
                    className="mt-2 border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <Label className="text-green-800 font-medium flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Recorded Date
                  </Label>
                  <Input
                    type="date"
                    value={momForm.recordedDate}
                    onChange={(e) => handleMomFormChange(e, 'recordedDate')}
                    className="mt-2 border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                    onClick={() => setModals({ ...modals, isCreateMomOpen: false })}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-700 hover:bg-green-800 text-white"
                    onClick={() => handleMomSubmit(false)}
                  >
                    Submit MoM
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={modals.isEditMomOpen}
            onOpenChange={(open) => setModals({ ...modals, isEditMomOpen: open })}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-green-800">Edit Minutes of Meeting</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 p-6">
                <div>
                  <Label className="text-green-800 font-medium flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Summary
                  </Label>
                  <textarea
                    value={momForm.summary}
                    onChange={(e) => handleMomFormChange(e, 'summary')}
                    placeholder="Enter meeting summary..."
                    className="w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md p-2"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-green-800 font-medium flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Action Items
                  </Label>
                  {momForm.actionItems.map((item, index) => (
                    <div key={index} className="space-y-2 mt-2">
                      <Input
                        name="task"
                        value={item.task}
                        onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
                        placeholder="Task description"
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                      />
                      <Input
                        name="assignee"
                        value={item.assignee}
                        onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
                        placeholder="Assignee"
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                      />
                      <Input
                        name="dueDate"
                        type="date"
                        value={item.dueDate}
                        onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="mt-2 border-green-300 text-green-700 hover:bg-green-50"
                    onClick={addActionItem}
                  >
                    Add Action Item
                  </Button>
                </div>
                <div>
                  <Label className="text-green-800 font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Decisions
                  </Label>
                  {momForm.decisions.map((decision, index) => (
                    <Input
                      key={index}
                      value={decision}
                      onChange={(e) => handleMomFormChange(e, 'decisions', index)}
                      placeholder="Decision description"
                      className="mt-2 border-green-300 focus:border-green-500 focus:ring-green-500"
                    />
                  ))}
                  <Button
                    variant="outline"
                    className="mt-2 border-green-300 text-green-700 hover:bg-green-50"
                    onClick={addDecision}
                  >
                    Add Decision
                  </Button>
                </div>
                <div>
                  <Label className="text-green-800 font-medium flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Recorded By
                  </Label>
                  <Input
                    value={momForm.recordedBy}
                    onChange={(e) => handleMomFormChange(e, 'recordedBy')}
                    placeholder="Recorder's name..."
                    className="mt-2 border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <Label className="text-green-800 font-medium flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Recorded Date
                  </Label>
                  <Input
                    type="date"
                    value={momForm.recordedDate}
                    onChange={(e) => handleMomFormChange(e, 'recordedDate')}
                    className="mt-2 border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                    onClick={() => setModals({ ...modals, isEditMomOpen: false })}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-700 hover:bg-green-800 text-white"
                    onClick={() => handleMomSubmit(true)}
                  >
                    Update MoM
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingsPage;