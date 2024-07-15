import React, { useEffect, useState } from "react";
import Modals from "../Modals";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import {
  Label,
  Textarea,
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
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { getProducts } from "pages/api/productApis";
import Select from "react-select";
import { createTemplate } from "pages/api/templateApis";

interface ITemplateModal {
  isModalOpen: boolean;
  closeModal: () => void;
  loadDataTemplate: ({}) => void;
}

interface IProduct {
  product: string;
  option: { value: string; label: string };
  quantity: number;
}

interface IProductForm {
  data: IProduct[];
}

interface ITemplateForm {
  templateName: string;
  templateImage: File | any;
  description: string;
  isActived: boolean | any;
  products: string[];
}

interface ISelectProduct {
  value: string;
  label: string;
}

const AddTemplateModal: React.FC<ITemplateModal> = ({
  isModalOpen,
  closeModal,
  loadDataTemplate,
}) => {
  const {
    register: registerTemplateForm,
    handleSubmit: handleSubmitTemplateForm,
    control: controlTemplateForm,
    setValue: setValueTemplateForm,
    watch: watchTemplateForm,
    formState: { errors: errorsTemplateForm },
  } = useForm<ITemplateForm>({ mode: "onChange" });

  const {
    control: controlTemplateProduct,
    setValue: setValueTemplateProduct,
    watch: watchTemplateProduct,
    formState: { errors: errorsTemplateProduct },
  } = useForm<IProductForm>({ mode: "onChange" });

  const [products, setProducts] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [optionsProduct, setOptionsProduct] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const responseResults = await getProducts(1, 100);
      setProducts(responseResults?.data || []);
      setOptionsProduct(
        responseResults.data.map((item: any) => {
          return { value: item.id, label: item.product_name };
        })
      );
    } catch (error) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitOption = () => {
    setTableData([...watchTemplateForm("products")]);
  };

  const onSubmit = async (data: ITemplateForm) => {
    try {
      setIsLoading(true);
      const productsData = watchTemplateProduct("data");
      console.log("productsData", productsData);

      const templateDataToSend = new FormData();
      templateDataToSend.append("template_name", data.templateName);
      if (data.templateImage) {
        templateDataToSend.append("template_image", data.templateImage);
      }
      templateDataToSend.append("description", data.description);
      templateDataToSend.append("is_actived", String(data.isActived));
      productsData.forEach((element, index) => {
        templateDataToSend.append(`products[${index}][product]`, element.product);
        templateDataToSend.append(
          `products[${index}][option]`,
          element.option.value
        );
        templateDataToSend.append(
          `products[${index}][quantity]`,
          element.quantity.toString()
        );
      });

      await createTemplate(templateDataToSend);
      closeModal();
      loadDataTemplate({});
      toast.success("Thêm thiết kế thành công !");
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

  const getOptionList = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    const optionList = product.options.map((item: any) => {
      return {
        value: item.id,
        label: item?.color || "" + item?.size || "",
      };
    });
    return optionList;
  };
  return (
    <>
      {isLoading && <Loader />}
      <Modals
        isModalOpen={isModalOpen}
        buttonText="Thêm thiết kế"
        onCloseModal={closeModal}
        onSubmit={handleSubmitTemplateForm(onSubmit)}
      >
        <form
          onSubmit={handleSubmitTemplateForm(onSubmit)}
          className="overflow-auto"
        >
          <h2 className="text-2xl font-bold mb-4">Thêm thiết kế</h2>
          <div className="flex justify-between">
            <div className="flex-col w-full">
              <Label>
                <span>Tên thiết kế</span>
                <Controller
                  name="templateName"
                  control={controlTemplateForm}
                  defaultValue=""
                  rules={{ required: "Đây là trường bắt buộc !" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      onChange={field.onChange}
                      className="w-full"
                      placeholder="Nhập tên bản thiết kế"
                    />
                  )}
                />
                <span className="text-red-400">
                  {errorsTemplateForm.templateName?.message}
                </span>
              </Label>
            </div>
            <Label>
              <div className="pl-12">
                <span>Ảnh thiết kế</span>
                <Image
                  src={
                    watchTemplateForm("templateImage")
                      ? URL.createObjectURL(watchTemplateForm("templateImage"))
                      : "/assets/img/NoImage.svg.png"
                  }
                  alt="Template Image"
                  width={110}
                  height={110}
                  className="cursor-pointer rounded-lg"
                />
                <label htmlFor={"templateImage"}>
                  <Controller
                    name="templateImage"
                    control={controlTemplateForm}
                    defaultValue={null}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="file"
                        id="templateImage"
                        accept=".png, .jpg, .jpeg"
                        value={undefined}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            setValueTemplateForm("templateImage", file);
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
            <span>Mô tả</span>
            <Controller
              name="description"
              control={controlTemplateForm}
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
              {errorsTemplateForm.description?.message}
            </span>
          </Label>
          <div className="mt-4">
            <Label className="flex items-center">
              <span className="mr-2">Đang hoạt động</span>
              <Input
                {...registerTemplateForm("isActived")}
                type="checkbox"
                className="form-checkbox h-5 w-5 text-purple-600"
              />
            </Label>
          </div>
          <Label className="mt-4">
            <span>Chọn sản phẩm</span>
            <Controller
              name="products"
              control={controlTemplateForm}
              rules={{ required: "Đây là trường bắt buộc !" }}
              defaultValue={optionsProduct[0]?.value}
              render={({ field }) => (
                <Select
                  options={optionsProduct}
                  isMulti
                  {...field}
                  onChange={(selectedOptions) => {
                    field.onChange(selectedOptions);
                  }}
                  className="mt-1"
                />
              )}
            />
            <span className="text-red-400">
              {errorsTemplateForm.products?.message}
            </span>
          </Label>
          <div className="mt-4">
            <Button type="button" size="small" onClick={handleSubmitOption}>
              Nhập sản phẩm
            </Button>
          </div>
        </form>
        <TableContainer className="my-4">
          <Table>
            <TableHeader>
              <tr className="text-center">
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Biển thể</TableCell>
                <TableCell>Số lượng</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {tableData.map((item: any, index: number) => (
                <TableRow key={index} className="items-center">
                  <TableCell>
                    <div className="flex items-center justify-center text-sm">
                      <Controller
                        name={`data.${index}.product`}
                        control={controlTemplateProduct}
                        defaultValue={item.value}
                        render={() => (
                          <p className="font-semibold">{item.label}</p>
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`data.${index}.option`}
                      control={controlTemplateProduct}
                      rules={{ required: "Đây là trường bắt buộc !" }}
                      defaultValue={getOptionList(item.value)[0]}
                      render={({ field }) => (
                        <Select
                          options={getOptionList(item.value)}
                          {...field}
                          onChange={(selectedOptions) => {
                            field.onChange(selectedOptions);
                          }}
                          className="mt-1 w-32"
                        />
                      )}
                    />
                    <span className="text-red-400">
                      {errorsTemplateProduct.data?.[index]?.option?.message}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`data.${index}.quantity`}
                      control={controlTemplateProduct}
                      defaultValue={0}
                      rules={{ required: "Đây là trường bắt buộc !" }}
                      render={({ field }) => (
                        <Input
                          type="number"
                          {...field}
                          onChange={field.onChange}
                          className="w-12"
                        />
                      )}
                    />
                    <span className="text-red-400">
                      {errorsTemplateProduct.data?.[index]?.quantity?.message}
                    </span>
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

export default AddTemplateModal;
