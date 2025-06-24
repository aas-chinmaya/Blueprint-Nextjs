// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { MessageSquare, Tag, CheckCircle, UserIcon, CalendarIcon, Trash2, Pencil } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createMoM, updateMoM, deleteMoM } from '@/store/features/momSlice';
// import { toast } from '@/components/ui/use-toast';
// import { format } from 'date-fns';

// const MoMDetailsModal = ({ isOpen, onClose, meeting, TIME_ZONE }) => {
//   const dispatch = useDispatch();
//   const { mom, momLoading, momError } = useSelector((state) => state.mom);
//   const [isEditing, setIsEditing] = useState(false);
//   const [momForm, setMomForm] = useState({
//     id: '',
//     summary: '',
//     actionItems: [{ task: '', assignee: '', dueDate: '' }],
//     decisions: [''],
//     recordedBy: '',
//     recordedDate: format(new Date(), 'yyyy-MM-dd', { timeZone: TIME_ZONE }),
//   });

//   useEffect(() => {
//     if (mom && meeting?.meetingId === mom.meetingId) {
//       setMomForm({
//         id: mom.id || '',
//         summary: mom.summary || '',
//         actionItems: mom.actionItems?.length ? [...mom.actionItems] : [{ task: '', assignee: '', dueDate: '' }],
//         decisions: mom.decisions?.length ? [...mom.decisions] : [''],
//         recordedBy: mom.recordedBy || '',
//         recordedDate: mom.recordedDate || format(new Date(), 'yyyy-MM-dd', { timeZone: TIME_ZONE }),
//       });
//     } else {
//       setMomForm({
//         id: `MOM-${Math.random().toString(36).substr(2, 9)}`,
//         summary: '',
//         actionItems: [{ task: '', assignee: '', dueDate: '' }],
//         decisions: [''],
//         recordedBy: '',
//         recordedDate: format(new Date(), 'yyyy-MM-dd', { timeZone: TIME_ZONE }),
//       });
//     }
//   }, [mom, meeting, TIME_ZONE]);

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

//   const addActionItem = () => {
//     setMomForm({
//       ...momForm,
//       actionItems: [...momForm.actionItems, { task: '', assignee: '', dueDate: '' }],
//     });
//   };

//   const addDecision = () => {
//     setMomForm({ ...momForm, decisions: [...momForm.decisions, ''] });
//   };

//   const handleMomSubmit = async () => {
//     try {
//       if (mom && !isEditing) {
//         // If MoM exists and not editing, do nothing
//         return;
//       }
//       if (isEditing && mom) {
//         await dispatch(updateMoM({ meetingId: meeting.meetingId, momData: momForm })).unwrap();
//         toast.success('MoM updated successfully!');
//       } else {
//         await dispatch(createMoM({ meetingId: meeting.meetingId, momData: momForm })).unwrap();
//         toast.success('MoM created successfully!');
//       }
//       setIsEditing(false);
//       onClose();
//     } catch (error) {
//       toast.error('Failed to save MoM.');
//       console.error('Error saving MoM:', error);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await dispatch(deleteMoM(meeting.meetingId)).unwrap();
//       toast.success('MoM deleted successfully!');
//       setIsEditing(false);
//       onClose();
//     } catch (error) {
//       toast.error('Failed to delete MoM.');
//       console.error('Error deleting MoM:', error);
//     }
//   };

//   const toggleEdit = () => {
//     setIsEditing(!isEditing);
//   };

