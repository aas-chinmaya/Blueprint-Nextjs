
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  addService,
  getServiceById,
  updateService,
  deleteService
} from "@/store/features/master/serviceMasterSlice";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus,
         Eye,
         Tag,
        Trash2,  } from "lucide-react";

export default function Service() {
  const dispatch = useDispatch();
  const { services, selectedService } = useSelector((state) => state.services); // services slice
  const { toast } = useToast();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);



  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
  });
const handleReset = () => {
  setFormData({ name: "", description: "", basePrice: "" });
  setSelectedServiceId(null);
};

  // Load services on component mount
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Handle view service
    const handleViewService = (serviceId) => {
      dispatch(getServiceById(serviceId));
      setIsViewModalOpen(true);
    };

  // Open edit modal
  const openEditModal = (serviceId) => {
  dispatch(getServiceById(serviceId)).then((res) => {
    if (res.payload) {
      setFormData({
        name: res.payload.name || "",
        description: res.payload.description || "",
        basePrice: res.payload.basePrice || "",
      });
      setSelectedServiceId(serviceId);
      setIsEditModalOpen(true);
    }
  });
};
 // Handle update
 const handleUpdate = () => {
  if (selectedServiceId && formData.name && formData.description && formData.basePrice) {
    dispatch(updateService({
      id: selectedServiceId,
      name: formData.name,
      description: formData.description,
      basePrice: formData.basePrice
    }))
      .unwrap()
      .then(() => {
        toast({
          title: "Service Updated",
          description: "The service was updated successfully.",
        });
        setIsEditModalOpen(false);
        dispatch(fetchServices());
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err?.message || "Failed to update service",
          variant: "destructive",
        });
      });
  }
};

  

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   await dispatch(addService(formData));
  //   setFormData({ name: "", description: "", basePrice: "" });
  //   document.getElementById("close-modal-btn")?.click();
  // };



const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await dispatch(addService(formData)).unwrap();
    toast({
      title: "Service Added",
      description: "The service was added successfully.",
      variant: "default", // or "success" if using variants
    });
    setFormData({ name: "", description: "", basePrice: "" });
    document.getElementById("close-modal-btn")?.click();
    dispatch(fetchServices()); // Optional: refresh list
  } catch (err) {
    toast({
      title: "Error",
      description: err?.message || "Failed to add service",
      variant: "destructive", 
    });
  }
};

  return (
    <div>
      {/* Add Service Modal  */}
      <div className="flex justify-end mb-4">
        <Dialog  onOpenChange={(isOpen) => {
    if (!isOpen) handleReset();
  }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Service
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-green-800 font-bold text-2xl">Add New Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-green-600">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-green-600">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-green-600">Base Price</label>
                <Input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                
                </DialogClose>
                <Button type="submit" className="bg-green-600 text-white">
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* View Service Modal */}
      <div className="flex justify-end mb-4">
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-green-800 font-bold text-2xl">Service Details</DialogTitle>
            </DialogHeader>
            {selectedService ? (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-green-600">Name</label>
                  <p className="text-gray-700">{selectedService.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-green-600">Description</label>
          <p className="text-gray-700">{selectedService.description}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-green-600">Base Price</label>
          <p className="text-gray-700">{selectedService.basePrice}</p>
        </div>
      </div>
    ) : (
      <p className="text-gray-500 mt-4">Loading...</p>
    )}
    
  </DialogContent>
      </Dialog>
      </div>
      {/* Edit Service Modal */}
      <div className="flex justify-end mb-4">
        <Dialog open={isEditModalOpen}
  onOpenChange={(isOpen) => {
    setIsEditModalOpen(isOpen);
    if (!isOpen) handleReset();
  }}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-green-800 font-bold text-2xl">Edit Service</DialogTitle>
            </DialogHeader>
            {selectedService ? (
              <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-green-600">Name</label>
                  <Input
                    name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-green-600">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-green-600">Base Price</label>
          <Input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            required
          />
        </div>
        <DialogFooter className="gap-2">
          
          <Button
           onClick={handleUpdate}
              // disabled={!newStatus}
          className="bg-green-600 text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    ) : (
      <p className="text-gray-500 mt-4">Loading...</p>
    )}
  </DialogContent>
</Dialog>

        </div>
      {/* Delete Confirmation Modal */}
      <div className="flex justify-end mb-4">
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
    </DialogHeader>
    <div className="py-4">
      <p className="text-gray-700">
        Are you sure you want to delete this service?
      </p>
    </div>
    <DialogFooter className="gap-2">
      <DialogClose asChild>
        <Button variant="outline" onClick={() => setServiceToDelete(null)}>
          Cancel
        </Button>
      </DialogClose>
      <Button
        className="bg-red-600 text-white"
        onClick={() => {
          if (serviceToDelete) {
            dispatch(deleteService(serviceToDelete))
              .unwrap()
              .then(() => {
                toast({
                  title: "Deleted",
                  description: "Service deleted successfully.",
                  variant: "default",
                });
                dispatch(fetchServices()); // refresh list
              })
              .catch((err) => {
                toast({
                  title: "Error",
                  description: err?.message || "Failed to delete service",
                  variant: "destructive",
                });
              })
              .finally(() => {
                setIsDeleteConfirmOpen(false);
                setServiceToDelete(null);
              });
          }
        }}
      >
        Yes, Delete
      </Button>
    </DialogFooter>
  </DialogContent>
      </Dialog>
      </div>

      {/* Service Table */}
      <div className="bg-white rounded-lg border border-green-200 overflow-hidden min-h-[75vh]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-green-600">
              <TableRow className="border-0">
                <TableHead className="w-36 text-center text-white font-semibold py-3 text-sm">S.No.</TableHead>
                <TableHead className="text-center text-white font-semibold py-3 text-sm">ID</TableHead>
                <TableHead className="text-center text-white font-semibold py-3 min-w-[150px] text-sm">Title</TableHead>
                <TableHead className="text-center text-white font-semibold py-3 min-w-[100px] text-sm">Description</TableHead>
                <TableHead className="text-center text-white font-semibold py-3 min-w-[90px] text-sm">Base Price</TableHead>
                <TableHead className="w-36 text-center text-white font-semibold py-3 text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service, index) => (
                <TableRow key={service.serviceId}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{service.serviceId}</TableCell>
                  <TableCell className="text-center">{service.name}</TableCell>
                  <TableCell className="text-center">{service.description}</TableCell>
                  <TableCell className="text-center">{service.basePrice}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button className="border-green-500 text-green-700 hover:bg-green-100"
                      title="View"
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewService(service.serviceId)}
                      >
                        <Eye className="h-4 w-4"/>
                      </Button>
                      <Button className="border-green-500 text-green-700 hover:bg-green-100"
                      title="Edit"
                      variant="outline"
                      size="icon"
                      onClick={() => openEditModal(service.serviceId)}
                      >
                           <Tag className="h-4 w-4"/>
                      </Button>
                      <Button className="border-green-500 text-green-700 hover:bg-green-100"
                      title="Delete"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                            setServiceToDelete(service.serviceId); 
                            setIsDeleteConfirmOpen(true);
                      }
  }
                      >
                          <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

