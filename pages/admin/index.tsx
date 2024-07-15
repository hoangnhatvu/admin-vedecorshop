import React, { useState, useEffect } from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";

import InfoCard from "app/components/Cards/InfoCard";
import ChartLegend from "app/components/Chart/ChartLegend";
import ChartCard from "app/components/Chart/ChartCard";
import PageTitle from "app/components/Typography/PageTitle";
import Layout from "app/containers/Layout";
import { CartIcon, MoneyIcon, PeopleIcon, MenuIcon } from "icons";

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
  barOptions,
  barLegends,
} from "utils/demo/chartsData";

import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";
import {
  Avatar,
  Badge,
  Button,
  Label,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@roketid/windmill-react-ui";
import response, { ITableData } from "utils/demo/tableData";
import DatePicker from "app/components/DatePicker";
import { getInfoDashboard } from "pages/api/adminApis";
import Loader from "app/components/Loader/Loader";
import { toast } from "react-toastify";

function Dashboard() {
  Chart.register(
    ...registerables,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const [data, setData] = useState<ITableData[]>([]);
  const [optionYear, setOptionYear] = useState<
    {
      id: number;
      value: number;
    }[]
  >([]);
  const totalUser = useState<Number>(0);
  const totalBlance = useState<Number>(0);
  const totalProduct = useState<Number>(0);
  const totalOrderCompleted = useState<Number>(0);
  const top10Products = useState<any>([]);
  const top10Users = useState<any>([]);
  const top3Categories = useState<any>([]);
  const isLoading = useState<boolean>(false);

  const loadData = async () => {
    try {
      isLoading[1](true);
      const responseData = await getInfoDashboard();
      totalUser[1](responseData.totalUser);
      totalBlance[1](responseData.totalBlance);
      totalProduct[1](responseData.totalProduct);
      totalOrderCompleted[1](responseData.totalOrderCompleted);
    } catch (error) {
      toast.error(error);
    } finally {
      isLoading[1](false);
    }
  };

  useEffect(() => {
    setData(response.slice(0, 10));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let years = [];
    for (let i = currentYear; i > currentYear - 5; i--) {
      years.push({ id: i, value: i });
    }
    setOptionYear(years);
    loadData();
  }, []);

  return (
    <Layout>
      <PageTitle>Dashboard</PageTitle>

      <div className="flex justify-center mb-8">
        <DatePicker />
        <Label className="justify-center items-center flex mx-8">-------</Label>
        <DatePicker className="mr-4" />
        <Button>Áp dụng</Button>
      </div>
      {isLoading[0] ? (
        <Loader />
      ) : (
        <div>
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              title="Tổng số khách hàng"
              value={totalUser[0].toString()}
            >
              {/* @ts-ignore */}
              <PeopleIcon className="w-8 mr-8 text-orange-500" />
            </InfoCard>

            <InfoCard title="Tổng doanh thu" value={`VNĐ ${totalBlance[0]}`}>
              {/* @ts-ignore */}
              <MoneyIcon className="w-8 mr-8 text-green-500" />
            </InfoCard>

            <InfoCard title="Tổng sản phẩm" value={`${totalProduct[0]}`}>
              {/* @ts-ignore */}
              <MenuIcon className="w-8 mr-8 text-blue-500" />
            </InfoCard>

            <InfoCard title="Tổng đơn hàng" value={`${totalOrderCompleted[0]}`}>
              {/* @ts-ignore */}
              <CartIcon className="w-8 mr-8 text-yellow-500" />
            </InfoCard>
          </div>

          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <ChartCard title="Top sản phẩm bán chạy">
              <Bar {...barOptions} />
              <ChartLegend legends={barLegends} />
            </ChartCard>
            <ChartCard title="Biểu đồ doanh thu">
              <Select>
                {optionYear.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.value}
                  </option>
                ))}
              </Select>
              <Line {...lineOptions} />
              <ChartLegend legends={lineLegends} />
            </ChartCard>
            <ChartCard title="Xu hướng">
              <Doughnut {...doughnutOptions} />
              <ChartLegend legends={doughnutLegends} />
            </ChartCard>

            <ChartCard title="Khách hàng tiềm năng">
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Khách hàng</TableCell>
                      <TableCell>Chi tiêu</TableCell>
                      <TableCell>Số đơn hàng</TableCell>
                      <TableCell>Ngày tham gia</TableCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {data.map((user, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Avatar
                              className="hidden mr-3 md:block"
                              src={user.avatar}
                              alt="User image"
                            />
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {user.job}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">$ {user.amount}</span>
                        </TableCell>
                        <TableCell>
                          <Badge type={user.status}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(user.date).toLocaleDateString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </ChartCard>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Dashboard;
