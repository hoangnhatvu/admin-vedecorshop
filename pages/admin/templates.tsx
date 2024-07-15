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
  Select,
  Label,
} from "@roketid/windmill-react-ui";
import { EditIcon, TrashIcon, SearchIcon, ForbiddenIcon } from "icons";
import Layout from "app/containers/Layout";
import { toast } from "react-toastify";
import Loader from "app/components/Loader/Loader";
import { formatCurrency } from "utils/formatCurrency";
import { useForm, Controller } from "react-hook-form";
import { getTemplates } from "pages/api/templateApis";
import AddTemplateModal from "app/components/Template/AddTemplateModal";

export interface IFilterForm {
  searchText: string;
  optionSort: string;
  is_actived: string;
}

function Template() {
  const [listTemplate, setListTemplate] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    control: controlForm,
    setValue: setValueForm,
    watch: watchForm,
    formState: { errors: errorsForm },
  } = useForm<IFilterForm>({ mode: "onChange" });

  const optionsStatusTemplate = [
    { id: "", value: "Tất cả" },
    { id: "true", value: "Đang hoạt động" },
    { id: "false", value: "Dừng hoạt động" },
  ];

  const optionsOrderTemplate = [
    { id: "", value: "Mặc định" },
    { id: "crated_date", value: "Ngày tạo" },
    { id: "popular", value: "Thiết kế phổ biến" },
  ];

  const optionsNumberRow = [
    { id: 10, value: 10 },
    { id: 15, value: 15 },
    { id: 20, value: 20 },
  ];

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const loadData = async (bodyData: any) => {
    try {
      setIsLoading(true);
      const responseResults = await getTemplates(currentPage, limit, bodyData);
      setListTemplate(responseResults.data);
      setTotalCount(responseResults.totalCount);
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

  const handleSubmit = () => {
    const formValues = watchForm();

    let bodyData = {};

    if (formValues.is_actived !== "" && formValues.is_actived) {
      bodyData = { ...bodyData, is_actived: formValues.is_actived };
    }
    if (formValues.optionSort !== "" && formValues.optionSort) {
      bodyData = { ...bodyData, optionSort: formValues.optionSort };
    }
    if (formValues.searchText !== "" && formValues.searchText) {
      bodyData = { ...bodyData, searchText: formValues.searchText };
    }

    loadData(bodyData);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    handleSubmit();
    return () => {
      setListTemplate([]);
    };
  }, [currentPage]);

  return (
    <Layout>
      <PageTitle>Mẫu thiết kế</PageTitle>
      <div className="flex justify-between mb-4">
        <div className="flex flex-1">
          <div className="relative w-full max-w-sm mr-2 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Controller
              name="searchText"
              control={controlForm}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={field.onChange}
                  className="pl-8 text-gray-700"
                  placeholder="Tìm kiếm sản phẩm"
                />
              )}
            />
          </div>
          <Button onClick={handleSubmit}>Tìm kiếm</Button>
        </div>
        <Button onClick={openModal}>Thêm thiết kế</Button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex items-center w-full max-w-52 mr-8">
          <Label className="mr-4">Trạng thái</Label>
          <Controller
            name="is_actived"
            control={controlForm}
            defaultValue={optionsStatusTemplate[0]?.id}
            render={({ field }) => (
              <Select
                {...field}
                onChange={(selectedOptions) => {
                  field.onChange(selectedOptions);
                  handleSubmit();
                }}
                className="flex flex-1 relative w-full max-w-52"
              >
                {optionsStatusTemplate.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
        <div className="flex items-center w-full max-w-md mr-8">
          <Label className="mr-4">Sắp xếp theo</Label>
          <Controller
            name="optionSort"
            control={controlForm}
            defaultValue={optionsStatusTemplate[0]?.id}
            render={({ field }) => (
              <Select
                {...field}
                onChange={(selectedOptions) => {
                  field.onChange(selectedOptions);
                  handleSubmit();
                }}
                className="flex flex-1 relative w-full max-w-md"
              >
                {optionsOrderTemplate.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>

        <div className="flex items-center w-full max-w-36">
          <Label className="mr-4">Số dòng</Label>
          <Select
            className="flex flex-1 relative w-full max-w-36"
            onChange={(selectedOptions) => {
              setLimit(selectedOptions.target.value as number | any);
              handleSubmit();
            }}
          >
            {optionsNumberRow.map((option) => (
              <option key={option.id} value={option.id}>
                {option.value}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Thiết kế</TableCell>
              <TableCell>Số lượt xem</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Hành động</TableCell>
            </tr>
          </TableHeader>
          {isLoading ? (
            <Loader />
          ) : (
            <TableBody>
              {listTemplate.map((template, i) => (
                <>
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="hidden mr-3 md:block"
                          src={template.template_image}
                          alt="Product image"
                        />
                        <div>
                          <p className="font-semibold">
                            {template.template_name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{template.view_number}</span>
                    </TableCell>
                    <TableCell>
                      <Badge type={template.is_actived ? "success" : "danger"}>
                        {template.is_actived
                          ? "Đang hoạt động"
                          : "Dừng hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(template.created_date).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button layout="link" size="small" aria-label="Edit">
                          <EditIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <Button layout="link" size="small" aria-label="Delete">
                          <TrashIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          )}
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalCount}
            resultsPerPage={limit}
            onChange={handleChangePage}
            label="Product navigation"
          />
        </TableFooter>
      </TableContainer>
      <AddTemplateModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        loadDataTemplate={loadData}
      />
    </Layout>
  );
}

export default Template;
