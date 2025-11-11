import React, { useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import Pagination from "../../components/Pagination";
import TableHeader from "../../components/TableHeader";
import PopupModal from "../../components/PopupModel";
import { Loader } from "../../components/Loader";
import { handleSuccessToast } from "../../helpers/AsyncHandler";
import {
  useDeleteUserAccount,
  useGetUsers,
  useCreateUserAccount,
  useUpdateUserAccount,
} from "../../hooks/auth";
import UserAssistantPopUp from "../../components/UserAssistantPopUp";
import GenericFormModal from "../../components/forms/FormPopup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
const usersPerPage = 5;

function Users() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isUsersError,
  } = useGetUsers();

  const { mutate: createUser } = useCreateUserAccount();
  const { mutate: updateUser } = useUpdateUserAccount();
  const { mutate: deleteUser } = useDeleteUserAccount();

  const filteredUsers =
    users?.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  const addUser = () => {
    setIsEditing(false);
    setEditUser(null);
    setShowUserModal(true);
  };

  const submitForm = async (data) => {
    if (isEditing && editUser?.id) {
      updateUser(
        { id: editUser.id, data },
        {
          onSuccess: () => {
            toast.success("User updated successfully");
          },
        }
      );
    } else {
      createUser(data, {
        onSuccess: () => {
          toast.success("User created successfully");
        },
      });
    }

    setShowUserModal(false);
    setEditUser(null);
    setIsEditing(false);
  };

  const handleDeleteUser = async (userId) => {
    deleteUser(userId, {
      onSuccess: (res) => {
        handleSuccessToast(res, "User deleted successfully");
        setShowDeleteModal(false);
      },
    });
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setIsEditing(true);
    setShowUserModal(true);
  };

  const getFormFields = () => {
    const baseFields = [
      [
        {
          label: "Name",
          name: "name",
          type: "input",
          placeholder: "Enter name",
          required: true,
        },
        {
          label: "Email",
          name: "email",
          type: "input",
          placeholder: "Enter email",
          required: true,
        },
      ],
      [
        {
          label: "Role",
          name: "role",
          type: "select",
          options: [
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
          ],
          required: true,
        },
      ],
    ];

    if (!isEditing) {
      baseFields.splice(1, 0, [
        {
          label: "Password",
          name: "password",
          type: "input",
          placeholder: "Enter password",
          required: true,
        },
      ]);
    }

    return baseFields;
  };

  return (
    <div className="space-y-8 p-10">
      <TableHeader
        Headeing="Users Table"
        ButtonText="Create User"
        showButton={true}
        onButtonClick={addUser}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-64 shadow-inner focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoadingUsers ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 italic">
            <Loader />
          </div>
        ) : isUsersError ? (
          <div className="flex items-center justify-center h-[300px] text-red-500 italic">
            Error loading users. Please try again.
          </div>
        ) : (
          <table className="table-auto min-w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-primary/10 text-primary uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3 pl-10">View</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition "
                  >
                    <td className="px-5 py-3">
                      {(page - 1) * usersPerPage + index + 1}
                    </td>
                    <td className="px-5 py-3 font-medium">{user.name}</td>
                    <td className="px-5 py-3">{user.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        className="px-3 py-2 rounded-md border border-gray-300 bg-white shadow-xs focus:outline-none transition-all cursor-pointer outline-none border-none"
                        onChange={(e) => {
                          const path = e.target.value;
                          if (path) navigate(path);
                        }}
                      >
                        <option value="">Select View</option>
                        <option value={`/admin/user_assistant/${user?.id}`}>
                          Assistant View
                        </option>
                        <option value={`/admin/user_lead/${user?.id}`}>
                          Lead View
                        </option>
                        <option value={`/admin/user_phone/${user?.id}`}>
                          Phone Number View
                        </option>
                      </select>
                    </td>
                    <td
                      className="px-5 py-3"
                    >
                      <div className="flex items-center gap-3 text-gray-500">
                        <button
                          className="text-primary transition cursor-pointer hover:text-primary-dark"
                          onClick={() => handleEditClick(user)}
                        >
                          <TbEdit size={18} />
                        </button>
                        <button
                          className="text-red-600 transition cursor-pointer hover:text-red-800"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedUserId(user.id);
                          }}
                        >
                          <TbTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {!isLoadingUsers && !isUsersError && paginatedUsers.length !== 0 && (
        <Pagination
          currentPage={page}
          totalItems={filteredUsers.length}
          itemsPerPage={usersPerPage}
          onPageChange={setPage}
        />
      )}

      {showUserModal && (
        <GenericFormModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setIsEditing(false);
            setEditUser(null);
          }}
          title={isEditing ? "Edit User" : "Create User"}
          onSubmit={submitForm}
          initialValues={isEditing ? editUser : {}}
          fields={getFormFields()}
          width="lg"
        />
      )}

      <PopupModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        content="Are you sure you want to delete this user? This action cannot be undone."
        onPrimaryButtonClick={() => {
          handleDeleteUser(selectedUserId);
          setShowDeleteModal(false);
          setSelectedUserId(null);
        }}
        onSecondaryButtonClick={() => {
          setShowDeleteModal(false);
          setSelectedUserId(null);
        }}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        primaryButtonVariant="danger"
      />
    </div>
  );
}

export default Users;
