
// "use client";

// import { useEffect, useState, useRef } from "react";
// import { format } from "date-fns";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMoMByMeetingId, resetMoMByMeetingId, createMoM, updateMoM, fetchMoMView } from "@/store/features/momSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Loader2, Download, Edit2, PlusCircle, AlertCircle, Calendar, Users, Clock, FileText, Signature, User } from "lucide-react";
// import { toast } from "@/components/ui/use-toast";
// import { Document, Page, pdfjs } from "react-pdf";

// // Set up the PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// function MeetingDetailsWithMOM({ isOpen, onClose, meeting, TIME_ZONE }) {
//   const dispatch = useDispatch();
//   const { momByMeetingId, momByMeetingIdLoading, momByMeetingIdError, momView, momViewLoading, momViewError } = useSelector((state) => state.mom);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [numPages, setNumPages] = useState(null);
//   const [pdfError, setPdfError] = useState(null);
//   const containerRef = useRef(null); // Ref for container to calculate width

//   // Form state for creating/editing MoM
//   const [momForm, setMomForm] = useState({
//     agenda: meeting?.agenda || "",
//     meetingMode: meeting?.meetingMode || "Online",
//     duration: "",
//     participants: "",
//     summary: "",
//     notes: "",
//     signature: "",
//     createdBy: "",
//     meetingId: meeting?.meetingId || "",
//   });

//   // Helper function to format time (e.g., "10:00 AM")
//   const formatTimes = (dateTime) => {
//     if (!dateTime) return "";
//     try {
//       return format(new Date(dateTime), "p");
//     } catch {
//       return "";
//     }
//   };

//   // Compute duration as "startTime - endTime"
//   const getDurationString = () => {
//     const start = formatTimes(meeting?.start?.dateTime);
//     const end = formatTimes(meeting?.end?.dateTime);
//     return start && end ? `${start} - ${end}` : "";
//   };

//   // Format attendees into a string
//   const getAttendeesString = (attendees) => {
//     if (Array.isArray(attendees)) {
//       return attendees.join(", ");
//     }
//     return attendees ? String(attendees) : "";
//   };

//   // Initialize form with meeting data or MoM data
//   useEffect(() => {
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
//         signature: momByMeetingId.signature || "",
//         createdBy: momByMeetingId.createdBy || "",
//         meetingId: meeting?.meetingId || "",
//       });
//       setIsFormOpen(false);
//       setIsEditMode(false);
//       setPdfError(null);
//     } else if (!momByMeetingId && !momByMeetingIdLoading) {
//       setMomForm({
//         agenda: meeting?.agenda || "",
//         meetingMode: meeting?.meetingMode || "Online",
//         duration: getDurationString() || "",
//         participants: getAttendeesString(meeting?.attendees) || "",
//         summary: "",
//         notes: "",
//         signature: "",
//         createdBy: "",
//         meetingId: meeting?.meetingId || "",
//       });
//       setIsFormOpen(true); // Show create form if no MoM exists
//       setPdfError(null);
//     }
//   }, [momByMeetingId, momByMeetingIdLoading, meeting]);

//   // Fetch MoM data when modal opens and meetingId changes
//   useEffect(() => {
//     if (isOpen && meeting?.meetingId) {
//       dispatch(fetchMoMByMeetingId(meeting.meetingId));
//     }
//   }, [isOpen, meeting?.meetingId, dispatch]);

//   // Fetch MoM view when momByMeetingId is available and has a momId
//   useEffect(() => {
//     if (isOpen && momByMeetingId?.momId && !isFormOpen) {
//       dispatch(fetchMoMView(momByMeetingId.momId));
//     }
//   }, [isOpen, momByMeetingId?.momId, isFormOpen, dispatch]);

//   // Clean up blob URL when modal closes
//   useEffect(() => {
//     return () => {
//       if (momView?.pdfUrl) {
//         URL.revokeObjectURL(momView.pdfUrl); // Prevent memory leaks
//       }
//     };
//   }, [momView?.pdfUrl]);

//   // Handle form input changes
//   const handleMomFormChange = (e, field) => {
//     setMomForm({ ...momForm, [field]: e.target.value });
//   };

//   // Handle form submission for create/update
//   const handleSubmit = async () => {
//     if (!momForm.createdBy.trim()) {
//       toast({ title: "Error", description: "Please enter the name of the person who created the MoM.", variant: "destructive" });
//       return;
//     }
//     if (!momForm.signature.trim()) {
//       toast({ title: "Error", description: "Please enter a signature.", variant: "destructive" });
//       return;
//     }
//     try {
//       const momData = {
//         ...momForm,
//         participants: momForm.participants?.split(",").map((p) => p.trim()).filter(Boolean) || [],
//         meetingId: meeting.meetingId,
//       };
//       if (isEditMode && momByMeetingId) {
//         await dispatch(updateMoM(momData)).unwrap();
//         toast({ title: "Success", description: "MoM updated successfully!", variant: "success" });
//       } else {
//         await dispatch(createMoM(momData)).unwrap();
//         toast({ title: "Success", description: "MoM created successfully!", variant: "success" });
//       }
//       setIsFormOpen(false);
//       setIsEditMode(false);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: `Failed to ${isEditMode ? "update" : "create"} MoM: ${error?.message || "Unknown error"}`,
//         variant: "destructive",
//       });
//     }
//   };

