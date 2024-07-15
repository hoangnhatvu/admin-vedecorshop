import React, { useState, useEffect } from "react";

import PageTitle from "app/components/Typography/PageTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
  Input,
  Label,
  Select,
} from "@roketid/windmill-react-ui";
import {
  EditIcon,
  TrashIcon,
  SearchIcon,
  ForbiddenIcon,
  UnlockIcon,
  LockIcon,
} from "icons";
import Layout from "app/containers/Layout";
import { User } from "app/types/user";
import { getUsers, updateUserForAdmin } from "pages/api/userApis";
import { toast } from "react-toastify";
import Modals from "app/components/Modals";
import Loader from "app/components/Loader/Loader";

function Account() {
  const [listUser, setListUser] = useState<User[]>([]);
  // const [totalCount, setTotalCount] = useState<number>(0);
  // const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User>();

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const loadData = async () => {
    try {
      setIsLoading(true);
      const responseResults = await getUsers();
      setListUser(responseResults.data);
    } catch (error: any) {
      const messages = error.response.data.message;
      if (Array.isArray(messages)) {
        toast.error(messages.join("\n"));
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (id: string, updatedToken: string) => {
    try {
      setIsLoading(true);
      const data = {
        role: role,
        updated_token: updatedToken,
      };
      await updateUserForAdmin(id, data);
      closeModal();
      loadData();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <PageTitle>Tài khoản</PageTitle>
      <div className="flex justify-start flex-1 mb-4 lg:mr-32">
        <div className="relative w-full max-w-sm mr-2 focus-within:text-purple-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder="Tìm kiếm tài khoản"
            aria-label="Search"
          />
        </div>
        <Button>Tìm kiếm</Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Tài khoản</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tham gia</TableCell>
                  <TableCell>Hành động</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {listUser.map((user, i) => (
                  <>
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Avatar
                            className="hidden mr-3 md:block"
                            src={process.env.APP_API_URL + user.user_image}
                            alt="User avatar"
                          />
                          <div>
                            <p className="font-semibold">{user.user_name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.role}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          type={
                            user.is_blocked
                              ? "danger"
                              : user.is_active
                              ? "success"
                              : "warning"
                          }
                        >
                          {user.is_blocked
                            ? "Bị khóa"
                            : user.is_active
                            ? "Đã kích hoạt"
                            : "Chưa kích hoạt"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(user.created_date).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Button
                            layout="link"
                            size="small"
                            aria-label="Edit"
                            onClick={() => {
                              openModal();
                              setCurrentUser(user);
                            }}
                          >
                            <EditIcon className="w-5 h-5" aria-hidden="true" />
                          </Button>
                          {user.is_blocked ? (
                            <Button
                              layout="link"
                              size="small"
                              aria-label="Unlock"
                            >
                              <UnlockIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </Button>
                          ) : (
                            <Button
                              layout="link"
                              size="small"
                              aria-label="Lock"
                            >
                              <LockIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={2}
                resultsPerPage={2}
                onChange={() => {}}
                label="Account navigation"
              />
            </TableFooter>
          </TableContainer>
          {currentUser && (
            <Modals
              isModalOpen={isModalOpen}
              buttonText="Xác nhận"
              onCloseModal={closeModal}
              onSubmit={() =>
                handleSubmit(currentUser.id, currentUser.updated_token)
              }
            >
              <Label className="mt-4">
                <span>Vai trò</span>
                <Select
                  className="mt-4"
                  value={role ? role : currentUser.role}
                  onChange={handleRoleChange}
                >
                  <option>admin</option>
                  <option>employee</option>
                  <option>user</option>
                </Select>
              </Label>
            </Modals>
          )}
        </>
      )}
    </Layout>
  );
}

export default Account;
