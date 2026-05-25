import { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent
} from "@heroui/modal";
import type { NextPage } from 'next';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardBody } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@heroui/table";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";
import { Chip } from "@heroui/chip";
import { Trash2, UserCog, ChevronDown } from 'lucide-react';

type User = {
  id: number;
  full_name: string;
  email: string;
  role: 'admin' | 'student';
};

const AdminUsersPage: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { token, isLoading: isAuthLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isRoleChangeDialogOpen, setIsRoleChangeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'student' | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!token || !user || user.role !== 'admin') {
      setIsLoading(false);
      setError('You are not authorized to view this page.');
      return;
    }

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await api.get('/users', token);
        setUsers(fetchedUsers.data || fetchedUsers);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch users.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token, user, isAuthLoading]);

  const confirmRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    const userId = selectedUser.id;
    const oldUsers = [...users];

    setIsLoading(true);
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      await api.put(`/users/${userId}`, { role: newRole }, token || undefined);
      console.log(`Changed user ${userId} to ${newRole}`);
    } catch (err: unknown) {
      console.error('Error updating role:', err);
      setUsers(oldUsers);
      alert(`Failed to update role: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
      setIsRoleChangeDialogOpen(false);
      setSelectedUser(null);
      setNewRole(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    const userId = selectedUser.id;
    const oldUsers = [...users];

    setIsLoading(true);
    setUsers(prev => prev.filter(u => u.id !== userId));

    try {
      await api.delete(`/users/${userId}`, token || undefined);
      console.log(`Deleted user ${userId}`);
    } catch (err: unknown) {
      console.error('Error deleting user:', err);
      setUsers(oldUsers);
      alert(`Failed to delete user: ${err instanceof Error ? err.message : "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  if (isLoading && !users.length) {
    return (
      <div className="p-4 md:p-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-[#f5f7fb] min-h-screen">

    {/* PAGE HEADER */}

    <div className="mb-6">

      <h1 className="text-3xl font-bold tracking-tight text-[#1e293b]">
        Manage Users
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        Manage platform users, roles and permissions
      </p>

    </div>

    {/* MAIN CARD */}

    <Card className="bg-white border border-gray-200 rounded-2xl shadow-md">

      <CardBody>

        {users.length === 0 ? (

          <div className="text-center text-gray-500 py-10">
            No users found.
          </div>

        ) : (

          <div className="overflow-hidden rounded-2xl border border-gray-200">

            <Table
              aria-label="Users table"
              removeWrapper
            >

              <TableHeader>

                <TableColumn>Full Name</TableColumn>

                <TableColumn>Email</TableColumn>

                <TableColumn>Role</TableColumn>

                <TableColumn className="text-right">
                  Actions
                </TableColumn>

              </TableHeader>

              <TableBody>

                {users.map((user) => (

                  <TableRow key={user.id}>

                    {/* NAME */}

                    <TableCell className="font-medium text-[#0f172a]">
                      {user.full_name}
                    </TableCell>

                    {/* EMAIL */}

                    <TableCell className="text-gray-600">
                      {user.email}
                    </TableCell>

                    {/* ROLE */}

                    <TableCell>

                      <Chip
                        className={`
                          font-medium
                          ${
                            user.role === 'admin'
                              ? 'bg-[#d1fae5] text-[#065f46]'
                              : 'bg-orange-100 text-orange-700'
                          }
                        `}
                      >
                        {user.role}
                      </Chip>

                    </TableCell>

                    {/* ACTIONS */}

                    <TableCell className="flex justify-end gap-2">

                      {/* CHANGE ROLE */}

                      <Dropdown>

                        <DropdownTrigger>

                          <Button
                            variant="light"
                            size="sm"
                            className="bg-[#f8fafc] border border-gray-200 rounded-xl hover:bg-gray-100"
                          >

                            <UserCog className="h-4 w-4 mr-1 text-[#0f766e]" />

                            Change Role

                            <ChevronDown className="h-4 w-4 ml-1" />

                          </Button>

                        </DropdownTrigger>

                        <DropdownMenu
                          aria-label="Change role"
                          onAction={(key) => {
                            setSelectedUser(user);
                            setNewRole(
                              key as 'admin' | 'student'
                            );
                            setIsRoleChangeDialogOpen(true);
                          }}
                        >

                          <DropdownItem key="admin">
                            Admin
                          </DropdownItem>

                          <DropdownItem key="student">
                            Student
                          </DropdownItem>

                        </DropdownMenu>

                      </Dropdown>

                      {/* DELETE */}

                      <Button
                        variant="light"
                        size="sm"
                        className="bg-red-50 border border-red-100 rounded-xl hover:bg-red-100"
                        onPress={() => {
                          setSelectedUser(user);
                          setIsDeleteDialogOpen(true);
                        }}
                      >

                        <Trash2 className="h-4 w-4 text-red-500" />

                      </Button>

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </div>

        )}

      </CardBody>

    </Card>

    {/* ROLE CHANGE MODAL */}

    <Modal
      isOpen={isRoleChangeDialogOpen}
      onOpenChange={setIsRoleChangeDialogOpen}
      className="bg-[#f8fafc] border border-gray-200 rounded-3xl shadow-2xl p-2"
    >

      <ModalContent className="rounded-3xl">

        <ModalHeader className="flex flex-col">

          <h1 className="text-2xl font-bold text-[#1e293b]">
            Confirm Role Change
          </h1>

          <p className="text-sm text-gray-500">
            Update the role and permissions of this user
          </p>

        </ModalHeader>

        <ModalBody>

          <p className="text-gray-700 leading-relaxed">

            Are you sure you want to change the role of{" "}

            <strong className="text-[#0f172a]">
              {selectedUser?.full_name}
            </strong>

            {" "}to{" "}

            <strong className="text-[#0f766e]">
              {newRole}
            </strong>

            ?

          </p>

        </ModalBody>

        <ModalFooter>

          <Button
            type="button"
            variant="bordered"
            className="border-gray-300 rounded-xl"
            onPress={() =>
              setIsRoleChangeDialogOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            className="bg-[#0f766e] hover:bg-[#115e59] text-white rounded-xl shadow-md"
            isLoading={isLoading}
            onPress={confirmRoleChange}
          >
            {isLoading ? "Updating..." : "Confirm"}
          </Button>

        </ModalFooter>

      </ModalContent>

    </Modal>

    {/* DELETE MODAL */}

    <Modal
      isOpen={isDeleteDialogOpen}
      onOpenChange={setIsDeleteDialogOpen}
      className="bg-[#f8fafc] border border-gray-200 rounded-3xl shadow-2xl p-2"
    >

      <ModalContent className="rounded-3xl">

        <ModalHeader className="flex flex-col">

          <h1 className="text-2xl font-bold text-[#1e293b]">
            Confirm Delete
          </h1>

          <p className="text-sm text-gray-500">
            This action cannot be undone
          </p>

        </ModalHeader>

        <ModalBody>

          <p className="text-gray-700 leading-relaxed">

            Are you sure you want to delete{" "}

            <strong className="text-[#0f172a]">
              {selectedUser?.full_name}
            </strong>

            ?

          </p>

        </ModalBody>

        <ModalFooter>

          <Button
            type="button"
            variant="bordered"
            className="border-gray-300 rounded-xl"
            onPress={() =>
              setIsDeleteDialogOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md"
            isLoading={isLoading}
            onPress={confirmDeleteUser}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>

        </ModalFooter>

      </ModalContent>

    </Modal>

  </div>
  );
};

export default AdminUsersPage;