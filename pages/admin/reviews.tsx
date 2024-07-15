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
} from "@roketid/windmill-react-ui";
import { CheckIcon, SearchIcon } from "icons";
import Layout from "app/containers/Layout";
import { toast } from "react-toastify";
import Loader from "app/components/Loader/Loader";
import { getReviews, updateReviews } from "pages/api/reviewApis";

function Review() {
  const [listReview, setListReview] = useState<any[]>([]);
  // const [totalCount, setTotalCount] = useState<number>(0);
  // const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const responseResults = await getReviews();
      setListReview(responseResults.data);
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

  const handleUpdateReview = async (
    updatedToken: string,
    reviewid: string
  ) => {
    try {
      setIsLoading(true);
      const data = {
        is_actived: "true",
        updated_token: updatedToken,
      };
      await updateReviews(data, reviewid);
      toast.success("Đã duyệt đánh giá !");
      loadData();
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

  return (
    <Layout>
      <PageTitle>Đánh giá sản phẩm</PageTitle>
      <div className="flex justify-between mb-4">
        <div className="flex flex-1">
          <div className="relative w-full max-w-sm mr-2 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Tìm kiếm đánh giá"
              aria-label="Search"
            />
          </div>
          <Button>Tìm kiếm</Button>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Số sao</TableCell>
                  <TableCell>Nội dung</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Hành động</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {listReview.map((review, i) => (
                  <>
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Avatar
                            className="hidden mr-3 md:block"
                            src={
                              process.env.APP_API_URL +
                              review.product.product_image
                            }
                            alt="Product image"
                          />
                          <div>
                            <p className="font-semibold">
                              {review.product.product_name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Đánh giá bởi <strong>{review.created_by.email}</strong>
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{review.rate}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{review.content}</span>
                      </TableCell>
                      <TableCell>
                        <Badge type={review.is_actived ? "success" : "danger"}>
                          {review.is_actived ? "Đã duyệt" : "Chưa duyệt"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(review.created_date).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          {!review.is_actived && (
                            <Button
                              layout="link"
                              size="small"
                              aria-label="Active"
                              onClick={() => {
                                handleUpdateReview(
                                  review.updated_token,
                                  review.id
                                );
                              }}
                            >
                              <CheckIcon
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
                label="Order navigation"
              />
            </TableFooter>
          </TableContainer>
        </>
      )}
    </Layout>
  );
}

export default Review;
