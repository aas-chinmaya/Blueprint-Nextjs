
// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import Loader from "@/components/ui/loader";
// import {
//   fetchMeetings,
//   setSelectedMeeting,
//   clearSelectedMeeting,
// } from "@/store/features/meetingSlice";
// import {
//   fetchMoM,
//   createMoM,
//   updateMoM,
//   deleteMoM,
// } from "@/store/features/momSlice";
// import {
//   ArrowLeft,
//   Calendar,
//   Clock,
//   Users,
//   Video,
//   Link,
//   FileText,
//   Download,
// } from "lucide-react";

// const MoMForm = ({ meetingId, onClose, existingMoM }) => {
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({
//     creationTime: new Date().toISOString(),
//     date: new Date().toISOString().split('T')[0],
//     agenda: "",
//     meetingMode: "",
//     duration: "",
//     participants: "",
//     meetingSummary: "",
//     notes: "",
//   });

//   useEffect(() => {
//     if (existingMoM) {
//       setFormData(existingMoM);
//     }
//   }, [existingMoM]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSelectChange = (name) => (value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (existingMoM) {
//       dispatch(updateMoM({ meetingId, momData: formData }));
//     } else {
//       dispatch(createMoM({ meetingId, momData: formData }));
//     }
//     onClose();
//   };

//   return (
//     <Dialog open={true} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px] bg-green-50 border-green-200">
//         <DialogHeader>
//           <DialogTitle className="text-green-800">
//             {existingMoM ? "Edit Meeting Minutes" : "Create Meeting Minutes"}
//           </DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-green-700">Date</label>
//             <Input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Agenda</label>
//             <Textarea
//               name="agenda"
//               value={formData.agenda}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Meeting Mode</label>
//             <Select
//               name="meetingMode"
//               value={formData.meetingMode}
//               onValueChange={handleSelectChange("meetingMode")}
//               required
//             >
//               <SelectTrigger className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500">
//                 <SelectValue placeholder="Select Mode" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Online">Online</SelectItem>
//                 <SelectItem value="In-person">In-person</SelectItem>
//                 <SelectItem value="Hybrid">Hybrid</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Duration</label>
//             <Input
//               type="text"
//               name="duration"
//               value={formData.duration}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               placeholder="e.g., 1 hour"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Participants</label>
//             <Textarea
//               name="participants"
//               value={formData.participants}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               placeholder="Enter participant emails, separated by commas"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Meeting Summary</label>
//             <Textarea
//               name="meetingSummary"
//               value={formData.meetingSummary}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Notes/Attachments</label>
//             <Textarea
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//             />
//           </div>
//           <div className="flex justify-end space-x-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               className="border-green-300 text-green-700 hover:bg-green-100"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="bg-green-600 hover:bg-green-700 text-white"
//             >
//               {existingMoM ? "Update" : "Create"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default function MeetingDetails({ meetingId }) {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const email = "it_chinmaya@outlook.com";
//   const [showMoMForm, setShowMoMForm] = useState(false);
//   const [editingMoM, setEditingMoM] = useState(null);

//   const { meetings = [], selectedMeeting = null, loading = false } = useSelector(
//     (state) => state.meetings || {}
//   );
//   const { mom = null, momLoading = false } = useSelector(
//     (state) => state.mom || {}
//   );

//   useEffect(() => {
//     dispatch(fetchMoM(meetingId));
//     const meeting = meetings.find((m) => m.id === meetingId);
//     if (meeting) {
//       dispatch(setSelectedMeeting(meeting));
//     } else {
//       dispatch(fetchMeetings(email)).then(() => {
//         const fetchedMeeting = meetings.find((m) => m.id === meetingId);
//         if (fetchedMeeting) {
//           dispatch(setSelectedMeeting(fetchedMeeting));
//         } else {
//           router.push("/meetings");
//         }
//       });
//     }

//     return () => {
//       dispatch(clearSelectedMeeting());
//     };
//   }, [dispatch, meetingId, email]);

//   const isMeetingCompleted = selectedMeeting?.end?.dateTime
//     ? new Date(selectedMeeting.end.dateTime) < new Date()
//     : false;

//   const handleDeleteMoM = () => {
//     if (confirm("Are you sure you want to delete this MoM?")) {
//       dispatch(deleteMoM(meetingId));
//     }
//   };

//   const handleDownloadMoM = async () => {
//     try {
//       const response = await fetch(`/api/mom/${meetingId}/pdf`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(mom),
//       });
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `MoM_${meetingId}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading MoM PDF:', error);
//       alert('Failed to download MoM PDF');
//     }
//   };

//   // Filter related meetings (e.g., same attendees or within a week)
//   const relatedMeetings = meetings.filter(
//     (m) =>
//       m.id !== meetingId &&
//       (m.attendees?.some((a) =>
//         selectedMeeting?.attendees?.some((sa) => sa.email === a.email)
//       ) ||
//         Math.abs(
//           new Date(m.start.dateTime) - new Date(selectedMeeting?.start.dateTime)
//         ) < 7 * 24 * 60 * 60 * 1000)
//   ).slice(0, 5); // Limit to 5 related meetings

//   if (loading || momLoading || !selectedMeeting) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-green-50">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <TooltipProvider>
//       <div className="min-h-screen w-full bg-green-50 flex flex-col md:flex-row gap-6 p-4 sm:p-6 lg:p-8">
//         <div className="flex-1 space-y-6">
         
//           <Card className="bg-white border-green-200 shadow-md hover:shadow-lg transition-shadow">
//             <div className="flex ml-4 ">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="back"
//                   onClick={() => router.push("/meetings")}
//                   className="mr-10 text-green-600 hover:text-green-800 hover:bg-green-100"
//                 >
//                   <ArrowLeft className="w-5 h-5 mr-2" />
//                   Back to Meetings
//                 </Button>
//               </TooltipTrigger>
             
//             </Tooltip>
//           </div>
//             <CardHeader>
//               <CardTitle className="text-2xl sm:text-3xl text-green-800 flex items-center">
//                 <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-500" />
//                 {selectedMeeting.summary || "Untitled Meeting"}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <p className="text-green-700 flex flex-col sm:flex-row sm:items-start">
//                   <span className="font-semibold mr-2">Description:</span>
//                   {selectedMeeting.description || "No description provided"}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-green-700 flex items-center">
//                   <Clock className="w-5 h-5 mr-2 text-green-500" />
//                   <span className="font-semibold mr-2">Start:</span>
//                   {new Date(selectedMeeting.start.dateTime).toLocaleString("en-US", {
//                     dateStyle: "medium",
//                     timeStyle: "short",
//                     timeZone: selectedMeeting.start.timeZone,
//                   })}
//                 </p>
//                 <p className="text-green-700 flex items-center mt-2">
//                   <Clock className="w-5 h-5 mr-2 text-green-500" />
//                   <span className="font-semibold mr-2">End:</span>
//                   {new Date(selectedMeeting.end.dateTime).toLocaleString("en-US", {
//                     dateStyle: "medium",
//                     timeStyle: "short",
//                     timeZone: selectedMeeting.end.timeZone,
//                   })}
//                 </p>
//                 <p className="text-green-700 flex items-center mt-2">
//                   <Clock className="w-5 h-5 mr-2 text-green-500" />
//                   <span className="font-semibold mr-2">Time Zone:</span>
//                   {selectedMeeting.start.timeZone}
//                 </p>
//               </div>
//               {selectedMeeting.attendees && selectedMeeting.attendees.length > 0 && (
//                 <div>
//                   <p className="text-green-700 flex items-center">
//                     <Users className="w-5 h-5 mr-2 text-green-500" />
//                     <span className="font-semibold mr-2">Attendees:</span>
//                   </p>
//                   <ul className="list-disc pl-8 mt-2 text-green-700">
//                     {selectedMeeting.attendees.map((attendee, index) => (
//                       <li key={index}>{attendee.email}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {selectedMeeting.conferenceData && (
//                 <div>
//                   <p className="text-green-700 flex items-center">
//                     <Video className="w-5 h-5 mr-2 text-green-500" />
//                     <span className="font-semibold mr-2">Conference:</span>
//                     {selectedMeeting.conferenceData.conferenceSolution?.name ||
//                       "No conference details"}
//                   </p>
//                   {selectedMeeting.conferenceData.entryPoints?.map((entry, index) => (
//                     <p key={index} className="text-green-700 mt-2 flex items-center">
//                       <Link className="w-5 h-5 mr-2 text-green-500" />
//                       <span className="font-semibold mr-2">{entry.entryPointType}:</span>
//                       <a
//                         href={entry.uri}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-green-600 hover:underline"
//                       >
//                         {entry.label}
//                       </a>
//                     </p>
//                   ))}
//                 </div>
//               )}
//               {selectedMeeting.htmlLink && (
//                 <div>
//                   <p className="text-green-700 flex items-center">
//                     <Link className="w-5 h-5 mr-2 text-green-500" />
//                     <span className="font-semibold mr-2">Calendar Link:</span>
//                     <a
//                       href={selectedMeeting.htmlLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-green-600 hover:underline"
//                     >
//                       View in Google Calendar
//                     </a>
//                   </p>
//                 </div>
//               )}
//               {selectedMeeting.hangoutLink && (
//                 <div>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <a
//                         href={selectedMeeting.hangoutLink}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
//                       >
//                         <Video className="w-5 h-5 mr-2" />
//                         Join Meeting
//                       </a>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Join the meeting via link</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//           {relatedMeetings.length > 0 && (
//             <Card className="bg-white border-green-200 shadow-md hover:shadow-lg transition-shadow mt-6">
//               <CardHeader>
//                 <CardTitle className="text-xl text-green-800">Related Meetings</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ScrollArea className="h-[200px]">
//                   <div className="space-y-4">
//                     {relatedMeetings.map((meeting) => (
//                       <div
//                         key={meeting.id}
//                         className="border-b border-green-200 pb-2 cursor-pointer hover:bg-green-50 p-2 rounded"
//                         onClick={() => router.push(`/meetings/${meeting.id}`)}
//                       >
//                         <p className="text-green-700 font-semibold">{meeting.summary}</p>
//                         <p className="text-green-600 text-sm">
//                           {new Date(meeting.start.dateTime).toLocaleString("en-US", {
//                             dateStyle: "medium",
//                             timeStyle: "short",
//                           })}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//         <div className="w-full md:w-80 p-4 md:p-6">
//           <Card className="bg-white border-green-200 shadow-md hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <CardTitle className="text-xl text-green-800">Meeting Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     onClick={() => setShowMoMForm(true)}
//                     disabled={isMeetingCompleted}
//                     className={`w-full flex items-center justify-center ${
//                       isMeetingCompleted
//                         ? "bg-green-600 hover:bg-green-700"
//                         : "bg-green-200 text-green-600 cursor-not-allowed"
//                     }`}
//                   >
//                     <FileText className="w-5 h-5 mr-2" />
//                     {mom ? "Edit MoM" : "Create MoM"}
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>{isMeetingCompleted ? "Create or edit meeting minutes" : "Available after meeting completion"}</p>
//                 </TooltipContent>
//               </Tooltip>
//               {mom && (
//                 <>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         onClick={handleDownloadMoM}
//                         className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700"
//                       >
//                         <Download className="w-5 h-5 mr-2" />
//                         Download MoM PDF
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Download meeting minutes as PDF</p>
//                     </TooltipContent>
//                   </Tooltip>
//                   <div className="space-y-2">
//                     <h4 className="text-lg font-semibold text-green-800">Meeting Minutes</h4>
//                     <p className="text-green-700"><strong>Date:</strong> {mom.date}</p>
//                     <p className="text-green-700"><strong>Agenda:</strong> {mom.agenda}</p>
//                     <p className="text-green-700"><strong>Mode:</strong> {mom.meetingMode}</p>
//                     <p className="text-green-700"><strong>Duration:</strong> {mom.duration}</p>
//                     <p className="text-green-700"><strong>Participants:</strong> {mom.participants}</p>
//                     <p className="text-green-700"><strong>Summary:</strong> {mom.meetingSummary}</p>
//                     <p className="text-green-700"><strong>Notes:</strong> {mom.notes || "None"}</p>
//                     <div className="flex space-x-2">
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             onClick={() => setEditingMoM(mom)}
//                             className="bg-green-600 hover:bg-green-700 text-white"
//                           >
//                             Edit
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Edit meeting minutes</p>
//                         </TooltipContent>
//                       </Tooltip>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             onClick={handleDeleteMoM}
//                             variant="destructive"
//                             className="bg-red-600 hover:bg-red-700"
//                           >
//                             Delete
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Delete meeting minutes</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//         {(showMoMForm || editingMoM) && (
//           <MoMForm
//             meetingId={meetingId}
//             onClose={() => {
//               setShowMoMForm(false);
//               setEditingMoM(null);
//             }}
//             existingMoM={editingMoM}
//           />
//         )}
//       </div>
//     </TooltipProvider>
//   );
// }




// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
// import Loader from "@/components/ui/loader";
// import {
//   fetchMeetings,
//   setSelectedMeeting,
//   clearSelectedMeeting,
// } from "@/store/features/meetingSlice";
// import {
//   fetchMoM,
//   createMoM,
//   updateMoM,
//   deleteMoM,
// } from "@/store/features/momSlice";
// import {
//   ArrowLeft,
//   Calendar,
//   Clock,
//   Users,
//   Video,
//   Link,
//   FileText,
//   Download,
// } from "lucide-react";

// const MoMForm = ({ meetingId, onClose, existingMoM }) => {
//   const dispatch = useDispatch();
//   const email = "it_chinmaya@outlook.com"; // Assuming createdBy is the user's email
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split("T")[0],
//     time: new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5),
//     agenda: "",
//     meetingMode: "",
//     duration: "",
//     participants: "",
//     summary: "",
//     notes: "",
//     createdBy: email,
//     signature: null,
//   });

//   useEffect(() => {
//     if (existingMoM) {
//       setFormData({
//         date: existingMoM.date,
//         time: existingMoM.time || new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5),
//         agenda: existingMoM.agenda,
//         meetingMode: existingMoM.meetingMode,
//         duration: existingMoM.duration,
//         participants: existingMoM.participants?.join(",") || "",
//         summary: existingMoM.summary || existingMoM.meetingSummary || "",
//         notes: existingMoM.notes || "",
//         createdBy: existingMoM.createdBy || email,
//         signature: existingMoM.signature || null,
//       });
//     }
//   }, [existingMoM, email]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value,
//     });
//   };

//   const handleSelectChange = (name) => (value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const momData = {
//       meetingId,
//       date: formData.date,
//       time: formData.time,
//       agenda: formData.agenda,
//       meetingMode: formData.meetingMode,
//       duration: formData.duration,
//       participants: formData.participants,
//       summary: formData.summary,
//       notes: formData.notes,
//       createdBy: formData.createdBy,
//       signature: formData.signature,
//     };

//     if (existingMoM) {
//       dispatch(updateMoM({ meetingId, momData }));
//     } else {
//       dispatch(createMoM({ meetingId, momData }));
//     }
//     onClose();
//   };

//   return (
//     <Dialog open={true} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px] bg-green-50 border-green-200">
//         <DialogHeader>
//           <DialogTitle className="text-green-800">
//             {existingMoM ? "Edit Meeting Minutes" : "Create Meeting Minutes"}
//           </DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-green-700">Date</label>
//             <Input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Time</label>
//             <Input
//               type="time"
//               name="time"
//               value={formData.time}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Agenda</label>
//             <Textarea
//               name="agenda"
//               value={formData.agenda}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Meeting Mode</label>
//             <Select
//               name="meetingMode"
//               value={formData.meetingMode}
//               onValueChange={handleSelectChange("meetingMode")}
//               required
//             >
//               <SelectTrigger className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500">
//                 <SelectValue placeholder="Select Mode" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Online">Online</SelectItem>
//                 <SelectItem value="In-person">In-person</SelectItem>
//                 <SelectItem value="Hybrid">Hybrid</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Duration</label>
//             <Input
//               type="text"
//               name="duration"
//               value={formData.duration}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               placeholder="e.g., 1 hour"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Participants</label>
//             <Textarea
//               name="participants"
//               value={formData.participants}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               placeholder="Enter participant emails, separated by commas"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Meeting Summary</label>
//             <Textarea
//               name="summary"
//               value={formData.summary}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Notes</label>
//             <Textarea
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-green-700">Signature (Optional)</label>
//             <Input
//               type="file"
//               name="signature"
//               accept="image/*"
//               onChange={handleChange}
//               className="mt-1 border-green-300 focus:ring-green-500 focus:border-green-500"
//             />
//           </div>
//           <div className="flex justify-end space-x-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               className="border-green-300 text-green-700 hover:bg-green-100"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="bg-green-600 hover:bg-green-700 text-white"
//             >
//               {existingMoM ? "Update" : "Create"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default function MeetingDetails({ meetingId }) {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const email = "it_chinmaya@outlook.com";
//   const [showMoMForm, setShowMoMForm] = useState(false);
//   const [editingMoM, setEditingMoM] = useState(null);

//   const { meetings = [], selectedMeeting = null, loading = false } = useSelector(
//     (state) => state.meetings || {}
//   );
//   const { mom = null, momLoading = false } = useSelector(
//     (state) => state.mom || {}
//   );

//   useEffect(() => {
//     dispatch(fetchMoM(meetingId));
//     const meeting = meetings.find((m) => m.id === meetingId);
//     if (meeting) {
//       dispatch(setSelectedMeeting(meeting));
//     } else {
//       dispatch(fetchMeetings(email)).then(() => {
//         const fetchedMeeting = meetings.find((m) => m.id === meetingId);
//         if (fetchedMeeting) {
//           dispatch(setSelectedMeeting(fetchedMeeting));
//         } else {
//           router.push("/meetings");
//         }
//       });
//     }

//     return () => {
//       dispatch(clearSelectedMeeting());
//     };
//   }, [dispatch, meetingId, email]);

//   const handleDeleteMoM = () => {
//     if (confirm("Are you sure you want to delete this MoM?")) {
//       dispatch(deleteMoM(meetingId));
//     }
//   };

//   const handleDownloadMoM = async () => {
//     try {
//       const response = await fetch(`/api/mom/${meetingId}/pdf`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(mom),
//       });
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `MoM_${meetingId}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error downloading MoM PDF:", error);
//       alert("Failed to download MoM PDF");
//     }
//   };

//   const relatedMeetings = meetings
//     .filter(
//       (m) =>
//         m.id !== meetingId &&
//         (m.attendees?.some((a) =>
//           selectedMeeting?.attendees?.some((sa) => sa.email === a.email)
//         ) ||
//           Math.abs(
//             new Date(m.start.dateTime) - new Date(selectedMeeting?.start.dateTime)
//           ) < 7 * 24 * 60 * 60 * 1000)
//     )
//     .slice(0, 5);

//   if (loading || momLoading || !selectedMeeting) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-green-50">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <TooltipProvider>
//       <div className="min-h-screen w-full bg-green-50 flex flex-col md:flex-row gap-6 p-4 sm:p-6 lg:p-8">
//         <div className="flex-1 space-y-6">
//           <Card className="bg-white border-green-200 shadow-md hover:shadow-lg transition-shadow">
//             <div className="flex ml-4">
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="back"
//                     onClick={() => router.push("/meetings")}
//                     className="mr-10 text-green-600 hover:text-green-800 hover:bg-green-100"
//                   >
//                     <ArrowLeft className="w-5 h-5 mr-2" />
//                     Back to Meetings
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Return to meetings list</p>
//                 </TooltipContent>
//               </Tooltip>
//             </div>
//             <CardHeader>
//               <CardTitle className="text-2xl sm:text-3xl text-green-800 flex items-center">
//                 <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-500" />
//                 {selectedMeeting.summary || "Untitled Meeting"}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <p className="text-green-700 flex flex-col sm:flex-row sm:items-start">
//                   <span className="font-semibold mr-2">Description:</span>
//                   {selectedMeeting.description || "No description provided"}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-green-700 flex items-center">
//                   <Clock className="w-5 h-5 mr-2 text-green-500" />
//                   <span className="font-semibold mr-2">Start:</span>
//                   {new Date(selectedMeeting.start.dateTime).toLocaleString("en-US", {
//                     dateStyle: "medium",
//                     timeStyle: "short",
//                     timeZone: selectedMeeting.start.timeZone,
//                   })}
//                 </p>
//                 <p className="text-green-700 flex items-center mt-2">
//                   <Clock className="w-5 h-5 mr-2 text-green-500" />
//                   <span className="font-semibold mr-2">End:</span>
//                   {new Date(selectedMeeting.end.dateTime).toLocaleString("en-US", {
//                     dateStyle: "medium",
//                     timeStyle: "short",
//                     timeZone: selectedMeeting.end.timeZone,
//                   })}
//                 </p>
//                 <p className="text-green-700 flex items-center mt-2">
//                   <Clock className="w-5 h-5 mr-2 text-green-500" />
//                   <span className="font-semibold mr-2">Time Zone:</span>
//                   {selectedMeeting.start.timeZone}
//                 </p>
//               </div>
//               {selectedMeeting.attendees && selectedMeeting.attendees.length > 0 && (
//                 <div>
//                   <p className="text-green-700 flex items-center">
//                     <Users className="w-5 h-5 mr-2 text-green-500" />
//                     <span className="font-semibold mr-2">Attendees:</span>
//                   </p>
//                   <ul className="list-disc pl-8 mt-2 text-green-700">
//                     {selectedMeeting.attendees.map((attendee, index) => (
//                       <li key={index}>{attendee.email}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {selectedMeeting.conferenceData && (
//                 <div>
//                   <p className="text-green-700 flex items-center">
//                     <Video className="w-5 h-5 mr-2 text-green-500" />
//                     <span className="font-semibold mr-2">Conference:</span>
//                     {selectedMeeting.conferenceData.conferenceSolution?.name ||
//                       "No conference details"}
//                   </p>
//                   {selectedMeeting.conferenceData.entryPoints?.map((entry, index) => (
//                     <p key={index} className="text-green-700 mt-2 flex items-center">
//                       <Link className="w-5 h-5 mr-2 text-green-500" />
//                       <span className="font-semibold mr-2">{entry.entryPointType}:</span>
//                       <a
//                         href={entry.uri}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-green-600 hover:underline"
//                       >
//                         {entry.label}
//                       </a>
//                     </p>
//                   ))}
//                 </div>
//               )}
//               {selectedMeeting.htmlLink && (
//                 <div>
//                   <p className="text-green-700 flex items-center">
//                     <Link className="w-5 h-5 mr-2 text-green-500" />
//                     <span className="font-semibold mr-2">Calendar Link:</span>
//                     <a
//                       href={selectedMeeting.htmlLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-green-600 hover:underline"
//                     >
//                       View in Google Calendar
//                     </a>
//                   </p>
//                 </div>
//               )}
//               {selectedMeeting.hangoutLink && (
//                 <div>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <a
//                         href={selectedMeeting.hangoutLink}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
//                       >
//                         <Video className="w-5 h-5 mr-2" />
//                         Join Meeting
//                       </a>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Join the meeting via link</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//           {relatedMeetings.length > 0 && (
//             <Card className="bg-white border-green-200 shadow-md hover:shadow-lg transition-shadow mt-6">
//               <CardHeader>
//                 <CardTitle className="text-xl text-green-800">Related Meetings</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ScrollArea className="h-[200px]">
//                   <div className="space-y-4">
//                     {relatedMeetings.map((meeting) => (
//                       <div
//                         key={meeting.id}
//                         className="border-b border-green-200 pb-2 cursor-pointer hover:bg-green-50 p-2 rounded"
//                         onClick={() => router.push(`/meetings/${meeting.id}`)}
//                       >
//                         <p className="text-green-700 font-semibold">{meeting.summary}</p>
//                         <p className="text-green-600 text-sm">
//                           {new Date(meeting.start.dateTime).toLocaleString("en-US", {
//                             dateStyle: "medium",
//                             timeStyle: "short",
//                           })}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//         <div className="w-full md:w-80 p-4 md:p-6">
//           <Card className="bg-white border-green-200 shadow-md hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <CardTitle className="text-xl text-green-800">Meeting Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     onClick={() => setShowMoMForm(true)}
//                     className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white"
//                   >
//                     <FileText className="w-5 h-5 mr-2" />
//                     {mom ? "Edit MoM" : "Create MoM"}
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Create or edit meeting minutes</p>
//                 </TooltipContent>
//               </Tooltip>
//               {mom && (
//                 <>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         onClick={handleDownloadMoM}
//                         className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700"
//                       >
//                         <Download className="w-5 h-5 mr-2" />
//                         Download MoM PDF
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Download meeting minutes as PDF</p>
//                     </TooltipContent>
//                   </Tooltip>
//                   <div className="space-y-2">
//                     <h4 className="text-lg font-semibold text-green-800">Meeting Minutes</h4>
//                     <p className="text-green-700"><strong>Date:</strong> {mom.date}</p>
//                     <p className="text-green-700"><strong>Time:</strong> {mom.time}</p>
//                     <p className="text-green-700"><strong>Agenda:</strong> {mom.agenda}</p>
//                     <p className="text-green-700"><strong>Mode:</strong> {mom.meetingMode}</p>
//                     <p className="text-green-700"><strong>Duration:</strong> {mom.duration}</p>
//                     <p className="text-green-700"><strong>Participants:</strong> {mom.participants}</p>
//                     <p className="text-green-700"><strong>Summary:</strong> {mom.summary}</p>
//                     <p className="text-green-700"><strong>Notes:</strong> {mom.notes || "None"}</p>
//                     <p className="text-green-700"><strong>Created By:</strong> {mom.createdBy}</p>
//                     {mom.signature && (
//                       <p className="text-green-700"><strong>Signature:</strong> <a href={mom.signature} target="_blank" rel="noopener noreferrer">View Signature</a></p>
//                     )}
//                     {mom.attachment && (
//                       <p className="text-green-700"><strong>Attachment:</strong> <a href={mom.attachment} target="_blank" rel="noopener noreferrer">View PDF</a></p>
//                     )}
//                     <div className="flex space-x-2">
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             onClick={() => setEditingMoM(mom)}
//                             className="bg-green-600 hover:bg-green-700 text-white"
//                           >
//                             Edit
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Edit meeting minutes</p>
//                         </TooltipContent>
//                       </Tooltip>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             onClick={handleDeleteMoM}
//                             variant="destructive"
//                             className="bg-red-600 hover:bg-red-700"
//                           >
//                             Delete
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Delete meeting minutes</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//         {(showMoMForm || editingMoM) && (
//           <MoMForm
//             meetingId={meetingId}
//             onClose={() => {
//               setShowMoMForm(false);
//               setEditingMoM(null);
//             }}
//             existingMoM={editingMoM}
//           />
//         )}
//       </div>
//     </TooltipProvider>
//   );
// }













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
  }, [dispatch, meetingId, email]);

  const handleDeleteMoM = () => {
    if (confirm("Are you sure you want to delete this MoM?")) {
      dispatch(deleteMoM(meetingId));
    }
  };

  const handleDownloadMoM = async () => {
    try {
      const response = await fetch(`/api/mom/${meetingId}/pdf`, {
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
              <img
                src={selectedMeeting.conferenceData.conferenceSolution.iconUri}
                alt="Google Meet"
                className="w-10 h-10 rounded"
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




