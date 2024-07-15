import React, { useEffect, useState } from "react";
import Modals from "../Modals";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import {
  Label,
  Textarea,
  Select,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  Button,
  Input,
} from "@roketid/windmill-react-ui";
import { TagsInput } from "react-tag-input-component";
import { getCategories } from "pages/api/categoryApis";
import { createOption } from "pages/api/optionApis";
import { createProduct } from "pages/api/productApis";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

interface IProductModal {
  isModalOpen: boolean;
  closeModal: () => void;
  loadDataProduct: ({}) => void;
}

interface IOption {
  color: string;
  size: string;
  image: File | any;
  price: number;
  stock: number;
  discount: number;
  isActived: boolean | any;
}

interface IOptionForm {
  data: IOption[];
}

interface IProductForm {
  productName: string;
  productImage: File | any;
  product3d: File | any;
  product3dText: string;
  category: string;
  description: string;
  isActived: boolean | any;
  options: Array<string>;
}

interface ISelectCategory {
  id: string;
  value: string;
}

const AddProductModal: React.FC<IProductModal> = ({
  isModalOpen,
  closeModal,
  loadDataProduct,
}) => {
  const {
    register: registerProductForm,
    handleSubmit: handleSubmitProductForm,
    control: controlProductForm,
    setValue: setValueProductForm,
    watch: watchProductForm,
    formState: { errors: errorsProductForm },
  } = useForm<IProductForm>({ mode: "onChange" });

  const {
    control: controlProductOption,
    setValue: setValueProductOption,
    watch: watchProductOption,
    formState: { errors: errorsProductOption },
  } = useForm<IOptionForm>({ mode: "onChange" });

  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [optionsCategory, setOptionsCategory] = useState<ISelectCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const responseResults = await getCategories();
      setOptionsCategory(
        responseResults.data.map((item: any) => {
          return { id: item.id, value: item.category_name };
        })
      );
    } catch (error) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitOption = () => {
    if (colors.length > 0 && sizes.length === 0) {
      const variants = colors.flatMap((color) => ({
        color: color,
        size: "",
      }));
      setTableData([...variants]);
    } else if (sizes.length > 0 && colors.length === 0) {
      const variants = sizes.flatMap((size) => ({
        color: "",
        size: size,
      }));
      setTableData([...variants]);
    } else if (sizes.length > 0 && colors.length > 0) {
      const variants = colors.flatMap((color) =>
        sizes.map((size) => ({
          color: color,
          size: size,
        }))
      );
      setTableData([...variants]);
    }
  };

  const onSubmit = async (data: IProductForm) => {
    try {
      setIsLoading(true);
      const optionsData = watchProductOption("data");
      const listOptions: string[] = [];

      await Promise.all(
        optionsData.map(async (element, index) => {
          const optionDataToSend = new FormData();

          if (element.image) {
            optionDataToSend.append("option_image", element.image);
          }
          if (element.color) {
            optionDataToSend.append("color", element.color);
          }
          if (element.size) {
            optionDataToSend.append("size", element.size);
          }
          optionDataToSend.append("price", `${element.price}`);
          optionDataToSend.append("discount_rate", `${element.discount}`);
          optionDataToSend.append("stock", `${element.stock}`);
          optionDataToSend.append("is_actived", String(element.isActived));

          const responseResult = await createOption(optionDataToSend);
          listOptions.push(responseResult.id);
        })
      );

      const productDataToSend = new FormData();
      productDataToSend.append("category", data.category);
      productDataToSend.append("product_name", data.productName);
      if (data.productImage) {
        productDataToSend.append("product_image", data.productImage);
      }
      if (data.product3d) {
        productDataToSend.append("product_3d", data.product3d);
      }
      productDataToSend.append("description", data.description);
      productDataToSend.append("is_actived", String(data.isActived));

      listOptions.forEach((element, index) => {
        productDataToSend.append(`options[${index}]`, element);
      });

      await createProduct(productDataToSend);
      closeModal();
      loadDataProduct({});
      toast.success("Thêm sản phẩm thành công !");
    } catch (error: any | AxiosError) {
      if (error.response) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          toast.error(messages.join("\n"));
        } else {
          toast.error(error.response.data.message);
        }
      } else if (error.request) {
        toast.error("Không có response trả về !");
      } else {
        toast.error("Có lỗi xảy ra !");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Modals
        isModalOpen={isModalOpen}
        buttonText="Thêm sản phẩm"
        onCloseModal={closeModal}
        onSubmit={handleSubmitProductForm(onSubmit)}
      >
        <form
          onSubmit={handleSubmitProductForm(onSubmit)}
          className="overflow-auto"
        >
          <h2 className="text-2xl font-bold mb-4">Thêm sản phẩm</h2>
          <div className="flex justify-between">
            <div className="flex-col w-full">
              <Label>
                <span>Tên sản phẩm</span>
                <Controller
                  name="productName"
                  control={controlProductForm}
                  defaultValue=""
                  rules={{ required: "Đây là trường bắt buộc !" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      onChange={field.onChange}
                      className="w-full"
                      placeholder="Nhập tên sản phẩm"
                    />
                  )}
                />
                <span className="text-red-400">
                  {errorsProductForm.productName?.message}
                </span>
              </Label>

              <Label className="mt-4">
                <span>Loại sản phẩm</span>
                <Controller
                  name="category"
                  control={controlProductForm}
                  rules={{ required: "Đây là trường bắt buộc !" }}
                  defaultValue={optionsCategory[0]?.id}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions);
                      }}
                      className="mt-1"
                    >
                      {optionsCategory.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.value}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                <span className="text-red-400">
                  {errorsProductForm.category?.message}
                </span>
              </Label>
            </div>

            <Label>
              <div className="pl-12">
                <span>Ảnh sản phẩm</span>
                <Image
                  src={
                    watchProductForm("productImage")
                      ? URL.createObjectURL(watchProductForm("productImage"))
                      : "/assets/img/NoImage.svg.png"
                  }
                  alt="Product Image"
                  width={110}
                  height={110}
                  className="cursor-pointer rounded-lg"
                />
                <label htmlFor={"productImage"}>
                  <Controller
                    name="productImage"
                    control={controlProductForm}
                    defaultValue={null}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="file"
                        id="productImage"
                        accept=".png, .jpg, .jpeg"
                        value={undefined}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            setValueProductForm("productImage", file);
                          }
                        }}
                      />
                    )}
                  />
                </label>
              </div>
            </Label>
          </div>
          <Label className="mt-4">
            <span>Mô hình 3D (.glb)</span>
            <div>
              <label htmlFor={"product3d"}>
                <Controller
                  name="product3d"
                  control={controlProductForm}
                  defaultValue={null}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="file"
                      id="product3d"
                      className="hidden"
                      accept=".glb"
                      value={undefined}
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                          setValueProductForm("product3d", file);
                          setValueProductForm("product3dText", file.name);
                        }
                      }}
                    />
                  )}
                />
              </label>
              <div className="flex items-center justify-start mt-1">
                <Image
                  src={"/assets/img/3dObject.png"}
                  alt="Product 3D"
                  width={40}
                  height={40}
                  className="cursor-pointer rounded-lg"
                />
                <span>
                  {watchProductForm("product3dText")
                    ? watchProductForm("product3dText")
                    : "Chọn mô hình"}
                </span>
              </div>
            </div>
          </Label>
          <Label className="mt-4">
            <span>Mô tả</span>
            <Controller
              name="description"
              control={controlProductForm}
              defaultValue=""
              rules={{ required: "Đây là trường bắt buộc !" }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  onChange={field.onChange}
                  className="mt-1"
                  rows={3}
                  placeholder="Nhập mô tả"
                />
              )}
            />
            <span className="text-red-400">
              {errorsProductForm.description?.message}
            </span>
          </Label>

          <div className="mt-4">
            <Label className="flex items-center">
              <span className="mr-2">Đang hoạt động</span>
              <Input
                {...registerProductForm("isActived")}
                type="checkbox"
                className="form-checkbox h-5 w-5 text-purple-600"
              />
            </Label>
          </div>

          <Label className="mt-4">Màu</Label>
          <TagsInput
            value={colors}
            onChange={setColors}
            name="colors"
            placeHolder="Nhập màu"
          />

          <Label className="mt-4">Kích thước</Label>
          <TagsInput
            value={sizes}
            onChange={setSizes}
            name="sizes"
            placeHolder="Nhập kích thước"
          />

          <div className="mt-4">
            <Button type="button" size="small" onClick={handleSubmitOption}>
              Tạo biến thể
            </Button>
          </div>
        </form>
        <TableContainer className="my-4">
          <Table>
            <TableHeader>
              <tr className="text-center">
                <TableCell>Màu</TableCell>
                <TableCell>Kích thước</TableCell>
                <TableCell>Ảnh</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Khuyến mãi</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Đang hoạt động</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {tableData.map((option: any, index: number) => (
                <TableRow key={index} className="items-center">
                  <TableCell>
                    <div className="flex items-center justify-center text-sm">
                      <Controller
                        name={`data.${index}.color`}
                        control={controlProductOption}
                        defaultValue={option.color}
                        render={() => (
                          <p className="font-semibold">{option.color}</p>
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center text-sm">
                      <Controller
                        name={`data.${index}.size`}
                        control={controlProductOption}
                        defaultValue={option.size}
                        render={() => (
                          <p className="font-semibold">{option.size}</p>
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="flex w-20 items-center justify-center">
                    <Image
                      src={
                        watchProductOption(`data.${index}.image`)
                          ? URL.createObjectURL(
                              watchProductOption(`data.${index}.image`)
                            )
                          : "/assets/img/NoImage.svg.png"
                      }
                      alt="Option Image"
                      width={100}
                      height={100}
                      className="cursor-pointer rounded-lg"
                      onClick={() => {
                        const fileInput = document.getElementById(
                          `data.${index}.image`
                        );
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                    />
                    <label htmlFor={`data.${index}.image`}>
                      <Controller
                        name={`data.${index}.image`}
                        control={controlProductOption}
                        defaultValue={null}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={undefined}
                            type="file"
                            id={`data.${index}.image`}
                            className="hidden"
                            onChange={(e) => {
                              const file =
                                e.target?.files && e.target?.files[0];
                              if (file) {
                                setValueProductOption(
                                  `data.${index}.image`,
                                  file
                                );
                              }
                            }}
                          />
                        )}
                      />
                    </label>
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`data.${index}.price`}
                      control={controlProductOption}
                      defaultValue={0}
                      rules={{ required: "Đây là trường bắt buộc !" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          onChange={field.onChange}
                          className="w-32"
                        />
                      )}
                    />
                    <span className="text-red-400">
                      {errorsProductOption.data?.[index]?.price?.message}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`data.${index}.discount`}
                      control={controlProductOption}
                      defaultValue={0}
                      rules={{ required: "Đây là trường bắt buộc !" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <span className="text-red-400">
                      {errorsProductOption.data?.[index]?.discount?.message}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`data.${index}.stock`}
                      control={controlProductOption}
                      defaultValue={0}
                      rules={{ required: "Đây là trường bắt buộc !" }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <span className="text-red-400">
                      {errorsProductOption.data?.[index]?.stock?.message}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`data.${index}.isActived`}
                      control={controlProductOption}
                      defaultValue={false}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="checkbox"
                          className="flex ml-12"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Modals>
    </>
  );
};

export default AddProductModal;
