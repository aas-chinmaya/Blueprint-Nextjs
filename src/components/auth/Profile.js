'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserByEmail } from "@/store/features/userSlice";

// Importing Lucide icons
import { Phone, Mail, Briefcase, Calendar, Users, DollarSign, GenderMale, MapPin } from 'lucide-react';

export default function ProfileDetails() {
  const dispatch = useDispatch();
  const { user, email } = useSelector(state => state.auth) || {};
  const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {};

  useEffect(() => {
    dispatch(fetchUserByEmail());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Profile Card */}
      <Card className="max-w-3xl mx-auto  shadow-lg rounded-lg">
        <CardHeader className="flex items-center gap-4 p-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userData?.profilePicture || "/Avatar.png"} alt={userData?.fullName || "User"} />
            <AvatarFallback>{userData?.fullName?.split(" ").map(n => n[0]).join("") || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-white text-2xl font-semibold">{userData?.fullName || "Loading..."}</CardTitle>
            <p className="text-white text-sm">{userData?.role || "Loading..."}</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  <Mail className="h-5 w-5 text-blue-500 inline mr-2" />
                  Email
                </TableCell>
                <TableCell>{userData?.email || "Loading..."}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  <Phone className="h-5 w-5 text-green-500 inline mr-2" />
                  Contact
                </TableCell>
                <TableCell>{userData?.contact || "Loading..."}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  <Briefcase className="h-5 w-5 text-yellow-500 inline mr-2" />
                  Designation
                </TableCell>
                <TableCell>{employeeData?.designation || "Loading..."}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  <Users className="h-5 w-5 text-purple-500 inline mr-2" />
                  Department
                </TableCell>
                <TableCell>{employeeData?.department || "Loading..."}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  <Calendar className="h-5 w-5 text-red-500 inline mr-2" />
                  Joining Date
                </TableCell>
                <TableCell>{employeeData?.joiningDate ? new Date(employeeData.joiningDate).toLocaleDateString() : "Loading..."}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  <DollarSign className="h-5 w-5 text-teal-500 inline mr-2" />
                  CTC
                </TableCell>
                <TableCell>{employeeData?.ctc ? `₹${employeeData.ctc.toLocaleString()}` : "Loading..."}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  Gender
                </TableCell>
                <TableCell>{employeeData?.gender || "Loading..."}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-gray-700">
                  <MapPin className="h-5 w-5 text-indigo-500 inline mr-2" />
                  Location
                </TableCell>
                <TableCell>{userData?.location || "Loading..."}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}







