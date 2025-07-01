




// "use client";

// import { useEffect, useState, useRef } from "react";
// import { format, isAfter, addHours } from "date-fns";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchMoMByMeetingId,
//   resetMoMByMeetingId,
//   createMoM,
//   updateMoM,
//   fetchMoMView,
// } from "@/store/features/momSlice";
// import { submitCause } from "@/store/features/causeSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Loader2,
//   Download,
//   Edit2,
//   PlusCircle,
//   AlertCircle,
//   Calendar,
//   Users,
//   Clock,
//   FileText,
//   Signature,
//   User,
// } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";

// // Component: MeetingDetailsWithMOM
// function MeetingDetailsWithMOM({ isOpen, onClose, meeting, TIME_ZONE }) {
//   const dispatch = useDispatch();
//   const { momByMeetingId, momByMeetingIdLoading, momByMeetingIdError, momView, momViewLoading, momViewError } = useSelector(
//     (state) => state.mom
//   );
//   const [mode, setMode] = useState("view"); // Toggle state: 'create', 'edit', 'view'
//   const [isTimeExceeded, setIsTimeExceeded] = useState(false);
//   const [reasonForDelay, setReasonForDelay] = useState("");
//   const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);
//   const [signatureFile, setSignatureFile] = useState(null);
//   const [signaturePreview, setSignaturePreview] = useState(null);
//   const containerRef = useRef(null);

//   // Form state for creating/editing MoM
//   const [momForm, setMomForm] = useState({
//     agenda: meeting?.agenda || "",
//     meetingMode: meeting?.meetingMode || "Online",
//     duration: "",
//     participants: "",
//     summary: "",
//     notes: "",
//     createdBy: "",
//     meetingId: meeting?.meetingId || "",
//   });

//   // Helper: Format time (e.g., "10:00 AM")
//   const formatTimes = (dateTime) => {
//     if (!dateTime) return "";
//     try {
//       return format(new Date(dateTime), "p");
//     } catch {
//       return "";
//     }
//   };

//   // Helper: Compute duration as "startTime - endTime"
//   const getDurationString = () => {
//     const start = formatTimes(meeting?.start?.dateTime);
//     const end = formatTimes(meeting?.end?.dateTime);
//     return start && end ? `${start} - ${end}` : "";
//   };

//   // Helper: Format attendees into a string
//   const getAttendeesString = (attendees) => {
//     if (Array.isArray(attendees)) {
//       return attendees.join(", ");
//     }
//     return attendees ? String(attendees) : "";
//   };

//   // Helper: Check if meeting has ended and 1-hour window has passed
//   const checkMeetingTimeStatus = () => {
//     if (!meeting?.end?.dateTime) return false;
//     const endTime = new Date(meeting.end.dateTime);
//     const now = new Date();
//     const oneHourAfterEnd = addHours(endTime, 1);
//     return isAfter(now, oneHourAfterEnd);
//   };

//   // Effect: Initialize form and check time status
//   useEffect(() => {
//     const timeExceeded = checkMeetingTimeStatus();
//     setIsTimeExceeded(timeExceeded);

//     if (momByMeetingId && momByMeetingId.meetingId === meeting?.meetingId) {
//       setMomForm({
//         agenda: momByMeetingId.agenda || meeting?.agenda || "",
//         meetingMode: momByMeetingId.meetingMode || meeting?.meetingMode || "Online",
//         duration: momByMeetingId.duration || getDurationString() || "",
//         participants: Array.isArray(momByMeetingId.participants)
//           ? momByMeetingId.participants.join(", ")
//           : getAttendeesString(momByMeetingId.participants) || getAttendeesString(meeting?.attendees) || "",
//         summary: momByMeetingId.summary || "",
//         notes: momByMeetingId.notes || "",
//         createdBy: momByMeetingId.createdBy || "",
//         meetingId: meeting?.meetingId || "",
//       });
//       setMode("view");
//       setReasonForDelay(momByMeetingId.reasonForDelay || "");
//       setIsAgreedToTerms(false);
//       setSignatureFile(null);
//       setSignaturePreview(null);
//     } else {
//       setMomForm({
//         agenda: meeting?.agenda || "",
//         meetingMode: meeting?.meetingMode || "Online",
//         duration: getDurationString() || "",
//         participants: getAttendeesString(meeting?.attendees) || "",
//         summary: "",
//         notes: "",
//         createdBy: "",
//         meetingId: meeting?.meetingId || "",
//       });
//       setMode("create");
//       setIsAgreedToTerms(false);
//       setSignatureFile(null);
//       setSignaturePreview(null);
//     }
//   }, [momByMeetingId, momByMeetingIdLoading, meeting]);

//   // Effect: Fetch MoM data when modal opens
//   useEffect(() => {
//     if (isOpen && meeting?.meetingId) {
//       dispatch(fetchMoMByMeetingId(meeting.meetingId));
//     }
//   }, [isOpen, meeting?.meetingId, dispatch]);

//   // Effect: Fetch MoM view when available
//   useEffect(() => {
//     if (isOpen && momByMeetingId?.momId && mode === "view") {
//       dispatch(fetchMoMView(momByMeetingId.momId));
//     }
//   }, [isOpen, momByMeetingId?.momId, mode, dispatch]);

//   // Effect: Clean up blob URL and reset state
//   useEffect(() => {
//     return () => {
//       if (momView?.pdfUrl) {
//         URL.revokeObjectURL(momView.pdfUrl);
//       }
//       if (signaturePreview) {
//         URL.revokeObjectURL(signaturePreview);
//       }
//       if (!isOpen) {
//         dispatch(resetMoMByMeetingId());
//       }
//     };
//   }, [isOpen, momView?.pdfUrl, signaturePreview, dispatch]);

//   // Handler: Form input changes
//   const handleMomFormChange = (e, field) => {
//     setMomForm({ ...momForm, [field]: e.target.value });
//   };

//   // Handler: Reason for delay change
//   const handleReasonForDelayChange = (e) => {
//     setReasonForDelay(e.target.value);
//   };

//   // Handler: Signature file change
//   const handleSignatureFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
//       setSignatureFile(file);
//       setSignaturePreview(URL.createObjectURL(file));
//     } else {
//       toast({
//         title: "Error",
//         description: "Please upload a valid image file (.png, .jpg, .jpeg).",
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300",
//       });
//       setSignatureFile(null);
//       setSignaturePreview(null);
//     }
//   };

//   // Handler: Terms agreement checkbox
//   const handleTermsChange = (checked) => {
//     setIsAgreedToTerms(checked);
//   };

//   // Helper: Check if all required fields are filled
//   const areRequiredFieldsFilled = () => {
//     return (
//       momForm.createdBy.trim() &&
//       momForm.summary.trim() &&
//       signatureFile &&
//       (!isTimeExceeded || (reasonForDelay.trim() && isAgreedToTerms))
//     );
//   };

//   // Handler: Form submission
//   const handleSubmit = async () => {
//     if (!momForm.createdBy.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter the name of the person who created the MoM.",
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300",
//       });
//       return;
//     }
//     if (!momForm.summary.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter a summary.",
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300",
//       });
//       return;
//     }
//     if (!signatureFile) {
//       toast({
//         title: "Error",
//         description: "Please upload a signature image.",
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300",
//       });
//       return;
//     }
//     if (isTimeExceeded && mode === "create" && (!reasonForDelay.trim() || !isAgreedToTerms)) {
//       toast({
//         title: "Error",
//         description: "Please provide a reason for the delay and agree to the terms.",
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300",
//       });
//       return;
//     }
//     try {
//       const momData = {
//         ...momForm,
//         participants: momForm.participants?.split(",").map((p) => p.trim()).filter(Boolean) || [],
//         meetingId: meeting.meetingId,
//         signature: signatureFile,
//         reasonForDelay: isTimeExceeded && mode === "create" ? reasonForDelay : undefined,
//       };

//       if (isTimeExceeded && mode === "create") {
//         await dispatch(
//           submitCause({
//             meetingId: meeting.meetingId,
//             reason: reasonForDelay,
//             submittedBy: momForm.createdBy,
//           })
//         ).unwrap();
//         toast({
//           title: "Success",
//           description: "Cause for delay submitted successfully!",
//           variant: "success",
//           className: "bg-green-100 text-green-800 border-green-300",
//         });
//       }

//       if (mode === "edit" && momByMeetingId) {
//         await dispatch(updateMoM(momData)).unwrap();
//         toast({
//           title: "Success",
//           description: "MoM updated successfully!",
//           variant: "success",
//           className: "bg-green-100 text-green-800 border-green-300",
//         });
//       } else if (mode === "create") {
//         await dispatch(createMoM(momData)).unwrap();
//         toast({
//           title: "Success",
//           description: "MoM created successfully!",
//           variant: "success",
//           className: "bg-green-100 text-green-800 border-green-300",
//         });
//       }
//       setMode("view");
//       setReasonForDelay("");
//       setIsAgreedToTerms(false);
//       setSignatureFile(null);
//       setSignaturePreview(null);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: `Failed to ${mode === "edit" ? "update" : "create"} MoM: ${error?.message || "Unknown error"}`,
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300",
//       });
//     }
//   };

//   // Handler: Close modal
//   const handleClose = () => {
//     dispatch(resetMoMByMeetingId());
//     onClose();
//   };

//   // Handler: Toggle mode change
//   const handleModeChange = (newMode) => {
//     setMode(newMode);
//     if (newMode === "create") {
//       setMomForm({
//         agenda: meeting?.agenda || "",
//         meetingMode: meeting?.meetingMode || "Online",
//         duration: getDurationString() || "",
//         participants: getAttendeesString(meeting?.attendees) || "",
//         summary: "",
//         notes: "",
//         createdBy: "",
//         meetingId: meeting?.meetingId || "",
//       });
//       setReasonForDelay("");
//       setIsAgreedToTerms(false);
//       setSignatureFile(null);
//       setSignaturePreview(null);
//     } else if (newMode === "edit" && momByMeetingId) {
//       setMomForm({
//         agenda: momByMeetingId.agenda || meeting?.agenda || "",
//         meetingMode: momByMeetingId.meetingMode || meeting?.meetingMode || "Online",
//         duration: momByMeetingId.duration || getDurationString() || "",
//         participants: Array.isArray(momByMeetingId.participants)
//           ? momByMeetingId.participants.join(", ")
//           : getAttendeesString(momByMeetingId.participants) || getAttendeesString(meeting?.attendees) || "",
//         summary: momByMeetingId.summary || "",
//         notes: momByMeetingId.notes || "",
//         createdBy: momByMeetingId.createdBy || "",
//         meetingId: meeting?.meetingId || "",
//       });
//       setReasonForDelay(momByMeetingId.reasonForDelay || "");
//     }
//   };

//   // Loading state
//   if (momByMeetingIdLoading) {
//     return (
//       <div className="min-h-[400px] bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
//           <span className="mt-4 text-teal-700 text-lg font-semibold">Loading Meeting Details...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-[90vw] sm:max-w-6xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl shadow-2xl" ref={containerRef}>
//       {/* Header */}
//       <div className="mb-8">
//         <h2 className="text-3xl sm:text-4xl font-bold text-teal-800 flex items-center">
//           <FileText className="h-8 w-8 mr-3" />
//           {mode === "create" ? "Create Minutes of Meeting" : mode === "edit" ? "Edit Minutes of Meeting" : "Meeting Details"}
//         </h2>
//         <p className="text-base text-teal-600 mt-2">
//           {mode === "create" || mode === "edit" ? "Complete the form to create or update the Minutes of Meeting." : "View the meeting details and minutes."}
//         </p>
//       </div>

