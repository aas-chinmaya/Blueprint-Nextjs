"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCauses,
  updateCauseStatusById,
  clearCauseState,
} from "@/store/features/causeSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Eye, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

// Component: CauseDashboard
function CauseDashboard() {
  const dispatch = useDispatch();
  const { allCauses, loading, error, submittedData } = useSelector((state) => state.cause);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCause, setSelectedCause] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const causesPerPage = 5;

  // Pagination calculations
  const indexOfLastCause = currentPage * causesPerPage;
  const indexOfFirstCause = indexOfLastCause - causesPerPage;
  const currentCauses = allCauses.slice(indexOfFirstCause, indexOfLastCause);
  const totalPages = Math.ceil(allCauses.length / causesPerPage);

  // Effect: Fetch all causes on mount
  useEffect(() => {
    dispatch(getAllCauses());

    // Cleanup on unmount
    return () => {
      dispatch(clearCauseState());
    };
  }, [dispatch]);

  // Effect: Handle errors and success messages
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
        className: "bg-rose-100 text-rose-800 border-rose-300 animate-fade-in",
      });
    }
    if (submittedData) {
      toast({
        title: "Success",
        description: "Cause status updated successfully!",
        variant: "success",
        className: "bg-emerald-100 text-emerald-800 border-emerald-300 animate-fade-in",
      });
    }
  }, [error, submittedData]);

  // Handler: Open modal with cause details
  const handleViewCause = (cause) => {
    setSelectedCause(cause);
    setNewStatus(cause.status || "Pending");
    setIsModalOpen(true);
  };

  // Handler: Update cause status
  const handleUpdateStatus = async () => {
    if (!selectedCause || !newStatus) return;
    try {
      await dispatch(
        updateCauseStatusById({ id: selectedCause._id, status: newStatus })
      ).unwrap();
      setIsModalOpen(false);
      setSelectedCause(null);
      setNewStatus("");
      dispatch(getAllCauses()); // Refresh the list
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to update status: ${err.message || "Unknown error"}`,
        variant: "destructive",
        className: "bg-rose-100 text-rose-800 border-rose-300 animate-fade-in",
      });
    }
  };

  // Handler: Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCause(null);
    setNewStatus("");
  };

  // Handler: Change page
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Loading state
  if (loading && !allCauses.length) {
    return (
      <div className="min-h-[400px] bg-gradient-to-br from-emerald-50 to-slate-50 rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
          <span className="mt-4 text-emerald-700 text-lg font-semibold">
            Loading Causes...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-800 flex items-center">
          <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 mr-3" />
          Cause Dashboard
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          View and manage all causes for delayed Minutes of Meeting.
        </p>
      </div>

      {/* Causes Table */}
      <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-emerald-50">
              <TableHead className="text-emerald-800 font-semibold py-3 sm:py-4 text-xs sm:text-sm">
                Meeting ID
              </TableHead>
              <TableHead className="text-emerald-800 font-semibold py-3 sm:py-4 text-xs sm:text-sm">
                Reason
              </TableHead>
              <TableHead className="text-emerald-800 font-semibold py-3 sm:py-4 text-xs sm:text-sm">
                Submitted By
              </TableHead>
              <TableHead className="text-emerald-800 font-semibold py-3 sm:py-4 text-xs sm:text-sm">
                Status
              </TableHead>
              <TableHead className="text-emerald-800 font-semibold py-3 sm:py-4 text-xs sm:text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCauses.length > 0 ? (
              currentCauses.map((cause) => (
                <TableRow
                  key={cause._id}
                  className="hover:bg-emerald-50 transition-colors duration-200"
                >
                  <TableCell className="text-slate-700 text-xs sm:text-sm py-3 sm:py-4">
                    {cause.meetingId}
                  </TableCell>
                  <TableCell className="text-slate-700 text-xs sm:text-sm py-3 sm:py-4">
                    {cause.reason.length > 50
                      ? `${cause.reason.substring(0, 50)}...`
                      : cause.reason}
                  </TableCell>
                  <TableCell className="text-slate-700 text-xs sm:text-sm py-3 sm:py-4">
                    {cause.submittedBy}
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cause.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : cause.status === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {cause.status || "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 text-xs sm:text-sm"
                      onClick={() => handleViewCause(cause)}
                    >
                      <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-600 py-6 text-sm sm:text-base"
                >
                  No causes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {allCauses.length > causesPerPage && (
        <div className="flex items-center justify-between mt-4 sm:mt-6">
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 text-xs sm:text-sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
            Previous
          </Button>
          <div className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 text-xs sm:text-sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1 sm:ml-2" />
          </Button>
        </div>
      )}

      {/* View/Update Modal */}
      {selectedCause && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[90vw] md:max-w-[600px] bg-white rounded-xl border border-emerald-200 p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-semibold text-emerald-800 flex items-center">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                Cause Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <Label className="text-emerald-700 font-semibold text-sm sm:text-base">
                  Meeting ID
                </Label>
                <Input
                  value={selectedCause.meetingId}
                  readOnly
                  className="mt-1 border-emerald-300 bg-slate-50 text-slate-700 text-sm sm:text-base focus:ring-0 cursor-not-allowed"
                />
              </div>
              <div>
                <Label className="text-emerald-700 font-semibold text-sm sm:text-base">
                  Reason
                </Label>
                <Textarea
                  value={selectedCause.reason}
                  readOnly
                  className="mt-1 border-emerald-300 bg-slate-50 text-slate-700 text-sm sm:text-base resize-none focus:ring-0 cursor-not-allowed"
                  rows={4}
                />
              </div>
              <div>
                <Label className="text-emerald-700 font-semibold text-sm sm:text-base">
                  Submitted By
                </Label>
                <Input
                  value={selectedCause.submittedBy}
                  readOnly
                  className="mt-1 border-emerald-300 bg-slate-50 text-slate-700 text-sm sm:text-base focus:ring-0 cursor-not-allowed"
                />
              </div>
              <div>
                <Label className="text-emerald-700 font-semibold text-sm sm:text-base">
                  Status
                </Label>
                <Select
                  value={newStatus}
                  onValueChange={setNewStatus}
                  className="mt-1"
                >
                  <SelectTrigger className="border-emerald-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-sm sm:text-base">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 text-sm sm:text-base"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600 text-white transition-all duration-200 text-sm sm:text-base"
                onClick={handleUpdateStatus}
                disabled={loading || !newStatus}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default CauseDashboard;