//   const hasMom = mom && meeting?.meetingId === mom.meetingId;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-green-800">
//             {hasMom ? (isEditing ? 'Edit Minutes of Meeting' : 'View Minutes of Meeting') : 'Create Minutes of Meeting'}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4 p-6">
//           {momError && (
//             <div className="text-red-600">{momError}</div>
//           )}
//           <div>
//             <Label className="text-green-800 font-medium flex items-center">
//               <MessageSquare className="h-5 w-5 mr-2" /> Summary
//             </Label>
//             {hasMom && !isEditing ? (
//               <p className="text-green-700 p-2">{momForm.summary || 'N/A'}</p>
//             ) : (
//               <textarea
//                 value={momForm.summary}
//                 onChange={(e) => handleMomFormChange(e, 'summary')}
//                 placeholder="Enter meeting summary..."
//                 className="w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md p-2"
//                 rows={4}
//                 disabled={hasMom && !isEditing}
//               />
//             )}
//           </div>
//           <div>
//             <Label className="text-green-800 font-medium flex items-center">
//               <Tag className="h-5 w-5 mr-2" /> Action Items
//             </Label>
//             {momForm.actionItems.map((item, index) => (
//               <div key={index} className="space-y-2 mt-2">
//                 {hasMom && !isEditing ? (
//                   <div className="text-green-700">
//                     <p>Task: {item.task || 'N/A'}</p>
//                     <p>Assignee: {item.assignee || 'None'}</p>
//                     <p>Due Date: {item.dueDate || 'N/A'}</p>
//                   </div>
//                 ) : (
//                   <>
//                     <Input
//                       name="task"
//                       value={item.task}
//                       onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
//                       placeholder="Task description"
//                       className="border-green-300 focus:border-green-500 focus:ring-green-500"
//                       disabled={hasMom && !isEditing}
//                     />
//                     <Input
//                       name="assignee"
//                       value={item.assignee}
//                       onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
//                       placeholder="Assignee"
//                       className="border-green-300 focus:border-green-500 focus:ring-green-500"
//                       disabled={hasMom && !isEditing}
//                     />
//                     <Input
//                       name="dueDate"
//                       type="date"
//                       value={item.dueDate}
//                       onChange={(e) => handleMomFormChange(e, 'actionItems', index)}
//                       className="border-green-300 focus:border-green-500 focus:ring-green-500"
//                       disabled={hasMom && !isEditing}
//                     />
//                   </>
//                 )}
//               </div>
//             ))}
//             {(isEditing || !hasMom) && (
//               <Button
//                 variant="outline"
//                 className="mt-2 border-green-300 text-green-700 hover:bg-green-50"
//                 onClick={addActionItem}
//                 disabled={hasMom && !isEditing}
//               >
//                 Add Action Item
//               </Button>
//             )}
//           </div>
//           <div>
//             <Label className="text-green-800 font-medium flex items-center">
//               <CheckCircle className="h-5 w-5 mr-2" /> Decisions
//             </Label>
//             {momForm.decisions.map((decision, index) => (
//               <div key={index} className="mt-2">
//                 {hasMom && !isEditing ? (
//                   <p className="text-green-700">{decision || 'N/A'}</p>
//                 ) : (
//                   <Input
//                     value={decision}
//                     onChange={(e) => handleMomFormChange(e, 'decisions', index)}
//                     placeholder="Decision description"
//                     className="border-green-300 focus:border-green-500 focus:ring-green-500"
//                     disabled={hasMom && !isEditing}
//                   />
//                 )}
//               </div>
//             ))}
//             {(isEditing || !hasMom) && (
//               <Button
//                 variant="outline"
//                 className="mt-2 border-green-300 text-green-700 hover:bg-green-50"
//                 onClick={addDecision}
//                 disabled={hasMom && !isEditing}
//               >
//                 Add Decision
//               </Button>
//             )}
//           </div>
//           <div>
//             <Label className="text-green-800 font-medium flex items-center">
//               <UserIcon className="h-5 w-5 mr-2" /> Recorded By
//             </Label>
//             {hasMom && !isEditing ? (
//               <p className="text-green-700 p-2">{momForm.recordedBy || 'N/A'}</p>
//             ) : (
//               <Input
//                 value={momForm.recordedBy}
//                 onChange={(e) => handleMomFormChange(e, 'recordedBy')}
//                 placeholder="Recorder's name..."
//                 className="mt-2 border-green-300 focus:border-green-500 focus:ring-green-500"
//                 disabled={hasMom && !isEditing}
//               />
//             )}
//           </div>
//           <div>
//             <Label className="text-green-800 font-medium flex items-center">
//               <CalendarIcon className="h-5 w-5 mr-2" /> Recorded Date
//             </Label>
//             {hasMom && !isEditing ? (
//               <p className="text-green-700 p-2">{momForm.recordedDate || 'N/A'}</p>
//             ) : (
//               <Input
//                 type="date"
//                 value={momForm.recordedDate}
//                 onChange={(e) => handleMomFormChange(e, 'recordedDate')}
//                 className="mt-2 border-green-300 focus:border-green-500 focus:ring-green-500"
//                 disabled={hasMom && !isEditing}
//               />
//             )}
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               className="border-green-300 text-green-700 hover:bg-green-50"
//               onClick={onClose}
//             >
//               Close
//             </Button>
//             {hasMom && !isEditing && (
//               <>
//                 <Button
//                   className="text-green-600 hover:text-green-800 hover:bg-green-100"
//                   onClick={toggleEdit}
//                 >
//                   <Pencil className="h-4 w-4 mr-2" />
//                   Edit
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={handleDelete}
//                   disabled={momLoading}
//                 >
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete
//                 </Button>
//               </>
//             )}
//             {(isEditing || !hasMom) && (
//               <Button
//                 className="bg-green-700 hover:bg-green-800 text-white"
//                 onClick={handleMomSubmit}
//                 disabled={momLoading}
//               >
//                 {momLoading ? 'Saving...' : (isEditing ? 'Update MoM' : 'Create MoM')}
//               </Button>
//             )}
//           </DialogFooter>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default MoMDetailsModal;