//       {/* Toggle Switch */}
//       <div className="mb-6 flex justify-center">
//         <div className="inline-flex bg-teal-100 rounded-full p-1 shadow-md">
//           <button
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${mode === "view" ? "bg-teal-500 text-white" : "text-teal-700 hover:bg-teal-200"}`}
//             onClick={() => handleModeChange("view")}
//             disabled={momByMeetingIdLoading}
//           >
//             View
//           </button>
//           <button
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${mode === "create" ? "bg-teal-500 text-white" : "text-teal-700 hover:bg-teal-200"}`}
//             onClick={() => handleModeChange("create")}
//             disabled={momByMeetingId || momByMeetingIdLoading || isTimeExceeded}
//           >
//             Create
//           </button>
//           <button
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${mode === "edit" ? "bg-teal-500 text-white" : "text-teal-700 hover:bg-teal-200"}`}
//             onClick={() => handleModeChange("edit")}
//             disabled={!momByMeetingId || momByMeetingIdLoading}
//           >
//             Edit
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Left Column: Meeting Details */}
//         <div className="bg-white p-8 rounded-2xl shadow-lg border border-teal-200 transform hover:scale-[1.01] transition-transform duration-300">
//           <h3 className="text-2xl font-semibold text-teal-800 mb-6 flex items-center">
//             <Calendar className="h-6 w-6 mr-3" />
//             Meeting Details
//           </h3>
//           <div className="space-y-5 text-teal-700 text-base">
//             <p className="flex items-start">
//               <FileText className="h-5 w-5 mr-2 mt-1 text-teal-600 flex-shrink-0" />
//               <span>
//                 <strong className="font-semibold">Agenda:</strong> {meeting?.agenda || "N/A"}
//               </span>
//             </p>
//             <p className="flex items-start">
//               <Users className="h-5 w-5 mr-2 mt-1 text-teal-600 flex-shrink-0" />
//               <span>
//                 <strong className="font-semibold">Meeting Mode:</strong> {meeting?.meetingMode || "N/A"}
//               </span>
//             </p>
//             <p className="flex items-start">
//               <Clock className="h-5 w-5 mr-2 mt-1 text-teal-600 flex-shrink-0" />
//               <span>
//                 <strong className="font-semibold">Duration:</strong> {getDurationString() || "N/A"}
//               </span>
//             </p>
//             <p className="flex items-start">
//               <Users className="h-5 w-5 mr-2 mt-1 text-teal-600 flex-shrink-0" />
//               <span>
//                 <strong className="font-semibold">Participants:</strong> {getAttendeesString(meeting?.attendees) || "N/A"}
//               </span>
//             </p>
//           </div>
//           <div className="flex justify-end mt-6">
//             <Button
//               variant="outline"
//               className="border-teal-500 text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-300 text-base"
//               onClick={handleClose}
//             >
//               Close
//             </Button>
//           </div>
//         </div>

//         {/* Right Column: MoM Preview or Form */}
//         <div className="space-y-8">
//           {momByMeetingId && mode === "view" ? (
//             <div className="bg-white p-8 rounded-2xl shadow-lg border border-teal-200 transform hover:scale-[1.01] transition-transform duration-300">
//               <h3 className="text-2xl font-semibold text-teal-800 mb-6 flex items-center">
//                 <FileText className="h-6 w-6 mr-3" />
//                 Minutes of Meeting
//               </h3>
//               {momByMeetingId.reasonForDelay && (
//                 <div className="mb-6 p-4 bg-amber-100 text-amber-800 rounded-lg flex items-center animate-fade-in">
//                   <AlertCircle className="h-5 w-5 mr-2" />
//                   <span>This MoM was created with reference to a delay cause.</span>
//                 </div>
//               )}
//               {momView?.pdfUrl ? (
//                 <div className="w-full h-[400px] md:h-[500px] rounded-lg border border-teal-200 overflow-auto">
//                   <iframe src={momView?.pdfUrl} width="100%" height="100%" className="rounded-lg" />
//                 </div>
//               ) : (
//                 <div className="space-y-5 text-teal-700 text-base">
//                   <p className="flex items-start">
//                     <FileText className="h-5 w-5 mr-2 mt-1 text-teal-600 flex-shrink-0" />
//                     <span>
//                       <strong className="font-semibold">Summary:</strong> {momByMeetingId.summary || "N/A"}
//                     </span>
//                   </p>
//                   <p className="flex items-start">
//                     <FileText className="h-5 w-5 mr-2 mt-1 text-teal-600 flex-shrink-0" />
//                     <span>
//                       <strong className="font-semibold">Notes:</strong> {momByMeetingId.notes || "N/A"}
//                     </span>
//                   </p>
//                   <p className="flex items-start">
//                     <Signature className="h-5 w-5 mr-2 mt-1 text-teal-600 flex-shrink-0" />
//                     <span>
//                       <strong className="font-semibold">Signature:</strong> [File Uploaded]
//                     </span>
//                   </p>
//                   <p className="flex items-start">
//                     <User className="h-5 w-5 mr-2 mt-1 text-teal-600 flex-shrink-0" />
//                     <span>
//                       <strong className="font-semibold">Created By:</strong> {momByMeetingId.createdBy || "N/A"}
//                     </span>
//                   </p>
//                   <p className="flex items-start">
//                     <Calendar className="h-5 w-5 mr-2 mt-1 text-teal-600 flex-shrink-0" />
//                     <span>
//                       <strong className="font-semibold">Meeting Date:</strong> {momByMeetingId.date || meeting?.date || "N/A"}
//                     </span>
//                   </p>
//                   {momByMeetingId.reasonForDelay && (
//                     <p className="flex items-start">
//                       <AlertCircle className="h-5 w-5 mr-2 mt-1 text-amber-600 flex-shrink-0" />
//                       <span>
//                         <strong className="font-semibold">Reason for Delay:</strong> {momByMeetingId.reasonForDelay}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//               )}
//               <div className="flex flex-wrap justify-end mt-6 gap-3">
//                 {momView?.pdfUrl && (
//                   <Button
//                     variant="outline"
//                     className="border-teal-500 text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-300 text-base"
//                     onClick={() => window.open(momView.pdfUrl, "_blank")}
//                   >
//                     <Download className="h-4 w-4 mr-2" />
//                     Download PDF
//                   </Button>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white p-8 rounded-2xl shadow-lg border border-teal-200 transform hover:scale-[1.01] transition-transform duration-300">
//               <h3 className="text-2xl font-semibold text-teal-800 mb-6 flex items-center">
//                 <FileText className="h-6 w-6 mr-3" />
//                 {mode === "edit" ? "Edit Minutes of Meeting" : "Create Minutes of Meeting"}
//               </h3>
//               {isTimeExceeded && mode === "create" && (
//                 <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center animate-fade-in">
//                   <AlertCircle className="h-5 w-5 mr-2" />
//                   <span>Time Exceeded: MoM creation delayed beyond 1 hour.</span>
//                 </div>
//               )}
//               <div className="space-y-6">
//                 <div>
//                   <Label className="text-teal-700 font-semibold text-base flex items-center">
//                     <FileText className="h-5 w-5 mr-2" />
//                     Agenda
//                   </Label>
//                   <Input
//                     value={momForm.agenda}
//                     onChange={(e) => handleMomFormChange(e, "agenda")}
//                     placeholder="Enter meeting agenda..."
//                     className="mt-2 border-teal-300 focus:ring-2 focus:ring-teal-500 text-base bg-teal-50 rounded-lg"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-teal-700 font-semibold text-base flex items-center">
//                     <Users className="h-5 w-5 mr-2" />
//                     Meeting Mode
//                   </Label>
//                   <Input
//                     value={momForm.meetingMode || "Online"}
//                     onChange={(e) => handleMomFormChange(e, "meetingMode")}
//                     placeholder="Online/In-person"
//                     className="mt-2 border-teal-300 focus:ring-2 focus:ring-teal-500 text-base bg-teal-50 rounded-lg"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-teal-700 font-semibold text-base flex items-center">
//                     <Clock className="h-5 w-5 mr-2" />
//                     Duration
//                   </Label>
//                   <Input
//                     value={momForm.duration}
//                     onChange={(e) => handleMomFormChange(e, "duration")}
//                     placeholder="Start time - End time"
//                     className="mt-2 border-teal-300 focus:ring-2 focus:ring-teal-500 text-base bg-teal-50 rounded-lg"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-teal-700 font-semibold text-base flex items-center">
//                     <Users className="h-5 w-5 mr-2" />
//                     Participants
//                   </Label>
//                   <Input
//                     value={momForm.participants}
//                     onChange={(e) => handleMomFormChange(e, "participants")}
//                     placeholder="Comma-separated names..."
//                     className="mt-2 border-teal-300 focus:ring-2 focus:ring-teal-500 text-base bg-teal-50 rounded-lg"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-teal-700 font-semibold text-base flex items-center">
//                     <FileText className="h-5 w-5 mr-2" />
//                     Summary
//                   </Label>
//                   <Textarea
//                     value={momForm.summary}
//                     onChange={(e) => handleMomFormChange(e, "summary")}
//                     placeholder="Enter meeting summary..."
//                     className="mt-2 border-teal-300 focus:ring-2 focus:ring-teal-500 resize-none text-base bg-teal-50 rounded-lg"
//                     rows={4}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-teal-700 font-semibold text-base flex items-center">
//                     <FileText className="h-5 w-5 mr-2" />
//                     Notes
//                   </Label>
//                   <Textarea
//                     value={momForm.notes}
//                     onChange={(e) => handleMomFormChange(e, "notes")}
//                     placeholder="Enter additional notes..."
//                     className="mt-2 border-teal-300 focus:ring-2 focus:ring-teal-500 resize-none text-base bg-teal-50 rounded-lg"
//                     rows={4}
//                   />
//                 </div>
//                 {isTimeExceeded && mode === "create" && (
//                   <>
//                     <div>
//                       <Label className="text-teal-700 font-semibold text-base flex items-center">
//                         <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
//                         Reason for Delay
//                       </Label>
//                       <Textarea
//                         value={reasonForDelay}
//                         onChange={handleReasonForDelayChange}
//                         placeholder="Enter reason for delay..."
//                         className="mt-2 border-teal-300 focus:ring-2 focus:ring-teal-500 resize-none text-base bg-teal-50 rounded-lg"
//                         rows={3}
//                       />
//                     </div>
//                     <div className="flex items-center space-x-3">
//                       <Checkbox
//                         id="terms"
//                         checked={isAgreedToTerms}
//                         onCheckedChange={handleTermsChange}
//                         className="border-teal-400 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
//                       />
//                       <Label
//                         htmlFor="terms"
//                         className="text-teal-700 font-semibold text-base"
//                       >
//                         I agree to the cause terms and conditions
//                       </Label>
//                     </div>
//                   </>
//                 )}
//                 <div>
//                   <Label className="text-teal-700 font-semibold text-base flex items-center">
//                     <Signature className="h-5 w-5 mr-2" />
//                     Signature (Image)
//                   </Label>
//                   <Input
//                     type="file"
//                     accept="image/png,image/jpeg,image/jpg"
//                     onChange={handleSignatureFileChange}
//                     className="mt-2 border-teal-300 focus:ring-2 focus:ring-teal-500 text-base bg-teal-50 rounded-lg"
//                   />
//                   {signaturePreview && (
//                     <div className="mt-3">
//                       <img
//                         src={signaturePreview}
//                         alt="Signature Preview"
//                         className="max-w-[150px] max-h-[100px] rounded-md border border-teal-200"
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <Label className="text-teal-700 font-semibold text-base flex items-center">
//                     <User className="h-5 w-5 mr-2" />
//                     Created By
//                   </Label>
//                   <Input
//                     value={momForm.createdBy}
//                     onChange={(e) => handleMomFormChange(e, "createdBy")}
//                     placeholder="Recorder's name..."
//                     className="mt-2 border-teal-300 focus:ring-2 focus:ring-teal-500 text-base bg-teal-50 rounded-lg"
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap justify-end mt-6 gap-3">
//                 <Button
//                   variant="outline"
//                   className="border-teal-500 text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-300 text-base"
//                   onClick={() => setMode("view")}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white text-base transition-all duration-300"
//                   onClick={handleSubmit}
//                   disabled={momByMeetingIdLoading || (mode === "create" && isTimeExceeded && !areRequiredFieldsFilled())}
//                 >
//                   {momByMeetingIdLoading ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Submitting...
//                     </>
//                   ) : mode === "edit" ? (
//                     "Update MoM"
//                   ) : (
//                     "Create MoM"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MeetingDetailsWithMOM;




// "use client";

// import { useEffect, useState, useRef } from "react";
// import { format, isAfter, addHours } from "date-fns";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchMoMByMeetingId,
//   resetMoMByMeetingId,
//   createMoM,
//   updateMoM,
//   fetchMoMView,
// } from "@/store/features/momSlice";
// import { submitCause } from "@/store/features/causeSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Loader2,
//   Download,
//   Edit2,
//   PlusCircle,
//   AlertCircle,
//   Calendar,
//   Users,
//   Clock,
//   FileText,
//   Signature,
//   User,
// } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";

// // Component: MeetingDetailsWithMOM
// function MeetingDetailsWithMOM({ isOpen, onClose, meeting, TIME_ZONE }) {
//   const dispatch = useDispatch();
//   const { momByMeetingId, momByMeetingIdLoading, momView, momViewLoading } = useSelector(
//     (state) => state.mom
//   );
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [isTimeExceeded, setIsTimeExceeded] = useState(false);
//   const [reasonForDelay, setReasonForDelay] = useState("");
//   const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);
//   const [signatureFile, setSignatureFile] = useState(null);
//   const [signaturePreview, setSignaturePreview] = useState(null);
//   const containerRef = useRef(null);

//   // Form state for creating/editing MoM
//   const [momForm, setMomForm] = useState({
//     agenda: meeting?.agenda || "",
//     meetingMode: meeting?.meetingMode || "Online",
//     duration: "",
//     participants: "",
//     summary: "",
//     notes: "",
//     createdBy: "",
//     meetingId: meeting?.meetingId || "",
//   });

//   // Helper: Format time (e.g., "10:00 AM")
//   const formatTimes = (dateTime) => {
//     if (!dateTime) return "";
//     try {
//       return format(new Date(dateTime), "p");
//     } catch {
//       return "";
//     }
//   };

//   // Helper: Compute duration as "startTime - endTime"
//   const getDurationString = () => {
//     const start = formatTimes(meeting?.start?.dateTime);
//     const end = formatTimes(meeting?.end?.dateTime);
//     return start && end ? `${start} - ${end}` : "";
//   };

//   // Helper: Format attendees into a string
//   const getAttendeesString = (attendees) => {
//     if (Array.isArray(attendees)) {
//       return attendees.join(", ");
//     }
//     return attendees ? String(attendees) : "";
//   };

//   // Helper: Check if meeting has ended and 1-hour window has passed
//   const checkMeetingTimeStatus = () => {
//     if (!meeting?.end?.dateTime) return false;
//     const endTime = new Date(meeting.end.dateTime);
//     const now = new Date();
//     const oneHourAfterEnd = addHours(endTime, 1);
//     return isAfter(now, oneHourAfterEnd);
//   };

//   // Effect: Initialize form and check time status
//   useEffect(() => {
//     const timeExceeded = checkMeetingTimeStatus();
//     setIsTimeExceeded(timeExceeded);

//     if (momByMeetingId && momByMeetingId.meetingId === meeting?.meetingId) {
//       setMomForm({
//         agenda: momByMeetingId.agenda || meeting?.agenda || "",
//         meetingMode: momByMeetingId.meetingMode || meeting?.meetingMode || "Online",
//         duration: momByMeetingId.duration || getDurationString() || "",
//         participants: Array.isArray(momByMeetingId.participants)
//           ? momByMeetingId.participants.join(", ")
//           : getAttendeesString(momByMeetingId.participants) || getAttendeesString(meeting?.attendees) || "",
//         summary: momByMeetingId.summary || "",
//         notes: momByMeetingId.notes || "",
//         createdBy: momByMeetingId.createdBy || "",
//         meetingId: meeting?.meetingId || "",
//       });
//       setIsFormVisible(false);
//       setIsEditMode(false);
//       setReasonForDelay(momByMeetingId.reasonForDelay || "");
//       setIsAgreedToTerms(false);
//       setSignatureFile(null);
//       setSignaturePreview(null);
//     } else {
//       setMomForm({
//         agenda: meeting?.agenda || "",
//         meetingMode: meeting?.meetingMode || "Online",
//         duration: getDurationString() || "",
//         participants: getAttendeesString(meeting?.attendees) || "",
//         summary: "",
//         notes: "",
//         createdBy: "",
//         meetingId: meeting?.meetingId || "",
//       });
//       setIsFormVisible(false);
//       setIsEditMode(false);
//       setIsAgreedToTerms(false);
//       setSignatureFile(null);
//       setSignaturePreview(null);
//     }
//   }, [momByMeetingId, momByMeetingIdLoading, meeting]);

//   // Effect: Fetch MoM data when modal opens
//   useEffect(() => {
//     if (isOpen && meeting?.meetingId) {
//       dispatch(fetchMoMByMeetingId(meeting.meetingId));
//     }
//   }, [isOpen, meeting?.meetingId, dispatch]);

//   // Effect: Fetch MoM view when available
//   useEffect(() => {
//     if (isOpen && momByMeetingId?.momId && !isFormVisible) {
//       dispatch(fetchMoMView(momByMeetingId.momId));
//     }
//   }, [isOpen, momByMeetingId?.momId, isFormVisible, dispatch]);

//   // Effect: Clean up blob URL and reset state
//   useEffect(() => {
//     return () => {
//       if (momView?.pdfUrl) {
//         URL.revokeObjectURL(momView.pdfUrl);
//       }
//       if (signaturePreview) {
//         URL.revokeObjectURL(signaturePreview);
//       }
//       if (!isOpen) {
//         dispatch(resetMoMByMeetingId());
//       }
//     };
//   }, [isOpen, momView?.pdfUrl, signaturePreview, dispatch]);

//   // Handler: Form input changes
//   const handleMomFormChange = (e, field) => {
//     setMomForm({ ...momForm, [field]: e.target.value });
//   };

//   // Handler: Reason for delay change
//   const handleReasonForDelayChange = (e) => {
//     setReasonForDelay(e.target.value);
//   };

//   // Handler: Signature file change
//   const handleSignatureFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
//       setSignatureFile(file);
//       setSignaturePreview(URL.createObjectURL(file));
//     } else {
//       toast({
//         title: "Error",
//         description: "Please upload a valid image file (.png, .jpg, .jpeg).",
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300 font-medium",
//       });
//       setSignatureFile(null);
//       setSignaturePreview(null);
//     }
//   };

//   // Handler: Terms agreement checkbox
//   const handleTermsChange = (checked) => {
//     setIsAgreedToTerms(checked);
//   };

//   // Helper: Check if all required fields are filled
//   const areRequiredFieldsFilled = () => {
//     return (
//       momForm.createdBy.trim() &&
//       momForm.summary.trim() &&
//       signatureFile &&
//       (!isTimeExceeded || (reasonForDelay.trim() && isAgreedToTerms))
//     );
//   };

//   // Handler: Form submission
//   const handleSubmit = async () => {
//     if (!momForm.createdBy.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter the name of the person who created the MoM.",
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300 font-medium",
//       });
//       return;
//     }
//     if (!momForm.summary.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter a summary.",
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300 font-medium",
//       });
//       return;
//     }
//     if (!signatureFile) {
//       toast({
//         title: "Error",
//         description: "Please upload a signature image.",
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300 font-medium",
//       });
//       return;
//     }
//     if (isTimeExceeded && !isEditMode && (!reasonForDelay.trim() || !isAgreedToTerms)) {
//       toast({
//         title: "Error",
//         description: "Please provide a reason for the delay and agree to the terms.",
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300 font-medium",
//       });
//       return;
//     }
//     try {
//       const momData = {
//         ...momForm,
//         participants: momForm.participants?.split(",").map((p) => p.trim()).filter(Boolean) || [],
//         meetingId: meeting.meetingId,
//         signature: signatureFile,
//         reasonForDelay: isTimeExceeded && !isEditMode ? reasonForDelay : undefined,
//       };

//       if (isTimeExceeded && !isEditMode) {
//         await dispatch(
//           submitCause({
//             meetingId: meeting.meetingId,
//             reason: reasonForDelay,
//             submittedBy: momForm.createdBy,
//           })
//         ).unwrap();
//         toast({
//           title: "Success",
//           description: "Cause for delay submitted successfully!",
//           variant: "success",
//           className: "bg-green-100 text-green-800 border-green-300 font-medium",
//         });
//       }

//       if (isEditMode && momByMeetingId) {
//         await dispatch(updateMoM(momData)).unwrap();
//         toast({
//           title: "Success",
//           description: "MoM updated successfully!",
//           variant: "success",
//           className: "bg-green-100 text-green-800 border-green-300 font-medium",
//         });
//       } else {
//         await dispatch(createMoM(momData)).unwrap();
//         toast({
//           title: "Success",
//           description: "MoM created successfully!",
//           variant: "success",
//           className: "bg-green-100 text-green-800 border-green-300 font-medium",
//         });
//       }
//       setIsFormVisible(false);
//       setIsEditMode(false);
//       setReasonForDelay("");
//       setIsAgreedToTerms(false);
//       setSignatureFile(null);
//       setSignaturePreview(null);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: `Failed to ${isEditMode ? "update" : "create"} MoM: ${error?.message || "Unknown error"}`,
//         variant: "destructive",
//         className: "bg-red-100 text-red-800 border-red-300 font-medium",
//       });
//     }
//   };

//   // Handler: Show create form
//   const handleCreateMoM = () => {
//     setIsFormVisible(true);
//     setIsEditMode(false);
//     setMomForm({
//       agenda: meeting?.agenda || "",
//       meetingMode: meeting?.meetingMode || "Online",
//       duration: getDurationString() || "",
//       participants: getAttendeesString(meeting?.attendees) || "",
//       summary: "",
//       notes: "",
//       createdBy: "",
//       meetingId: meeting?.meetingId || "",
//     });
//     setReasonForDelay("");
//     setIsAgreedToTerms(false);
//     setSignatureFile(null);
//     setSignaturePreview(null);
//   };

//   // Handler: Show edit form
//   const handleEditMoM = () => {
//     setIsFormVisible(true);
//     setIsEditMode(true);
//   };

//   // Handler: Cancel form
//   const handleCancel = () => {
//     setIsFormVisible(false);
//     setIsEditMode(false);
//     setReasonForDelay("");
//     setIsAgreedToTerms(false);
//     setSignatureFile(null);
//     setSignaturePreview(null);
//   };

//   // Handler: Close modal
//   const handleClose = () => {
//     dispatch(resetMoMByMeetingId());
//     onClose();
//   };

//   // Loading state
//   if (momByMeetingIdLoading || momViewLoading) {
//     return (
//       <div className="min-h-[400px] bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
//           <span className="text-teal-700 text-lg font-semibold">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-[95vw] sm:max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl shadow-2xl" ref={containerRef}>
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-2xl sm:text-3xl font-bold text-teal-800 flex items-center">
//           <FileText className="h-6 w-6 sm:h-7 sm:w-7 mr-2" />
//           {isFormVisible ? (isEditMode ? "Edit Minutes of Meeting" : "Create Minutes of Meeting") : "Meeting Details"}
//         </h2>
//         <p className="text-sm sm:text-base text-teal-600 mt-1">
//           {isFormVisible ? "Fill out the form to create or update the Minutes of Meeting." : "View meeting details and minutes."}
//         </p>
//       </div>

//       {isFormVisible ? (
//         // Form View
//         <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-teal-200 animate-fade-in">
//           {isTimeExceeded && !isEditMode && (
//             <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
//               <AlertCircle className="h-5 w-5 mr-2" />
//               <span className="text-sm sm:text-base">Time Exceeded: MoM creation delayed beyond 1 hour.</span>
//             </div>
//           )}
//           <div className="space-y-4">
//             <div>
//               <Label className="text-teal-700 font-semibold text-sm sm:text-base flex items-center">
//                 <FileText className="h-5 w-5 mr-2" />
//                 Agenda
//               </Label>
//               <Input
//                 value={momForm.agenda}
//                 onChange={(e) => handleMomFormChange(e, "agenda")}
//                 placeholder="Enter meeting agenda..."
//                 className="mt-1 border-teal-300 focus:ring-2 focus:ring-teal-500 text-sm sm:text-base bg-teal-50 rounded-lg"
//                 readOnly
//               />
//             </div>
//             <div>
//               <Label className="text-teal-700 font-semibold text-sm sm:text-base flex items-center">
//                 <Users className="h-5 w-5 mr-2" />
//                 Meeting Mode
//               </Label>
//               <Input
//                 value={momForm.meetingMode || "Online"}
//                 onChange={(e) => handleMomFormChange(e, "meetingMode")}
//                 placeholder="Online/In-person"
//                 className="mt-1 border-teal-300 focus:ring-2 focus:ring-teal-500 text-sm sm:text-base bg-teal-50 rounded-lg"
//                 readOnly
//               />
//             </div>
//             <div>
//               <Label className="text-teal-700 font-semibold text-sm sm:text-base flex items-center">
//                 <Clock className="h-5 w-5 mr-2" />
//                 Duration
//               </Label>
//               <Input
//                 value={momForm.duration}
//                 onChange={(e) => handleMomFormChange(e, "duration")}
//                 placeholder="Start time - End time"
//                 className="mt-1 border-teal-300 focus:ring-2 focus:ring-teal-500 text-sm sm:text-base bg-teal-50 rounded-lg"
//                 readOnly
//               />
//             </div>
//             <div>
//               <Label className="text-teal-700 font-semibold text-sm sm:text-base flex items-center">
//                 <Users className="h-5 w-5 mr-2" />
//                 Participants
//               </Label>
//               <Input
//                 value={momForm.participants}
//                 onChange={(e) => handleMomFormChange(e, "participants")}
//                 placeholder="Comma-separated names..."
//                 className="mt-1 border-teal-300 focus:ring-2 focus:ring-teal-500 text-sm sm:text-base bg-teal-50 rounded-lg"
//                 readOnly
//               />
//             </div>
//             <div>
//               <Label className="text-teal-700 font-semibold text-sm sm:text-base flex items-center">
//                 <FileText className="h-5 w-5 mr-2" />
//                 Summary
//               </Label>
//               <Textarea
//                 value={momForm.summary}
//                 onChange={(e) => handleMomFormChange(e, "summary")}
//                 placeholder="Enter meeting summary..."
//                 className="mt-1 border-teal-300 focus:ring-2 focus:ring-teal-500 text-sm sm:text-base bg-teal-50 rounded-lg resize-none"
//                 rows={4}
//               />
//             </div>
//             <div>
//               <Label className="text-teal-700 font-semibold text-sm sm:text-base flex items-center">
//                 <FileText className="h-5 w-5 mr-2" />
//                 Notes
//               </Label>
//               <Textarea
//                 value={momForm.notes}
//                 onChange={(e) => handleMomFormChange(e, "notes")}
//                 placeholder="Enter additional notes..."
//                 className="mt-1 border-teal-300 focus:ring-2 focus:ring-teal-500 text-sm sm:text-base bg-teal-50 rounded-lg resize-none"
//                 rows={4}
//               />
//             </div>
//             {isTimeExceeded && !isEditMode && (
//               <>
//                 <div>
//                   <Label className="text-teal-700 font-semibold text-sm sm:text-base flex items-center">
//                     <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
//                     Reason for Delay
//                   </Label>
//                   <Textarea
//                     value={reasonForDelay}
//                     onChange={handleReasonForDelayChange}
//                     placeholder="Enter reason for delay..."
//                     className="mt-1 border-teal-300 focus:ring-2 focus:ring-teal-500 text-sm sm:text-base bg-teal-50 rounded-lg resize-none"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="terms"
//                     checked={isAgreedToTerms}
//                     onCheckedChange={handleTermsChange}
//                     className="border-teal-400 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
//                   />
//                   <Label
//                     htmlFor="terms"
//                     className="text-teal-700 font-semibold text-sm sm:text-base"
//                   >
//                     I agree to the cause terms and conditions
//                   </Label>
//                 </div>
//               </>
//             )}
//             <div>
//               <Label className="text-teal-700 font-semibold text-sm sm:text-base flex items-center">
//                 <Signature className="h-5 w-5 mr-2" />
//                 Signature (Image)
//               </Label>
//               <Input
//                 type="file"
//                 accept="image/png,image/jpeg,image/jpg"
//                 onChange={handleSignatureFileChange}
//                 className="mt-1 border-teal-300 focus:ring-2 focus:ring-teal-500 text-sm sm:text-base bg-teal-50 rounded-lg"
//               />
//               {signaturePreview && (
//                 <div className="mt-2">
//                   <img
//                     src={signaturePreview}
//                     alt="Signature Preview"
//                     className="max-w-[120px] sm:max-w-[150px] max-h-[80px] sm:max-h-[100px] rounded-md border border-teal-200"
//                   />
//                 </div>
//               )}
//             </div>
//             <div>
//               <Label className="text-teal-700 font-semibold text-sm sm:text-base flex items-center">
//                 <User className="h-5 w-5 mr-2" />
//                 Created By
//               </Label>
//               <Input
//                 value={momForm.createdBy}
//                 onChange={(e) => handleMomFormChange(e, "createdBy")}
//                 placeholder="Recorder's name..."
//                 className="mt-1 border-teal-300 focus:ring-2 focus:ring-teal-500 text-sm sm:text-base bg-teal-50 rounded-lg"
//               />
//             </div>
//           </div>
//           <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3">
//             <Button
//               variant="outline"
//               className="w-full sm:w-auto border-teal-500 text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-300 text-sm sm:text-base rounded-lg"
//               onClick={handleCancel}
//             >
//               Cancel
//             </Button>
//             <Button
//               className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white text-sm sm:text-base transition-all duration-300 rounded-lg"
//               onClick={handleSubmit}
//               disabled={momByMeetingIdLoading || (isTimeExceeded && !isEditMode && !areRequiredFieldsFilled())}
//             >
//               {momByMeetingIdLoading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Submitting...
//                 </>
//               ) : isEditMode ? (
//                 "Update MoM"
//               ) : (
//                 "Create MoM"
//               )}
//             </Button>
//           </div>
//         </div>
//       ) : (
//         // Default View: Meeting Details and MoM (if exists)
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//           {/* Meeting Details */}
//           <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-teal-200 transition-transform duration-300 hover:scale-[1.01]">
//             <h3 className="text-xl sm:text-2xl font-semibold text-teal-800 mb-4 flex items-center">
//               <Calendar className="h-6 w-6 mr-2" />
//               Meeting Details
//             </h3>
//             <div className="space-y-3 text-teal-700 text-sm sm:text-base">
//               <p className="flex items-start">
//                 <FileText className="h-5 w-5 mr-2 mt-0.5 text-teal-600 flex-shrink-0" />
//                 <span>
//                   <strong className="font-semibold">Agenda:</strong> {meeting?.agenda || "N/A"}
//                 </span>
//               </p>
//               <p className="flex items-start">
//                 <Users className="h-5 w-5 mr-2 mt-0.5 text-teal-600 flex-shrink-0" />
//                 <span>
//                   <strong className="font-semibold">Meeting Mode:</strong> {meeting?.meetingMode || "N/A"}
//                 </span>
//               </p>
//               <p className="flex items-start">
//                 <Clock className="h-5 w-5 mr-2 mt-0.5 text-teal-600 flex-shrink-0" />
//                 <span>
//                   <strong className="font-semibold">Duration:</strong> {getDurationString() || "N/A"}
//                 </span>
//               </p>
//               <p className="flex items-start">
//                 <Users className="h-5 w-5 mr-2 mt-0.5 text-teal-600 flex-shrink-0" />
//                 <span>
//                   <strong className="font-semibold">Participants:</strong> {getAttendeesString(meeting?.attendees) || "N/A"}
//                 </span>
//               </p>
//             </div>
//           </div>

//           {/* MoM Preview or Create Button */}
//           {momByMeetingId ? (
//             <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-teal-200 transition-transform duration-300 hover:scale-[1.01]">
//               <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
//                 <h3 className="text-xl sm:text-2xl font-semibold text-teal-800 flex items-center">
//                   <FileText className="h-6 w-6 mr-2" />
//                   Minutes of Meeting
//                 </h3>
//                 <Button
//                   variant="outline"
//                   className="mt-2 sm:mt-0 border-teal-500 text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-300 text-sm sm:text-base rounded-lg"
//                   onClick={handleEditMoM}
//                 >
//                   <Edit2 className="h-4 w-4 mr-2" />
//                   Edit MoM
//                 </Button>
//               </div>
//               {momByMeetingId.reasonForDelay && (
//                 <div className="mb-4 p-3 bg-amber-100 text-amber-800 rounded-lg flex items-center">
//                   <AlertCircle className="h-5 w-5 mr-2" />
//                   <span className="text-sm sm:text-base">This MoM was created with reference to a delay cause.</span>
//                 </div>
//               )}
//               {momView?.pdfUrl ? (
//                 <div className="w-full h-[300px] sm:h-[400px] rounded-lg border border-teal-200 overflow-auto">
//                   <iframe src={momView.pdfUrl} width="100%" height="100%" className="rounded-lg" title="MoM PDF Preview" />
//                 </div>
//               ) : (
//                 <div className="space-y-3 text-teal-700 text-sm sm:text-base">
//                   <p className="flex items-start">
//                     <FileText className="h-5 w-5 mr-2 mt-0.5 text-teal-600 flex-shrink-0" />
//                     <span>
//                       <strong className="font-semibold">Summary:</strong> {momByMeetingId.summary || "N/A"}
//                     </span>
//                   </p>
//                   <p className="flex items-start">
//                     <FileText className="h-5 w-5 mr-2 mt-0.5 text-teal-600 flex-shrink-0" />
//                     <span>
//                       <strong className="font-semibold">Notes:</strong> {momByMeetingId.notes || "N/A"}
//                     </span>
//                   </p>
//                   <p className="flex items-start">
//                     <Signature className="h-5 w-5 mr-2 mt-0.5 text-teal-600 flex-shrink-0" />
//                     <span>
//                       <strong className="font-semibold">Signature:</strong> [File Uploaded]
//                     </span>
//                   </p>
//                   <p className="flex items-start">
//                     <User className="h-5 w-5 mr-2 mt-0.5 text-teal-600 flex-shrink-0" />
//                     <span>
//                       <strong className="font-semibold">Created By:</strong> {momByMeetingId.createdBy || "N/A"}
//                     </span>
//                   </p>
//                   <p className="flex items-start">
//                     <Calendar className="h-5 w-5 mr-2 mt-0.5 text-teal-600 flex-shrink-0" />
//                     <span>
//                       <strong className="font-semibold">Meeting Date:</strong> {momByMeetingId.date || meeting?.date || "N/A"}
//                     </span>
//                   </p>
//                   {momByMeetingId.reasonForDelay && (
//                     <p className="flex items-start">
//                       <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-amber-600 flex-shrink-0" />
//                       <span>
//                         <strong className="font-semibold">Reason for Delay:</strong> {momByMeetingId.reasonForDelay}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//               )}
//               {momView?.pdfUrl && (
//                 <div className="flex justify-end mt-4">
//                   <Button
//                     variant="outline"
//                     className="w-full sm:w-auto border-teal-500 text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-300 text-sm sm:text-base rounded-lg"
//                     onClick={() => window.open(momView.pdfUrl, "_blank")}
//                   >
//                     <Download className="h-4 w-4 mr-2" />
//                     Download PDF
//                   </Button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-teal-200 transition-transform duration-300 hover:scale-[1.01]">
//               <h3 className="text-xl sm:text-2xl font-semibold text-teal-800 mb-4 flex items-center">
//                 <FileText className="h-6 w-6 mr-2" />
//                 Minutes of Meeting
//               </h3>
//               <p className="text-teal-700 text-sm sm:text-base mb-4">No MoM has been created for this meeting yet.</p>
//               {isTimeExceeded && (
//                 <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
//                   <AlertCircle className="h-5 w-5 mr-2" />
//                   <span className="text-sm sm:text-base">Time Exceeded: MoM creation delayed beyond 1 hour.</span>
//                 </div>
//               )}
//               <Button
//                 className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white text-sm sm:text-base transition-all duration-300 rounded-lg"
//                 onClick={handleCreateMoM}
//                 disabled={isTimeExceeded}
//               >
//                 <PlusCircle className="h-4 w-4 mr-2" />
//                 Create MoM
//               </Button>
//             </div>
//           )}
//         </div>
//       )}
//       {!isFormVisible && (
//         <div className="flex justify-end mt-4">
//           <Button
//             variant="outline"
//             className="w-full sm:w-auto border-teal-500 text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-300 text-sm sm:text-base rounded-lg"
//             onClick={handleClose}
//           >
//             Close
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MeetingDetailsWithMOM;





"use client";

import { useEffect, useState, useRef } from "react";
import { format, isAfter, addHours } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMoMByMeetingId,
  resetMoMByMeetingId,
  createMoM,
  updateMoM,
  fetchMoMView,
} from "@/store/features/momSlice";
import { submitCause } from "@/store/features/causeSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Download,
  Edit2,
  PlusCircle,
  AlertCircle,
  Calendar,
  Users,
  Clock,
  FileText,
  Signature,
  User,
  FileEdit,
  Eye,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Component: MeetingDetailsWithMOM
function MeetingDetailsWithMOM({ isOpen, onClose, meeting, TIME_ZONE }) {
  const dispatch = useDispatch();
  const { momByMeetingId, momByMeetingIdLoading, momView, momViewLoading } = useSelector(
    (state) => state.mom
  );
  const [mode, setMode] = useState("view"); // Toggle state: 'view' or 'form'
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTimeExceeded, setIsTimeExceeded] = useState(false);
  const [reasonForDelay, setReasonForDelay] = useState("");
  const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const containerRef = useRef(null);

  // Form state for creating/editing MoM
  const [momForm, setMomForm] = useState({
    agenda: meeting?.agenda || "",
    meetingMode: meeting?.meetingMode || "Online",
    duration: "",
    participants: "",
    summary: "",
    notes: "",
    createdBy: "",
    meetingId: meeting?.meetingId || "",
  });

  // Helper: Format time (e.g., "10:00 AM")
  const formatTimes = (dateTime) => {
    if (!dateTime) return "";
    try {
      return format(new Date(dateTime), "p");
    } catch {
      return "";
    }
  };

  // Helper: Compute duration as "startTime - endTime"
  const getDurationString = () => {
    const start = formatTimes(meeting?.start?.dateTime);
    const end = formatTimes(meeting?.end?.dateTime);
    return start && end ? `${start} - ${end}` : "";
  };

  // Helper: Format attendees into a string
  const getAttendeesString = (attendees) => {
    if (Array.isArray(attendees)) {
      return attendees.join(", ");
    }
    return attendees ? String(attendees) : "";
  };

  // Helper: Check if meeting has ended and 1-hour window has passed
  const checkMeetingTimeStatus = () => {
    if (!meeting?.end?.dateTime) return false;
    const endTime = new Date(meeting.end.dateTime);
    const now = new Date();
    const oneHourAfterEnd = addHours(endTime, 1);
    return isAfter(now, oneHourAfterEnd);
  };

  // Effect: Initialize form and check time status
  useEffect(() => {
    const timeExceeded = checkMeetingTimeStatus();
    setIsTimeExceeded(timeExceeded);

    if (momByMeetingId && momByMeetingId.meetingId === meeting?.meetingId) {
      setMomForm({
        agenda: momByMeetingId.agenda || meeting?.agenda || "",
        meetingMode: momByMeetingId.meetingMode || meeting?.meetingMode || "Online",
        duration: momByMeetingId.duration || getDurationString() || "",
        participants: Array.isArray(momByMeetingId.participants)
          ? momByMeetingId.participants.join(", ")
          : getAttendeesString(momByMeetingId.participants) || getAttendeesString(meeting?.attendees) || "",
        summary: momByMeetingId.summary || "",
        notes: momByMeetingId.notes || "",
        createdBy: momByMeetingId.createdBy || "",
        meetingId: meeting?.meetingId || "",
      });
      setMode("view");
      setIsEditMode(false);
      setReasonForDelay(momByMeetingId.reasonForDelay || "");
      setIsAgreedToTerms(false);
      setSignatureFile(null);
      setSignaturePreview(null);
    } else {
      setMomForm({
        agenda: meeting?.agenda || "",
        meetingMode: meeting?.meetingMode || "Online",
        duration: getDurationString() || "",
        participants: getAttendeesString(meeting?.attendees) || "",
        summary: "",
        notes: "",
        createdBy: "",
        meetingId: meeting?.meetingId || "",
      });
      setMode("view");
      setIsEditMode(false);
      setIsAgreedToTerms(false);
      setSignatureFile(null);
      setSignaturePreview(null);
    }
  }, [momByMeetingId, momByMeetingIdLoading, meeting]);

  // Effect: Fetch MoM data when modal opens
  useEffect(() => {
    if (isOpen && meeting?.meetingId) {
      dispatch(fetchMoMByMeetingId(meeting.meetingId));
    }
  }, [isOpen, meeting?.meetingId, dispatch]);

  // Effect: Fetch MoM view when available
  useEffect(() => {
    if (isOpen && momByMeetingId?.momId && mode === "view") {
      dispatch(fetchMoMView(momByMeetingId.momId));
    }
  }, [isOpen, momByMeetingId?.momId, mode, dispatch]);

  // Effect: Clean up blob URL and reset state
  useEffect(() => {
    return () => {
      if (momView?.pdfUrl) {
        URL.revokeObjectURL(momView.pdfUrl);
      }
      if (signaturePreview) {
        URL.revokeObjectURL(signaturePreview);
      }
      if (!isOpen) {
        dispatch(resetMoMByMeetingId());
      }
    };
  }, [isOpen, momView?.pdfUrl, signaturePreview, dispatch]);

  // Handler: Form input changes
  const handleMomFormChange = (e, field) => {
    setMomForm({ ...momForm, [field]: e.target.value });
  };

  // Handler: Reason for delay change
  const handleReasonForDelayChange = (e) => {
    setReasonForDelay(e.target.value);
  };

  // Handler: Signature file change
  const handleSignatureFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setSignatureFile(file);
      setSignaturePreview(URL.createObjectURL(file));
    } else {
      toast({
        title: "Error",
        description: "Please upload a valid image file (.png, .jpg, .jpeg).",
        variant: "destructive",
        className: "bg-red-100 text-red-800 border-red-300 font-medium",
      });
      setSignatureFile(null);
      setSignaturePreview(null);
    }
  };

  // Handler: Terms agreement checkbox
  const handleTermsChange = (checked) => {
    setIsAgreedToTerms(checked);
  };

  // Helper: Check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    return (
      momForm.createdBy.trim() &&
      momForm.summary.trim() &&
      signatureFile &&
      (!isTimeExceeded || (reasonForDelay.trim() && isAgreedToTerms))
    );
  };

  // Handler: Form submission
  const handleSubmit = async () => {
    if (!momForm.createdBy.trim()) {
      toast({
        title: "Error",
        description: "Please enter the name of the person who created the MoM.",
        variant: "destructive",
        className: "bg-red-100 text-red-800 border-red-300 font-medium",
      });
      return;
    }
    if (!momForm.summary.trim()) {
      toast({
        title: "Error",
        description: "Please enter a summary.",
        variant: "destructive",
        className: "bg-red-100 text-red-800 border-red-300 font-medium",
      });
      return;
    }
    if (!signatureFile) {
      toast({
        title: "Error",
        description: "Please upload a signature image.",
        variant: "destructive",
        className: "bg-red-100 text-red-800 border-red-300 font-medium",
      });
      return;
    }
    if (isTimeExceeded && !isEditMode && (!reasonForDelay.trim() || !isAgreedToTerms)) {
      toast({
        title: "Error",
        description: "Please provide a reason for the delay and agree to the terms.",
        variant: "destructive",
        className: "bg-red-100 text-red-800 border-red-300 font-medium",
      });
      return;
    }
    try {
      const momData = {
        ...momForm,
        participants: momForm.participants?.split(",").map((p) => p.trim()).filter(Boolean) || [],
        meetingId: meeting.meetingId,
        signature: signatureFile,
        reasonForDelay: isTimeExceeded && !isEditMode ? reasonForDelay : undefined,
      };

      if (isTimeExceeded && !isEditMode) {
        await dispatch(
          submitCause({
            meetingId: meeting.meetingId,
            reason: reasonForDelay,
            submittedBy: momForm.createdBy,
          })
        ).unwrap();
        toast({
          title: "Success",
          description: "Cause for delay submitted successfully!",
          variant: "success",
          className: "bg-green-100 text-green-800 border-green-300 font-medium",
        });
      }

      if (isEditMode && momByMeetingId) {
        await dispatch(updateMoM(momData)).unwrap();
        toast({
          title: "Success",
          description: "MoM updated successfully!",
          variant: "success",
          className: "bg-green-100 text-green-800 border-green-300 font-medium",
        });
      } else {
        await dispatch(createMoM(momData)).unwrap();
        toast({
          title: "Success",
          description: "MoM created successfully!",
          variant: "success",
          className: "bg-green-100 text-green-800 border-green-300 font-medium",
        });
      }
      setMode("view");
      setIsEditMode(false);
      setReasonForDelay("");
      setIsAgreedToTerms(false);
      setSignatureFile(null);
      setSignaturePreview(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} MoM: ${error?.message || "Unknown error"}`,
        variant: "destructive",
        className: "bg-red-100 text-red-800 border-red-300 font-medium",
      });
    }
  };

  // Handler: Toggle mode
  const handleToggleMode = () => {
    if (mode === "view") {
      setMode("form");
      setIsEditMode(momByMeetingId ? true : false);
      if (!momByMeetingId) {
        setMomForm({
          agenda: meeting?.agenda || "",
          meetingMode: meeting?.meetingMode || "Online",
          duration: getDurationString() || "",
          participants: getAttendeesString(meeting?.attendees) || "",
          summary: "",
          notes: "",
          createdBy: "",
          meetingId: meeting?.meetingId || "",
        });
        setReasonForDelay("");
        setIsAgreedToTerms(false);
        setSignatureFile(null);
        setSignaturePreview(null);
      }
    } else {
      setMode("view");
      setIsEditMode(false);
      setReasonForDelay("");
      setIsAgreedToTerms(false);
      setSignatureFile(null);
      setSignaturePreview(null);
    }
  };

  // Handler: Close modal
  const handleClose = () => {
    dispatch(resetMoMByMeetingId());
    onClose();
  };

  // Loading state
  if (momByMeetingIdLoading || momViewLoading) {
    return (
      <div className="min-h-[400px] bg-gradient-to-br from-green-50 to-green-200 rounded-2xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-green-700 animate-spin" />
          <span className="text-green-800 text-lg font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[95vw] sm:max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-200 rounded-2xl shadow-2xl" ref={containerRef}>
      {/* Header with Toggle Icon */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 flex items-center">
          <FileText className="h-6 w-6 sm:h-7 sm:w-7 mr-2" />
          {mode === "form" ? (isEditMode ? "Edit Minutes of Meeting" : "Create Minutes of Meeting") : "Meeting Details"}
        </h2>
        <button
          onClick={handleToggleMode}
          className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-300"
          title={mode === "view" ? (momByMeetingId ? "Edit MoM" : "Create MoM") : "View Details"}
          disabled={isTimeExceeded && !momByMeetingId}
        >
          {mode === "view" ? (
            <FileEdit className="h-6 w-6" />
          ) : (
            <Eye className="h-6 w-6" />
          )}
        </button>
      </div>

      {mode === "form" ? (
        // Form View
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-green-200 animate-fade-in">
          {isTimeExceeded && !isEditMode && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="text-sm sm:text-base">Time Exceeded: MoM creation delayed beyond 1 hour.</span>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Label className="text-green-700 font-semibold text-sm sm:text-base flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Agenda
              </Label>
              <Input
                value={momForm.agenda}
                onChange={(e) => handleMomFormChange(e, "agenda")}
                placeholder="Enter meeting agenda..."
                className="mt-1 border-green-300 focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-green-50 rounded-lg"
                readOnly
              />
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm sm:text-base flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Meeting Mode
              </Label>
              <Input
                value={momForm.meetingMode || "Online"}
                onChange={(e) => handleMomFormChange(e, "meetingMode")}
                placeholder="Online/In-person"
                className="mt-1 border-green-300 focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-green-50 rounded-lg"
                readOnly
              />
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm sm:text-base flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Duration
              </Label>
              <Input
                value={momForm.duration}
                onChange={(e) => handleMomFormChange(e, "duration")}
                placeholder="Start time - End time"
                className="mt-1 border-green-300 focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-green-50 rounded-lg"
                readOnly
              />
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm sm:text-base flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Participants
              </Label>
              <Input
                value={momForm.participants}
                onChange={(e) => handleMomFormChange(e, "participants")}
                placeholder="Comma-separated names..."
                className="mt-1 border-green-300 focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-green-50 rounded-lg"
                readOnly
              />
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm sm:text-base flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Summary
              </Label>
              <Textarea
                value={momForm.summary}
                onChange={(e) => handleMomFormChange(e, "summary")}
                placeholder="Enter meeting summary..."
                className="mt-1 border-green-300 focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-green-50 rounded-lg resize-none"
                rows={4}
              />
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm sm:text-base flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Notes
              </Label>
              <Textarea
                value={momForm.notes}
                onChange={(e) => handleMomFormChange(e, "notes")}
                placeholder="Enter additional notes..."
                className="mt-1 border-green-300 focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-green-50 rounded-lg resize-none"
                rows={4}
              />
            </div>
            {isTimeExceeded && !isEditMode && (
              <>
                <div>
                  <Label className="text-green-700 font-semibold text-sm sm:text-base flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                    Reason for Delay
                  </Label>
                  <Textarea
                    value={reasonForDelay}
                    onChange={handleReasonForDelayChange}
                    placeholderโมม
                    placeholder="Enter reason for delay..."
                    className="mt-1 border-green-300 focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-green-50 rounded-lg resize-none"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={isAgreedToTerms}
                    onCheckedChange={handleTermsChange}
                    className="border-green-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-green-700 font-semibold text-sm sm:text-base"
                  >
                    I agree to the cause terms and conditions
                  </Label>
                </div>
              </>
            )}
            <div>
              <Label className="text-green-700 font-semibold text-sm sm:text-base flex items-center">
                <Signature className="h-5 w-5 mr-2" />
                Signature (Image)
              </Label>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleSignatureFileChange}
                className="mt-1 border-green-300 focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-green-50 rounded-lg"
              />
              {signaturePreview && (
                <div className="mt-2">
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="max-w-[120px] sm:max-w-[150px] max-h-[80px] sm:max-h-[100px] rounded-md border border-green-200"
                  />
                </div>
              )}
            </div>
            <div>
              <Label className="text-green-700 font-semibold text-sm sm:text-base flex items-center">
                <User className="h-5 w-5 mr-2" />
                Created By
              </Label>
              <Input
                value={momForm.createdBy}
                onChange={(e) => handleMomFormChange(e, "createdBy")}
                placeholder="Recorder's name..."
                className="mt-1 border-green-300 focus:ring-2 focus:ring-green-500 text-sm sm:text-base bg-green-50 rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-green-500 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors duration-300 text-sm sm:text-base rounded-lg"
              onClick={() => setMode("view")}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white text-sm sm:text-base transition-all duration-300 rounded-lg"
              onClick={handleSubmit}
              disabled={momByMeetingIdLoading || (isTimeExceeded && !isEditMode && !areRequiredFieldsFilled())}
            >
              {momByMeetingIdLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : isEditMode ? (
                "Update MoM"
              ) : (
                "Create MoM"
              )}
            </Button>
          </div>
        </div>
      ) : (
        // View Mode: Meeting Details and MoM (if exists)
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Meeting Details */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-green-200 transition-transform duration-300 hover:scale-[1.01]">
            <h3 className="text-xl sm:text-2xl font-semibold text-green-800 mb-4 flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              Meeting Details
            </h3>
            <div className="space-y-3 text-green-700 text-sm sm:text-base">
              <p className="flex items-start">
                <FileText className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                <span>
                  <strong className="font-semibold">Agenda:</strong> {meeting?.agenda || "N/A"}
                </span>
              </p>
              <p className="flex items-start">
                <Users className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                <span>
                  <strong className="font-semibold">Meeting Mode:</strong> {meeting?.meetingMode || "N/A"}
                </span>
              </p>
              <p className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                <span>
                  <strong className="font-semibold">Duration:</strong> {getDurationString() || "N/A"}
                </span>
              </p>
              <p className="flex items-start">
                <Users className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                <span>
                  <strong className="font-semibold">Participants:</strong> {getAttendeesString(meeting?.attendees) || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* MoM Preview or Create Button */}
          {momByMeetingId ? (
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-green-200 transition-transform duration-300 hover:scale-[1.01]">
              <h3 className="text-xl sm:text-2xl font-semibold text-green-800 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Minutes of Meeting
              </h3>
              {momByMeetingId.reasonForDelay && (
                <div className="mb-4 p-3 bg-amber-100 text-amber-800 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm sm:text-base">This MoM was created with reference to a delay cause.</span>
                </div>
              )}
              {momView?.pdfUrl ? (
                <div className="w-full h-[300px] sm:h-[400px] rounded-lg border border-green-200 overflow-auto">
                  <iframe src={momView.pdfUrl} width="100%" height="100%" className="rounded-lg" title="MoM PDF Preview" />
                </div>
              ) : (
                <div className="space-y-3 text-green-700 text-sm sm:text-base">
                  <p className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Summary:</strong> {momByMeetingId.summary || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Notes:</strong> {momByMeetingId.notes || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-start">
                    <Signature className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Signature:</strong> [File Uploaded]
                    </span>
                  </p>
                  <p className="flex items-start">
                    <User className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Created By:</strong> {momByMeetingId.createdBy || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Meeting Date:</strong> {momByMeetingId.date || meeting?.date || "N/A"}
                    </span>
                  </p>
                  {momByMeetingId.reasonForDelay && (
                    <p className="flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 text-amber-600 flex-shrink-0" />
                      <span>
                        <strong className="font-semibold">Reason for Delay:</strong> {momByMeetingId.reasonForDelay}
                      </span>
                    </p>
                  )}
                </div>
              )}
              {momView?.pdfUrl && (
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-green-500 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors duration-300 text-sm sm:text-base rounded-lg"
                    onClick={() => window.open(momView.pdfUrl, "_blank")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-green-200 transition-transform duration-300 hover:scale-[1.01]">
              <h3 className="text-xl sm:text-2xl font-semibold text-green-800 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Minutes of Meeting
              </h3>
              <p className="text-green-700 text-sm sm:text-base mb-4">No MoM has been created for this meeting yet.</p>
              {isTimeExceeded && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="text-sm sm:text-base">Time Exceeded: MoM creation delayed beyond 1 hour.</span>
                </div>
              )}
              <Button
                className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white text-sm sm:text-base transition-all duration-300 rounded-lg"
                onClick={() => { setMode("form"); setIsEditMode(false); }}
                disabled={isTimeExceeded}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create MoM
              </Button>
            </div>
          )}
        </div>
      )}
      {mode === "view" && (
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-green-500 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors duration-300 text-sm sm:text-base rounded-lg"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}

export default MeetingDetailsWithMOM;