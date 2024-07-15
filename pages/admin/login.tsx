"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { login } from "app/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "app/redux/hooks";
import { Label, Input, Button } from "@roketid/windmill-react-ui";
import Loader from "app/components/Loader/Loader";

interface FormData {
  email: string;
  password: string;
}

function LoginPage() {
  const imgSource = "/assets/img/bk.png";
  const router = useRouter();
  const [data, setData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isLoggedIn = useAppSelector((state: any) => state.userReducer.isLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/admin");
    }
  }, []);

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.APP_API_URL}auth/loginAdmin`,
        data
      );
      dispatch(login(response.data));
      toast.success("Đăng nhập thành công !");
      router.push("/admin");
    } catch (error: any) {
      if (error?.response?.data) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          toast.error(messages.join("\n"));
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("Đăng nhập thất bại !");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto my-12 mx-20 md:flex-row">
            <div className="relative h-32 md:h-auto md:w-1/2 m-6">
              <Image
                aria-hidden="true"
                src={imgSource}
                alt="Login"
                layout="fill"
              />
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Đăng nhập
                </h1>
                <Label>
                  <span>Email</span>
                  <Input
                    name="email"
                    value={data.email}
                    className="mt-1"
                    type="email"
                    placeholder="email"
                    onKeyDown={handleKeyDown}
                    onChange={onHandleChange}
                  />
                </Label>

                <Label className="mt-4">
                  <span>Password</span>
                  <Input
                    name="password"
                    value={data.password}
                    className="mt-1"
                    type="password"
                    placeholder="password"
                    onKeyDown={handleKeyDown}
                    onChange={onHandleChange}
                  />
                </Label>

                <Button className="mt-12" block onClick={handleLogin}>
                  ĐĂNG NHẬP
                </Button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
