

'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { createQuotation } from '@/store/features/quotationSlice'; // Adjust path to your slice
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';

// Zod schema for validation, aligned with Mongoose QuotationSchema
const itemSchema = z.object({
  serviceName: z.string().min(1, 'Service name is required'),
  basePrice: z.coerce.number().gt(0, 'Base price must be greater than 0'),
  sellPrice: z.coerce.number().gt(0, 'Sell price must be greater than 0'),
});

const quotationSchema = z.object({
  projectTitle: z.string().min(1, 'Project title is required'),
  scopeOfWork: z.string().min(1, 'Scope of work is required'),
  deliverables: z.string().min(1, 'Deliverables are required'),
  timeline: z.string().min(1, 'Timeline is required'),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
  taxPercent: z.coerce.number().min(0, 'Tax percentage cannot be negative'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  termsAndConditions: z.string().min(1, 'Terms and conditions are required'),
});

export default function CreateQuotationForm() {
  const dispatch = useDispatch();
  const [staticData, setStaticData] = useState({
    clientDetails: {
      name: 'Mr. Rakesh Sharma',
      company: 'XYZ Traders Pvt. Ltd.',
      email: 'rakesh.sharma@xyztraders.com',
      phone: '+91-9876543210',
    },
    serviceProviderDetails: {
      companyName: 'Blueprint IT Solutions Pvt. Ltd.',
      email: 'hello@blueprintitsolutions.com',
      phone: '+91-9123456780',
      website: 'www.blueprintitsolutions.com',
      gstin: '27AABCU9603R1ZM',
    },
    preparedBy: {
      name: 'Chinmaya Pradhan',
      designation: 'Business Consultant',
      email: 'chinmaya@blueprintitsolutions.com',
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      projectTitle: '',
      scopeOfWork: '',
      deliverables: '',
      timeline: '',
      items: [{ serviceName: '', basePrice: '', sellPrice: '' }],
      taxPercent: '',
      paymentTerms: '',
      termsAndConditions: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const taxPercent = watch('taxPercent');

  // Calculate totals based on sellPrice
  const subtotal = items.reduce((acc, item) => acc + Number(item.sellPrice || 0), 0);
  const taxAmount = (subtotal * Number(taxPercent || 0)) / 100;
  const total = subtotal + taxAmount;

  const onSubmit = async (data) => {
    try {
      const quotationData = {
        ...data,
        clientDetails: staticData.clientDetails,
        serviceProviderDetails: staticData.serviceProviderDetails,
        preparedBy: staticData.preparedBy,
        createdBy: 'admin@example.com', // Adjust based on auth system
        updatedBy: 'admin@example.com', // Adjust based on auth system
      };
      const result = await dispatch(createQuotation(quotationData)).unwrap();
      // Handle PDF download if the backend returns a PDF buffer
      if (result.pdfBuffer) {
        const blob = new Blob([result.pdfBuffer], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `quotation.pdf`; // Generic name since quotationNumber is removed
        link.click();
        window.URL.revokeObjectURL(url);
      }
      alert('Quotation created successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error creating quotation.');
    }
  };

  return (
    <Card className="mx-auto max-w-5xl p-10 shadow-2xl border border-gray-100 rounded-2xl bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-8">
        <CardTitle className="text-4xl font-extrabold text-gray-900 tracking-tight">Create Quotation</CardTitle>
        <CardDescription className="text-gray-600 text-base mt-2">
          Enter project details to generate a professional quotation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Static Client Details (Read-Only) */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Client Details</h3>
            <div className="grid grid-cols-2 gap-8 bg-gray-100 p-6 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-600">Client Name</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.clientDetails.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Company</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.clientDetails.company}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.clientDetails.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Phone</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.clientDetails.phone}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200 h-px" />

          {/* Static Service Provider Details (Read-Only) */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Service Provider Details</h3>
            <div className="grid grid-cols-2 gap-8 bg-gray-100 p-6 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-600">Company Name</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.serviceProviderDetails.companyName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.serviceProviderDetails.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Phone</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.serviceProviderDetails.phone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Website</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.serviceProviderDetails.website}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">GSTIN</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.serviceProviderDetails.gstin}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200 h-px" />

          {/* Static Prepared By (Read-Only) */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Prepared By</h3>
            <div className="grid grid-cols-3 gap-8 bg-gray-100 p-6 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-600">Name</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.preparedBy.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Designation</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.preparedBy.designation}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{staticData.preparedBy.email}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200 h-px" />

          {/* Project Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Project Details</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Project Title</Label>
                <Input
                  {...register('projectTitle')}
                  placeholder="Enter project title"
                  className="mt-1 border-gray-300 focus:ring-blue-600 focus:border-blue-600 rounded-md shadow-sm"
                />
                {errors.projectTitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectTitle.message}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Scope of Work</Label>
                <Textarea
                  {...register('scopeOfWork')}
                  placeholder="Enter scope of work"
                  className="mt-1 border-gray-300 focus:ring-blue-600 focus:border-blue-600 rounded-md shadow-sm"
                />
                {errors.scopeOfWork && (
                  <p className="text-red-500 text-sm mt-1">{errors.scopeOfWork.message}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Deliverables</Label>
                <Textarea
                  {...register('deliverables')}
                  placeholder="Enter deliverables"
                  className="mt-1 border-gray-300 focus:ring-blue-600 focus:border-blue-600 rounded-md shadow-sm"
                />
                {errors.deliverables && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliverables.message}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Timeline</Label>
                <Input
                  {...register('timeline')}
                  placeholder="Enter timeline"
                  className="mt-1 border-gray-300 focus:ring-blue-600 focus:border-blue-600 rounded-md shadow-sm"
                />
                {errors.timeline && (
                  <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200 h-px" />

          {/* Quotation Items */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Quotation Items</h3>
            <div className="space-y-4">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Input
                    placeholder="Service Name"
                    {...register(`items.${index}.serviceName`)}
                    className="flex-1 border-gray-300 focus:ring-blue-600 focus:border-blue-600 rounded-md shadow-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Base Price"
                    {...register(`items.${index}.basePrice`)}
                    className="w-32 border-gray-300 focus:ring-blue-600 focus:border-blue-600 rounded-md shadow-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Sell Price"
                    {...register(`items.${index}.sellPrice`)}
                    className="w-32 border-gray-300 focus:ring-blue-600 focus:border-blue-600 rounded-md shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ serviceName: '', basePrice: '', sellPrice: '' })}
                variant="outline"
                className="mt-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>
            {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items.message}</p>}
          </div>

          <Separator className="bg-gray-200 h-px" />

          {/* Totals */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex justify-between text-gray-700 text-base">
              <span>Subtotal:</span>
              <span className="font-semibold">INR {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-base mt-2">
              <span>Tax ({taxPercent || 0}%):</span>
              <span className="font-semibold">INR {taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-xl mt-3">
              <span>Total:</span>
              <span>INR {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Tax Percent */}
          <div>
            <Label className="text-sm font-medium text-gray-600">Tax Percent</Label>
            <Input
              type="number"
              {...register('taxPercent')}
              placeholder="Enter tax percent"
              className="mt-1 w-24 border-gray-300 focus:ring-blue-600 focus:border-blue-600 rounded-md shadow-sm"
            />
            {errors.taxPercent && (
              <p className="text-red-500 text-sm mt-1">{errors.taxPercent.message}</p>
            )}
          </div>

          <Separator className="bg-gray-200 h-px" />

          {/* Payment Terms */}
          <div>
            <Label className="text-sm font-medium text-gray-600">Payment Terms</Label>
            <Textarea
              {...register('paymentTerms')}
              placeholder="Enter payment terms"
              className="mt-1 border-gray-300 focus:ring-blue-600 focus:border-blue-600 rounded-md shadow-sm"
            />
            {errors.paymentTerms && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentTerms.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <Label className="text-sm font-medium text-gray-600">Terms and Conditions</Label>
            <Textarea
              {...register('termsAndConditions')}
              placeholder="Enter terms and conditions"
              className="mt-1 border-gray-300 focus:ring-blue-600 focus:border-blue-600 rounded-md shadow-sm"
            />
            {errors.termsAndConditions && (
              <p className="text-red-500 text-sm mt-1">{errors.termsAndConditions.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-lg shadow-md transition-all duration-300"
          >
            Submit Quotation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}