//   // Handle edit button click
//   const handleEditMoM = () => {
//     setIsEditMode(true);
//     setIsFormOpen(true);
//     setPdfError(null);
//   };

//   // Handle create button click
//   const handleCreateMoM = () => {
//     setIsEditMode(false);
//     setIsFormOpen(true);
//     setPdfError(null);
//   };

//   // Handle form cancel
//   const handleCancel = () => {
//     setIsFormOpen(false);
//     setIsEditMode(false);
//     setPdfError(null);
//   };

//   // Handle PDF load success
//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setPdfError(null);
//   };

//   // Handle PDF load error
//   const onDocumentLoadError = (error) => {
//     setPdfError("Failed to load PDF file. Please try downloading it or contact support.");
//     toast({
//       title: "Error",
//       description: "Unable to load the PDF. Please ensure the file is accessible and try again.",
//       variant: "destructive",
//     });
//   };

//   // Calculate responsive PDF width
//   const getPdfWidth = () => {
//     if (containerRef.current) {
//       return Math.min(containerRef.current.offsetWidth - 32, 600); // Max 600px, account for padding
//     }
//     return Math.min(window.innerWidth * 0.9 - 32, 600); // Fallback to 90% of viewport
//   };

//   // Show loading indicator for MoM data
//   if (momByMeetingIdLoading) {
//     return (
//       <div className="relative min-h-[300px] sm:min-h-[400px] bg-gradient-to-b from-green-50 to-white rounded-lg flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 animate-spin" />
//           <span className="mt-3 text-green-700 text-base sm:text-lg font-medium">Loading Meeting Details...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-[90vw] sm:max-w-5xl mx-auto p-4 sm:p-6" ref={containerRef}>
//       <div className="mb-4 sm:mb-6">
//         <h2 className="text-xl sm:text-2xl md:text-3xl text-green-800 font-semibold flex items-center">
//           <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
//           {isFormOpen ? (isEditMode ? "Edit Minutes of Meeting" : "Create Minutes of Meeting") : "Meeting Details"}
//         </h2>
//         <p className="text-xs sm:text-sm text-gray-600 mt-1">
//           {isFormOpen ? "Fill in the details to create or update the Minutes of Meeting." : "View the details and minutes of the meeting."}
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//         {/* Left Column: Meeting Details */}
//         <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md border border Brushless-green-100">
//           <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
//             <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
//             Meeting Details
//           </h3>
//           <div className="space-y-2 sm:space-y-3 text-green-700 text-sm sm:text-base">
//             <p className="flex items-start">
//               <FileText className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
//               <span><strong className="font-medium">Agenda:</strong> {meeting?.agenda || "N/A"}</span>
//             </p>
//             <p className="flex items-start">
//               <Users className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
//               <span><strong className="font-medium">Meeting Mode:</strong> {meeting?.meetingMode || "N/A"}</span>
//             </p>
//             <p className="flex items-start">
//               <Clock className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
//               <span><strong className="font-medium">Duration:</strong> {getDurationString() || "N/A"}</span>
//             </p>
//             <p className="flex items-start">
//               <Users className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
//               <span><strong className="font-medium">Participants:</strong> {getAttendeesString(meeting?.attendees) || "N/A"}</span>
//             </p>
//           </div>
//           {!isFormOpen && (
//             <div className="flex justify-end mt-3 sm:mt-6">
//               <Button
//                 variant="outline"
//                 className="border-green-600 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base"
//                 onClick={onClose}
//               >
//                 Close
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Right Column: MoM Preview or Form */}
//         <div className="flex-1 space-y-4 sm:space-y-6">
//           {momByMeetingId && !isFormOpen ? (
//             <>
//               {momByMeetingId.momId ? (
//                 <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
//                   <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
//                     <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
//                     Minutes of Meeting (PDF Preview)
//                   </h3>
//                   {momViewLoading ? (
//                     <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[500px]">
//                       <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 animate-spin" />
//                       <span className="mt-3 text-green-700 text-base sm:text-lg font-medium">Loading MoM PDF...</span>
//                     </div>
//                   ) : momViewError || pdfError ? (
//                     <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[500px] text-red-600">
//                       <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
//                       <p className="text-sm sm:text-base">{pdfError || momViewError}</p>
//                       {momView?.pdfUrl && (
//                         <Button
//                           variant="outline"
//                           className="mt-3 sm:mt-4 border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base"
//                           onClick={() => window.open(momView.pdfUrl, "_blank")}
//                         >
//                           <Download className="h-4 w-4 mr-2" />
//                           Try Downloading PDF
//                         </Button>
//                       )}
//                     </div>
//                   ) : momView?.pdfUrl ? (
//                     <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-md border border-green-200 overflow-auto">
//                       <Document
//                         file={momView.pdfUrl}
//                         onLoadSuccess={onDocumentLoadSuccess}
//                         onLoadError={onDocumentLoadError}
//                         className="flex flex-col items-center"
//                       >
//                         {Array.from(new Array(numPages), (el, index) => (
//                           <Page
//                             key={`page_${index + 1}`}
//                             pageNumber={index + 1}
//                             renderTextLayer={false}
//                             renderAnnotationLayer={false}
//                             className="mb-4"
//                             width={getPdfWidth()}
//                           />
//                         ))}
//                       </Document>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[500px] text-gray-600">
//                       <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
//                       <p className="text-sm sm:text-base">No PDF available for this MoM.</p>
//                     </div>
//                   )}
//                   <div className="flex flex-wrap justify-end mt-3 sm:mt-4 space-x-3">
//                     {momView?.pdfUrl && (
//                       <Button
//                         variant="outline"
//                         className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
//                         onClick={() => window.open(momView.pdfUrl, "_blank")}
//                       >
//                         <Download className="h-4 w-4 mr-2" />
//                         Download PDF
//                       </Button>
//                     )}
//                     <Button
//                       variant="outline"
//                       className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
//                       onClick={handleEditMoM}
//                     >
//                       <Edit2 className="h-4 w-4 mr-2" />
//                       Edit MoM
//                     </Button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
//                   <div className="flex flex-wrap justify-between items-center mb-3 sm:mb-4">
//                     <h3 className="text-lg sm:text-xl font-semibold text-green-800 flex items-center">
//                       <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
//                       Minutes of Meeting
//                     </h3>
//                     <Button
//                       variant="outline"
//                       className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
//                       onClick={handleEditMoM}
//                     >
//                       <Edit2 className="h-4 w-4 mr-2" />
//                       Edit MoM
//                     </Button>
//                   </div>
//                   <div className="space-y-2 sm:space-y-3 text-green-700 text-sm sm:text-base">
//                     <p className="flex items-start">
//                       <FileText className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
//                       <span><strong className="font-medium">Summary:</strong> {momByMeetingId.summary || "N/A"}</span>
//                     </p>
//                     <p className="flex items-start">
//                       <FileText className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
//                       <span><strong className="font-medium">Notes:</strong> {momByMeetingId.notes || "N/A"}</span>
//                     </p>
//                     <p className="flex items-start">
//                       <Signature className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
//                       <span><strong className="font-medium">Signature:</strong> {momByMeetingId.signature || "N/A"}</span>
//                     </p>
//                     <p className="flex items-start">
//                       <User className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
//                       <span><strong className="font-medium">Created By:</strong> {momByMeetingId.createdBy || "N/A"}</span>
//                     </p>
//                     <p className="flex items-start">
//                       <Calendar className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
//                       <span><strong className="font-medium">Meeting Date:</strong> {momByMeetingId.date || meeting?.date || "N/A"}</span>
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : isFormOpen ? (
//             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
//               <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
//                 <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
//                 {isEditMode ? "Edit Minutes of Meeting" : "Create Minutes of Meeting"}
//               </h3>
//               <div className="space-y-3 sm:space-y-4">
//                 <div>
//                   <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
//                     <FileText className="h-4 w-4 mr-2" />
//                     Agenda
//                   </Label>
//                   <Input
//                     value={momForm.agenda}
//                     onChange={(e) => handleMomFormChange(e, "agenda")}
//                     placeholder="Enter meeting agenda..."
//                     className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
//                     <Users className="h-4 w-4 mr-2" />
//                     Meeting Mode
//                   </Label>
//                   <Input
//                     value={momForm.meetingMode||"Online"}
//                     onChange={(e) => handleMomFormChange(e, "meetingMode")}
//                     placeholder="Online/In-person"
//                     className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
//                     <Clock className="h-4 w-4 mr-2" />
//                     Duration
//                   </Label>
//                   <Input
//                     value={momForm.duration}
//                     onChange={(e) => handleMomFormChange(e, "duration")}
//                     placeholder="Start time - End time"
//                     className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
//                     <Users className="h-4 w-4 mr-2" />
//                     Participants
//                   </Label>
//                   <Input
//                     value={momForm.participants}
//                     onChange={(e) => handleMomFormChange(e, "participants")}
//                     placeholder="Comma-separated names..."
//                     className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
//                     <FileText className="h-4 w-4 mr-2" />
//                     Summary
//                   </Label>
//                   <Textarea
//                     value={momForm.summary}
//                     onChange={(e) => handleMomFormChange(e, "summary")}
//                     placeholder="Enter meeting summary..."
//                     className="border-green-400 focus:ring-2 focus:ring-green-500 resize-none text-sm sm:text-base"
//                     rows={4}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
//                     <FileText className="h-4 w-4 mr-2" />
//                     Notes
//                   </Label>
//                   <Textarea
//                     value={momForm.notes}
//                     onChange={(e) => handleMomFormChange(e, "notes")}
//                     placeholder="Enter additional notes..."
//                     className="border-green-400 focus:ring-2 focus:ring-green-500 resize-none text-sm sm:text-base"
//                     rows={4}
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
//                     <Signature className="h-4 w-4 mr-2" />
//                     Signature
//                   </Label>
//                   <Input
//                     value={momForm.signature}
//                     onChange={(e) => handleMomFormChange(e, "signature")}
//                     placeholder="Enter signature..."
//                     className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
//                     <User className="h-4 w-4 mr-2" />
//                     Created By
//                   </Label>
//                   <Input
//                     value={momForm.createdBy}
//                     onChange={(e) => handleMomFormChange(e, "createdBy")}
//                     placeholder="Recorder's name..."
//                     className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap justify-end mt-3 sm:mt-6 space-x-3">
//                 <Button
//                   variant="outline"
//                   className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
//                   onClick={handleCancel}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base mt-2 sm:mt-0"
//                   onClick={handleSubmit}
//                   disabled={momByMeetingIdLoading}
//                 >
//                   {momByMeetingIdLoading ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Submitting...
//                     </>
//                   ) : isEditMode ? (
//                     "Update MoM"
//                   ) : (
//                     "Create MoM"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
//               <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
//                 <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
//                 No Minutes of Meeting Found
//               </h3>
//               <p className="text-green-700 text-sm sm:text-base">No MoM has been created for this meeting yet.</p>
//               <Button
//                 className="mt-3 sm:mt-4 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
//                 onClick={handleCreateMoM}
//               >
//                 <PlusCircle className="h-4 w-4 mr-2" />
//                 Create MoM
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MeetingDetailsWithMOM;





"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoMByMeetingId, resetMoMByMeetingId, createMoM, updateMoM, fetchMoMView } from "@/store/features/momSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, Edit2, PlusCircle, AlertCircle, Calendar, Users, Clock, FileText, Signature, User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Document, Page, pdfjs } from "react-pdf";