import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Tag, Clock, Users, UserIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createMoM, updateMoM, deleteMoM } from '@/store/features/momSlice';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const MoMDetailsModal = ({ isOpen, onClose, meeting, TIME_ZONE }) => {
  const dispatch = useDispatch();
  const { mom, momLoading, momError } = useSelector((state) => state.mom);
  const [isEditing, setIsEditing] = useState(false);
  const [momForm, setMomForm] = useState({
    meetingId: '',
    agenda: '',
    meetingMode: '',
    duration: '',
    participants: [''],
    summary: '',
    notes: '',
    createdBy: '',
  });

  useEffect(() => {
    if (mom && meeting?.meetingId === mom.meetingId) {
      setMomForm({
        meetingId: mom.meetingId || meeting.meetingId || '',
        agenda: mom.agenda || meeting.agenda || meeting.description || '',
        meetingMode: mom.meetingMode || (meeting.hangoutLink ? 'Online' : 'In-person'),
        duration: mom.duration || (meeting.start && meeting.end 
          ? Math.round((new Date(meeting.end.dateTime) - new Date(meeting.start.dateTime)) / 60000)
          : ''),
        participants: mom.participants?.length 
          ? [...mom.participants] 
          : meeting.attendees?.map(attendee => attendee.email) || [''],
        summary: mom.summary || '',
        notes: mom.notes || '',
        createdBy: mom.createdBy || meeting.organizer?.email || '',
      });
    } else {
      setMomForm({
        meetingId: meeting?.meetingId || `MOM-${Math.random().toString(36).substr(2, 9)}`,
        agenda: meeting?.agenda || meeting.description || '',
        meetingMode: meeting.hangoutLink ? 'Online' : 'In-person',
        duration: meeting.start && meeting.end 
          ? Math.round((new Date(meeting.end.dateTime) - new Date(meeting.start.dateTime)) / 60000)
          : '',
        participants: meeting.attendees?.map(attendee => attendee.email) || [''],
        summary: '',
        notes: '',
        createdBy: meeting.organizer?.email || '',
      });
    }
  }, [mom, meeting, TIME_ZONE]);

  const handleMomFormChange = (e, field) => {
    setMomForm({ ...momForm, [field]: e.target.value });
  };

  const handleMomSubmit = async () => {
    try {
      if (mom && !isEditing) {
        return;
      }
      const momData = {
        meetingId: momForm.meetingId,
        agenda: momForm.agenda,
        meetingMode: momForm.meetingMode,
        duration: parseInt(momForm.duration) || 0,
        participants: momForm.participants,
        summary: momForm.summary,
        notes: momForm.notes,
        createdBy: momForm.createdBy,
      };
      if (isEditing && mom) {
        await dispatch(updateMoM({ meetingId: meeting.meetingId, momData })).unwrap();
        toast.success('MoM updated successfully!');
      } else {
        await dispatch(createMoM({ meetingId: meeting.meetingId, momData })).unwrap();
        toast.success('MoM created successfully!');
      }
      setIsEditing(false);
      onClose();
    } catch (error) {
      toast.error('Failed to save MoM.');
      console.error('Error saving MoM:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteMoM(meeting.meetingId)).unwrap();
      toast.success('MoM deleted successfully!');
      setIsEditing(false);
      onClose();
    } catch (error) {
      toast.error('Failed to delete MoM.');
      console.error('Error deleting MoM:', error);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const hasMom = mom && meeting?.meetingId === mom.meetingId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 border-b border-green-200">
          <DialogTitle className="text-green-800 text-2xl font-bold">
            {hasMom ? (isEditing ? 'Edit Minutes of Meeting' : 'View Minutes of Meeting') : 'Create Minutes of Meeting'}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {momError && (
            <div className="col-span-full text-red-600 bg-red-50 p-4 rounded-md">{momError}</div>
          )}
          <div className="space-y-4">
            <div>
              <Label className="text-green-800 font-medium flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" /> Meeting ID
              </Label>
              <Input
                value={momForm.meetingId}
                disabled
                className="border-green-300 focus:border-green-500 focus:ring-green-500 bg-gray-100"
              />
            </div>
            <div>
              <Label className="text-green-800 font-medium flex items-center">
                <Tag className="h-5 w-5 mr-2" /> Agenda
              </Label>
              <textarea
                value={momForm.agenda}
                disabled
                className="w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md p-2 bg-gray-100"
                rows={4}
              />
            </div>
            <div>
              <Label className="text-green-800 font-medium flex items-center">
                <Tag className="h-5 w-5 mr-2" /> Meeting Mode
              </Label>
              <Input
                value={momForm.meetingMode}
                disabled
                className="border-green-300 focus:border-green-500 focus:ring-green-500 bg-gray-100"
              />
            </div>
            <div>
              <Label className="text-green-800 font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2" /> Duration (minutes)
              </Label>
              <Input
                type="number"
                value={momForm.duration}
                disabled
                className="border-green-300 focus:border-green-500 focus:ring-green-500 bg-gray-100"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-green-800 font-medium flex items-center">
                <Users className="h-5 w-5 mr-2" /> Participants
              </Label>
              {momForm.participants.map((participant, index) => (
                <Input
                  key={index}
                  value={participant}
                  disabled
                  className="mt-2 border-green-300 focus:border-green-500 focus:ring-green-500 bg-gray-100"
                />
              ))}
            </div>
            <div>
              <Label className="text-green-800 font-medium flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" /> Summary
              </Label>
              {hasMom && !isEditing ? (
                <p className="text-green-700 p-2 bg-green-50 rounded-md">{momForm.summary || 'N/A'}</p>
              ) : (
                <textarea
                  value={momForm.summary}
                  onChange={(e) => handleMomFormChange(e, 'summary')}
                  placeholder="Enter meeting summary..."
                  className="w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md p-2"
                  rows={4}
                />
              )}
            </div>
            <div>
              <Label className="text-green-800 font-medium flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" /> Notes
              </Label>
              {hasMom && !isEditing ? (
                <p className="text-green-700 p-2 bg-green-50 rounded-md">{momForm.notes || 'N/A'}</p>
              ) : (
                <textarea
                  value={momForm.notes}
                  onChange={(e) => handleMomFormChange(e, 'notes')}
                  placeholder="Enter additional notes..."
                  className="w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md p-2"
                  rows={4}
                />
              )}
            </div>
            <div>
              <Label className="text-green-800 font-medium flex items-center">
                <UserIcon className="h-5 w-5 mr-2" /> Created By
              </Label>
              {hasMom && !isEditing ? (
                <p className="text-green-700 p-2 bg-green-50 rounded-md">{momForm.createdBy || 'N/A'}</p>
              ) : (
                <Input
                  value={momForm.createdBy}
                  onChange={(e) => handleMomFormChange(e, 'createdBy')}
                  placeholder="Enter recorder's name or email..."
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                />
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 border-t border-green-200">
          <Button
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50"
            onClick={onClose}
          >
            Close
          </Button>
          {hasMom && !isEditing && (
            <>
              <Button
                className="text-green-600 hover:text-green-800 hover:bg-green-100"
                onClick={toggleEdit}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={momLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
          {(isEditing || !hasMom) && (
            <Button
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={handleMomSubmit}
              disabled={momLoading}
            >
              {momLoading ? 'Saving...' : (isEditing ? 'Update MoM' : 'Create MoM')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoMDetailsModal;