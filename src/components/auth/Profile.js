'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserByEmail } from "@/store/features/userSlice";

// Icons
import {
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Users,
  DollarSign,
  MapPin,
} from "lucide-react";

export default function ProfileDetails() {
  const dispatch = useDispatch();
  const { user, email } = useSelector((state) => state.auth) || {};
  const { userData, employeeData } = useSelector((state) => state.user) || {};

  useEffect(() => {
    dispatch(fetchUserByEmail());
  }, [dispatch]);

  return (
    <div className="container mx-auto py-10 space-y-10">
      {/* Top Profile Card */}
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-green-950 to-green-600 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6">
          {/* Avatar + Info */}
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage src={userData?.profilePicture || "/Avatar.png"} />
              <AvatarFallback className="text-black">
                {userData?.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                   .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{userData?.fullName || "Loading..."}</h2>
              <p className="text-sm">{userData?.role || "Employee"}</p>
              <p className="text-sm opacity-80">{userData?.email || "Email not available"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <Card className="shadow-xl border rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <InfoRow icon={<Mail className="text-blue-500" />} label="Email" value={userData?.email} />
              <InfoRow icon={<Phone className="text-green-500" />} label="Contact" value={userData?.contact} />
              <InfoRow icon={<Briefcase className="text-yellow-500" />} label="Designation" value={employeeData?.designation} />
              <InfoRow icon={<Users className="text-purple-500" />} label="Department" value={employeeData?.department} />
              <InfoRow icon={<Calendar className="text-red-500" />} label="Joining Date" value={employeeData?.joiningDate ? new Date(employeeData.joiningDate).toLocaleDateString() : "Not available"} />
              <InfoRow icon={<DollarSign className="text-emerald-500" />} label="CTC" value={employeeData?.ctc ? `₹${employeeData.ctc.toLocaleString()}` : "Not available"} />
            </TableBody>
          </Table>
        </CardContent>
      </Card>

     
    </div>
  );
}

// Reusable info row
function InfoRow({ icon, label, value }) {
  return (
    <TableRow>
      <TableCell className="font-medium text-gray-700">
        <span className="inline-flex items-center gap-2">
          {icon}
          {label}
        </span>
      </TableCell>
      <TableCell>{value || "Loading..."}</TableCell>
    </TableRow>
  );
}