// Set up the PDF.js worker with a valid version
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;

function MeetingDetailsWithMOM({ isOpen, onClose, meeting, TIME_ZONE }) {
  const dispatch = useDispatch();
  const { momByMeetingId, momByMeetingIdLoading, momByMeetingIdError, momView, momViewLoading, momViewError } = useSelector((state) => state.mom);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const containerRef = useRef(null); // Ref for container to calculate width

  // Log momView for debugging
  useEffect(() => {
    console.log('momView state:', momView);
  }, [momView]);

  // Form state for creating/editing MoM
  const [momForm, setMomForm] = useState({
    agenda: meeting?.agenda || "",
    meetingMode: meeting?.meetingMode || "Online",
    duration: "",
    participants: "",
    summary: "",
    notes: "",
    signature: "",
    createdBy: "",
    meetingId: meeting?.meetingId || "",
  });

  // Helper function to format time (e.g., "10:00 AM")
  const formatTimes = (dateTime) => {
    if (!dateTime) return "";
    try {
      return format(new Date(dateTime), "p");
    } catch {
      return "";
    }
  };

  // Compute duration as "startTime - endTime"
  const getDurationString = () => {
    const start = formatTimes(meeting?.start?.dateTime);
    const end = formatTimes(meeting?.end?.dateTime);
    return start && end ? `${start} - ${end}` : "";
  };

  // Format attendees into a string
  const getAttendeesString = (attendees) => {
    if (Array.isArray(attendees)) {
      return attendees.join(", ");
    }
    return attendees ? String(attendees) : "";
  };

  // Initialize form with meeting data or MoM data
  useEffect(() => {
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
        signature: momByMeetingId.signature || "",
        createdBy: momByMeetingId.createdBy || "",
        meetingId: meeting?.meetingId || "",
      });
      setIsFormOpen(false);
      setIsEditMode(false);
      setPdfError(null);
    } else if (!momByMeetingId && !momByMeetingIdLoading) {
      setMomForm({
        agenda: meeting?.agenda || "",
        meetingMode: meeting?.meetingMode || "Online",
        duration: getDurationString() || "",
        participants: getAttendeesString(meeting?.attendees) || "",
        summary: "",
        notes: "",
        signature: "",
        createdBy: "",
        meetingId: meeting?.meetingId || "",
      });
      setIsFormOpen(true); // Show create form if no MoM exists
      setPdfError(null);
    }
  }, [momByMeetingId, momByMeetingIdLoading, meeting]);

  // Fetch MoM data when modal opens and meetingId changes
  useEffect(() => {
    if (isOpen && meeting?.meetingId) {
      dispatch(fetchMoMByMeetingId(meeting.meetingId));
    }
  }, [isOpen, meeting?.meetingId, dispatch]);

  // Fetch MoM view when momByMeetingId is available and has a momId
  useEffect(() => {
    if (isOpen && momByMeetingId?.momId && !isFormOpen) {
      dispatch(fetchMoMView(momByMeetingId.momId));
    }
  }, [isOpen, momByMeetingId?.momId, isFormOpen, dispatch]);

  // Clean up blob URL when modal closes
  useEffect(() => {
    return () => {
      if (momView?.pdfUrl) {
        URL.revokeObjectURL(momView.pdfUrl); // Prevent memory leaks
      }
    };
  }, [momView?.pdfUrl]);

  // Handle form input changes
  const handleMomFormChange = (e, field) => {
    setMomForm({ ...momForm, [field]: e.target.value });
  };

  // Handle form submission for create/update
  const handleSubmit = async () => {
    if (!momForm.createdBy.trim()) {
      toast({ title: "Error", description: "Please enter the name of the person who created the MoM.", variant: "destructive" });
      return;
    }
    if (!momForm.signature.trim()) {
      toast({ title: "Error", description: "Please enter a signature.", variant: "destructive" });
      return;
    }
    try {
      const momData = {
        ...momForm,
        participants: momForm.participants?.split(",").map((p) => p.trim()).filter(Boolean) || [],
        meetingId: meeting.meetingId,
      };
      if (isEditMode && momByMeetingId) {
        await dispatch(updateMoM(momData)).unwrap();
        toast({ title: "Success", description: "MoM updated successfully!", variant: "success" });
      } else {
        await dispatch(createMoM(momData)).unwrap();
        toast({ title: "Success", description: "MoM created successfully!", variant: "success" });
      }
      setIsFormOpen(false);
      setIsEditMode(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} MoM: ${error?.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  // Handle edit button click
  const handleEditMoM = () => {
    setIsEditMode(true);
    setIsFormOpen(true);
    setPdfError(null);
  };

  // Handle create button click
  const handleCreateMoM = () => {
    setIsEditMode(false);
    setIsFormOpen(true);
    setPdfError(null);
  };

  // Handle form cancel
  const handleCancel = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
    setPdfError(null);
  };

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfError(null);
    console.log('PDF loaded successfully, number of pages:', numPages);
  };

  // Handle PDF load error
  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setPdfError("Failed to load PDF file. Please try downloading it or contact support.");
    toast({
      title: "Error",
      description: "Unable to load the PDF. Please ensure the file is accessible and try again.",
      variant: "destructive",
    });
  };

  // Calculate responsive PDF width
  const getPdfWidth = () => {
    if (containerRef.current) {
      return Math.min(containerRef.current.offsetWidth - 32, 600); // Max 600px, account for padding
    }
    return Math.min(window.innerWidth * 0.9 - 32, 600); // Fallback to 90% of viewport
  };

  // Show loading indicator for MoM data
  if (momByMeetingIdLoading) {
    return (
      <div className="relative min-h-[300px] sm:min-h-[400px] bg-gradient-to-b from-green-50 to-white rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 animate-spin" />
          <span className="mt-3 text-green-700 text-base sm:text-lg font-medium">Loading Meeting Details...</span>
        </div>
      </div>
    );
  }
  console.log("fxf",momView);
  

  return (
    <div className="w-full max-w-[90vw] sm:max-w-5xl mx-auto p-4 sm:p-6" ref={containerRef}>
      <div className="mb-4 sm:mb-6">
        <h2 class MES="text-xl sm:text-2xl md:text-3xl text-green-800 font-semibold flex items-center">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
          {isFormOpen ? (isEditMode ? "Edit Minutes of Meeting" : "Create Minutes of Meeting") : "Meeting Details"}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {isFormOpen ? "Fill in the details to create or update the Minutes of Meeting." : "View the details and minutes of the meeting."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column: Meeting Details */}
        <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
          <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            Meeting Details
          </h3>
          <div className="space-y-2 sm:space-y-3 text-green-700 text-sm sm:text-base">
            <p className="flex items-start">
              <FileText className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <span><strong className="font-medium">Agenda:</strong> {meeting?.agenda || "N/A"}</span>
            </p>
            <p className="flex items-start">
              <Users className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <span><strong className="font-medium">Meeting Mode:</strong> {meeting?.meetingMode || "N/A"}</span>
            </p>
            <p className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <span><strong className="font-medium">Duration:</strong> {getDurationString() || "N/A"}</span>
            </p>
            <p className="flex items-start">
              <Users className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <span><strong className="font-medium">Participants:</strong> {getAttendeesString(meeting?.attendees) || "N/A"}</span>
            </p>
          </div>
          {!isFormOpen && (
            <div className="flex justify-end mt-3 sm:mt-6">
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: MoM Preview or Form */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          {momByMeetingId && !isFormOpen ? (
            <>
              {momByMeetingId.momId ? (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
                  <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    Minutes of Meeting (PDF Preview)
                  </h3>
                  {/* {momViewLoading ? (
                    <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[500px]">
                      <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 animate-spin" />
                      <span className="mt-3 text-green-700 text-base sm:text-lg font-medium">Loading MoM PDF...</span>
                    </div>
                  ) : momViewError || pdfError ? (
                    <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[500px] text-red-600">
                      <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
                      <p className="text-sm sm:text-base">{pdfError || momViewError || "Failed to load PDF file."}</p>
                      <p className="text-xs sm:text-sm mt-2">Please try downloading the PDF or contact support.</p>
                      {momView?.pdfUrl && (
                        <Button
                          variant="outline"
                          className="mt-3 sm:mt-4 border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base"
                          onClick={() => window.open(momView.pdfUrl, "_blank")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Try Downloading PDF
                        </Button>
                      )}
                    </div>
                  ) :  */}
                  {
                  momView?.pdfUrl ? (
                    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-md border border-green-200 overflow-auto">
                      <iframe src={momView?.pdfUrl} width="100%" height="100%" />
                      
                      {/* <Document
                        file={momView?.pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        className="flex flex-col items-center"
                      >
                        {Array.from(new Array(numPages), (el, index) => (
                          <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="mb-4"
                            width={getPdfWidth()}
                          />
                        ))}
                      </Document> */}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[500px] text-gray-600">
                      <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
                      <p className="text-sm sm:text-base">No PDF available for this MoM.</p>
                    </div>
                  )}











                  <div className="flex flex-wrap justify-end mt-3 sm:mt-4 space-x-3">
                    {momView?.pdfUrl && (
                      <Button
                        variant="outline"
                        className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
                        onClick={() => window.open(momView.pdfUrl, "_blank")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
                      onClick={handleEditMoM}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit MoM
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
                  <div className="flex flex-wrap justify-between items-center mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-green-800 flex items-center">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                      Minutes of Meeting
                    </h3>
                    <Button
                      variant="outline"
                      className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
                      onClick={handleEditMoM}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit MoM
                    </Button>
                  </div>
                  <div className="space-y-2 sm:space-y-3 text-green-700 text-sm sm:text-base">
                    <p className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span><strong className="font-medium">Summary:</strong> {momByMeetingId.summary || "N/A"}</span>
                    </p>
                    <p className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span><strong className="font-medium">Notes:</strong> {momByMeetingId.notes || "N/A"}</span>
                    </p>
                    <p className="flex items-start">
                      <Signature className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span><strong className="font-medium">Signature:</strong> {momByMeetingId.signature || "N/A"}</span>
                    </p>
                    <p className="flex items-start">
                      <User className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span><strong className="font-medium">Created By:</strong> {momByMeetingId.createdBy || "N/A"}</span>
                    </p>
                    <p className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span><strong className="font-medium">Meeting Date:</strong> {momByMeetingId.date || meeting?.date || "N/A"}</span>
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : isFormOpen ? (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
              <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                {isEditMode ? "Edit Minutes of Meeting" : "Create Minutes of Meeting"}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Agenda
                  </Label>
                  <Input
                    value={momForm.agenda}
                    onChange={(e) => handleMomFormChange(e, "agenda")}
                    placeholder="Enter meeting agenda..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Meeting Mode
                  </Label>
                  <Input
                    value={momForm.meetingMode || "Online"}
                    onChange={(e) => handleMomFormChange(e, "meetingMode")}
                    placeholder="Online/In-person"
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Duration
                  </Label>
                  <Input
                    value={momForm.duration}
                    onChange={(e) => handleMomFormChange(e, "duration")}
                    placeholder="Start time - End time"
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Participants
                  </Label>
                  <Input
                    value={momForm.participants}
                    onChange={(e) => handleMomFormChange(e, "participants")}
                    placeholder="Comma-separated names..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Summary
                  </Label>
                  <Textarea
                    value={momForm.summary}
                    onChange={(e) => handleMomFormChange(e, "summary")}
                    placeholder="Enter meeting summary..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 resize-none text-sm sm:text-base"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Notes
                  </Label>
                  <Textarea
                    value={momForm.notes}
                    onChange={(e) => handleMomFormChange(e, "notes")}
                    placeholder="Enter additional notes..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 resize-none text-sm sm:text-base"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <Signature className="h-4 w-4 mr-2" />
                    Signature
                  </Label>
                  <Input
                    value={momForm.signature}
                    onChange={(e) => handleMomFormChange(e, "signature")}
                    placeholder="Enter signature..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Created By
                  </Label>
                  <Input
                    value={momForm.createdBy}
                    onChange={(e) => handleMomFormChange(e, "createdBy")}
                    placeholder="Recorder's name..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-end mt-3 sm:mt-6 space-x-3">
                <Button
                  variant="outline"
                  className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base mt-2 sm:mt-0"
                  onClick={handleSubmit}
                  disabled={momByMeetingIdLoading}
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
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
              <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                No Minutes of Meeting Found
              </h3>
              <p className="text-green-700 text-sm sm:text-base">No MoM has been created for this meeting yet.</p>
              <Button
                className="mt-3 sm:mt-4 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                onClick={handleCreateMoM}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create MoM
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetingDetailsWithMOM;




"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoMByMeetingId, resetMoMByMeetingId, createMoM, updateMoM, fetchMoMView } from "@/store/features/momSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, Edit2, PlusCircle, AlertCircle, Calendar, Users, Clock, FileText, Signature, User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Document, Page, pdfjs } from "react-pdf";

// Set up the PDF.js worker with a valid version
// (Assuming pdfjs worker is configured elsewhere in your app)

function MeetingDetailsWithMOM({ isOpen, onClose, meeting, TIME_ZONE }) {
  const dispatch = useDispatch();
  const { momByMeetingId, momByMeetingIdLoading, momByMeetingIdError, momView, momViewLoading, momViewError } = useSelector((state) => state.mom);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const containerRef = useRef(null);

  // Log momView for debugging
  useEffect(() => {
    console.log('momView state:', momView);
  }, [momView]);

  // Form state for creating/editing MoM
  const [momForm, setMomForm] = useState({
    agenda: meeting?.agenda || "",
    meetingMode: meeting?.meetingMode || "Online",
    duration: "",
    participants: "",
    summary: "",
    notes: "",
    signature: "",
    createdBy: "",
    meetingId: meeting?.meetingId || "",
  });

  // Helper function to format time (e.g., "10:00 AM")
  const formatTimes = (dateTime) => {
    if (!dateTime) return "";
    try {
      return format(new Date(dateTime), "p");
    } catch {
      return "";
    }
  };

  // Compute duration as "startTime - endTime"
  const getDurationString = () => {
    const start = formatTimes(meeting?.start?.dateTime);
    const end = formatTimes(meeting?.end?.dateTime);
    return start && end ? `${start} - ${end}` : "";
  };

  // Format attendees into a string
  const getAttendeesString = (attendees) => {
    if (Array.isArray(attendees)) {
      return attendees.join(", ");
    }
    return attendees ? String(attendees) : "";
  };

  // Initialize form with meeting data or MoM data
  useEffect(() => {
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
        signature: momByMeetingId.signature || "",
        createdBy: momByMeetingId.createdBy || "",
        meetingId: meeting?.meetingId || "",
      });
      setIsFormOpen(false);
      setIsEditMode(false);
      setPdfError(null);
    } else if (!momByMeetingId && !momByMeetingIdLoading) {
      setMomForm({
        agenda: meeting?.agenda || "",
        meetingMode: meeting?.meetingMode || "Online",
        duration: getDurationString() || "",
        participants: getAttendeesString(meeting?.attendees) || "",
        summary: "",
        notes: "",
        signature: "",
        createdBy: "",
        meetingId: meeting?.meetingId || "",
      });
      setIsFormOpen(true);
      setPdfError(null);
    }
  }, [momByMeetingId, momByMeetingIdLoading, meeting]);

  // Fetch MoM data when modal opens and meetingId changes
  useEffect(() => {
    if (isOpen && meeting?.meetingId) {
      dispatch(fetchMoMByMeetingId(meeting.meetingId));
    }
  }, [isOpen, meeting?.meetingId, dispatch]);

  // Fetch MoM view when momByMeetingId is available and has a momId
  useEffect(() => {
    if (isOpen && momByMeetingId?.momId && !isFormOpen) {
      dispatch(fetchMoMView(momByMeetingId.momId));
    }
  }, [isOpen, momByMeetingId?.momId, isFormOpen, dispatch]);

  // Clean up blob URL and reset MoM state when modal closes
  useEffect(() => {
    return () => {
      if (momView?.pdfUrl) {
        URL.revokeObjectURL(momView.pdfUrl); // Prevent memory leaks
      }
      if (!isOpen) {
        dispatch(resetMoMByMeetingId()); // Reset MoM state when modal closes
      }
    };
  }, [isOpen, momView?.pdfUrl, dispatch]);

  // Handle form input changes
  const handleMomFormChange = (e, field) => {
    setMomForm({ ...momForm, [field]: e.target.value });
  };

  // Handle form submission for create/update
  const handleSubmit = async () => {
    if (!momForm.createdBy.trim()) {
      toast({ title: "Error", description: "Please enter the name of the person who created the MoM.", variant: "destructive" });
      return;
    }
    if (!momForm.signature.trim()) {
      toast({ title: "Error", description: "Please enter a signature.", variant: "destructive" });
      return;
    }
    try {
      const momData = {
        ...momForm,
        participants: momForm.participants?.split(",").map((p) => p.trim()).filter(Boolean) || [],
        meetingId: meeting.meetingId,
      };
      if (isEditMode && momByMeetingId) {
        await dispatch(updateMoM(momData)).unwrap();
        toast({ title: "Success", description: "MoM updated successfully!", variant: "success" });
      } else {
        await dispatch(createMoM(momData)).unwrap();
        toast({ title: "Success", description: "MoM created successfully!", variant: "success" });
      }
      setIsFormOpen(false);
      setIsEditMode(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} MoM: ${error?.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  // Handle edit button click
  const handleEditMoM = () => {
    setIsEditMode(true);
    setIsFormOpen(true);
    setPdfError(null);
  };

  // Handle create button click
  const handleCreateMoM = () => {
    setIsEditMode(false);
    setIsFormOpen(true);
    setPdfError(null);
  };

  // Handle form cancel
  const handleCancel = () => {
    setIsFormOpen(false);
    setIsEditMode(false);
    setPdfError(null);
  };

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfError(null);
    console.log('PDF loaded successfully, number of pages:', numPages);
  };

  // Handle PDF load error
  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setPdfError("Failed to load PDF file. Please try downloading it or contact support.");
    toast({
      title: "Error",
      description: "Unable to load the PDF. Please ensure the file is accessible and try again.",
      variant: "destructive",
    });
  };

  // Calculate responsive PDF width
  const getPdfWidth = () => {
    if (containerRef.current) {
      return Math.min(containerRef.current.offsetWidth - 32, 600);
    }
    return Math.min(window.innerWidth * 0.9 - 32, 600);
  };

  // Handle close button click
  const handleClose = () => {
    dispatch(resetMoMByMeetingId()); // Reset MoM state when close button is clicked
    onClose(); // Call the original onClose handler
  };

  // Show loading indicator for MoM data
  if (momByMeetingIdLoading) {
    return (
      <div className="relative min-h-[300px] sm:min-h-[400px] bg-gradient-to-b from-green-50 to-white rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 animate-spin" />
          <span className="mt-3 text-green-700 text-base sm:text-lg font-medium">Loading Meeting Details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[90vw] sm:max-w-5xl mx-auto p-4 sm:p-6" ref={containerRef}>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-green-800 font-semibold flex items-center">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
          {isFormOpen ? (isEditMode ? "Edit Minutes of Meeting" : "Create Minutes of Meeting") : "Meeting Details"}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          {isFormOpen ? "Fill in the details to create or update the Minutes of Meeting." : "View the details and minutes of the meeting."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column: Meeting Details */}
        <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
          <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            Meeting Details
          </h3>
          <div className="space-y-2 sm:space-y-3 text-green-700 text-sm sm:text-base">
            <p className="flex items-start">
              <FileText className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <span><strong className="font-medium">Agenda:</strong> {meeting?.agenda || "N/A"}</span>
            </p>
            <p className="flex items-start">
              <Users className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <span><strong className="font-medium">Meeting Mode:</strong> {meeting?.meetingMode || "N/A"}</span>
            </p>
            <p className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <span><strong className="font-medium">Duration:</strong> {getDurationString() || "N/A"}</span>
            </p>
            <p className="flex items-start">
              <Users className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
              <span><strong className="font-medium">Participants:</strong> {getAttendeesString(meeting?.attendees) || "N/A"}</span>
            </p>
          </div>
          {!isFormOpen && (
            <div className="flex justify-end mt-3 sm:mt-6">
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base"
                onClick={handleClose} // Use updated handleClose
              >
                Close
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: MoM Preview or Form */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          {momByMeetingId && !isFormOpen ? (
            <>
              {momByMeetingId.momId ? (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
                  <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    Minutes of Meeting (PDF Preview)
                  </h3>
                  {momView?.pdfUrl ? (
                    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-md border border-green-200 overflow-auto">
                      <iframe src={momView?.pdfUrl} width="100%" height="100%" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] sm:h-[400px] md:h-[500px] text-gray-600">
                      <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mb-2" />
                      <p className="text-sm sm:text-base">No PDF available for this MoM.</p>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-end mt-3 sm:mt-4 space-x-3">
                    {momView?.pdfUrl && (
                      <Button
                        variant="outline"
                        className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
                        onClick={() => window.open(momView.pdfUrl, "_blank")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
                      onClick={handleEditMoM}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit MoM
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
                  <div className="flex flex-wrap justify-between items-center mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-green-800 flex items-center">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                      Minutes of Meeting
                    </h3>
                    <Button
                      variant="outline"
                      className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
                      onClick={handleEditMoM}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit MoM
                    </Button>
                  </div>
                  <div className="space-y-2 sm:space-y-3 text-green-700 text-sm sm:text-base">
                    <p className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span><strong className="font-medium">Summary:</strong> {momByMeetingId.summary || "N/A"}</span>
                    </p>
                    <p className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span><strong className="font-medium">Notes:</strong> {momByMeetingId.notes || "N/A"}</span>
                    </p>
                    <p className="flex items-start">
                      <Signature className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span><strong className="font-medium">Signature:</strong> {momByMeetingId.signature || "N/A"}</span>
                    </p>
                    <p className="flex items-start">
                      <User className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span><strong className="font-medium">Created By:</strong> {momByMeetingId.createdBy || "N/A"}</span>
                    </p>
                    <p className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <span><strong className="font-medium">Meeting Date:</strong> {momByMeetingId.date || meeting?.date || "N/A"}</span>
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : isFormOpen ? (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
              <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                {isEditMode ? "Edit Minutes of Meeting" : "Create Minutes of Meeting"}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Agenda
                  </Label>
                  <Input
                    value={momForm.agenda}
                    onChange={(e) => handleMomFormChange(e, "agenda")}
                    placeholder="Enter meeting agenda..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Meeting Mode
                  </Label>
                  <Input
                    value={momForm.meetingMode || "Online"}
                    onChange={(e) => handleMomFormChange(e, "meetingMode")}
                    placeholder="Online/In-person"
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Duration
                  </Label>
                  <Input
                    value={momForm.duration}
                    onChange={(e) => handleMomFormChange(e, "duration")}
                    placeholder="Start time - End time"
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Participants
                  </Label>
                  <Input
                    value={momForm.participants}
                    onChange={(e) => handleMomFormChange(e, "participants")}
                    placeholder="Comma-separated names..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Summary
                  </Label>
                  <Textarea
                    value={momForm.summary}
                    onChange={(e) => handleMomFormChange(e, "summary")}
                    placeholder="Enter meeting summary..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 resize-none text-sm sm:text-base"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Notes
                  </Label>
                  <Textarea
                    value={momForm.notes}
                    onChange={(e) => handleMomFormChange(e, "notes")}
                    placeholder="Enter additional notes..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 resize-none text-sm sm:text-base"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <Signature className="h-4 w-4 mr-2" />
                    Signature
                  </Label>
                  <Input
                    value={momForm.signature}
                    onChange={(e) => handleMomFormChange(e, "signature")}
                    placeholder="Enter signature..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label className="text-green-600 font-medium text-sm sm:text-base flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Created By
                  </Label>
                  <Input
                    value={momForm.createdBy}
                    onChange={(e) => handleMomFormChange(e, "createdBy")}
                    placeholder="Recorder's name..."
                    className="border-green-400 focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-end mt-3 sm:mt-6 space-x-3">
                <Button
                  variant="outline"
                  className="border-green-400 text-green-700 hover:bg-green-100 hover:text-green-800 text-sm sm:text-base mt-2 sm:mt-0"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base mt-2 sm:mt-0"
                  onClick={handleSubmit}
                  disabled={momByMeetingIdLoading}
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
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-green-100">
              <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                No Minutes of Meeting Found
              </h3>
              <p className="text-green-700 text-sm sm:text-base">No MoM has been created for this meeting yet.</p>
              <Button
                className="mt-3 sm:mt-4 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                onClick={handleCreateMoM}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create MoM
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetingDetailsWithMOM;