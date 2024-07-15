import { useContext, useState } from "react";
import SidebarContext from "context/SidebarContext";
import {
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
} from "icons";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
} from "@roketid/windmill-react-ui";
import { store } from "app/redux/store";
import { useAppDispatch } from "app/redux/hooks";
import { logout } from "app/redux/features/userSlice";
import { logoutById } from "pages/api/authApis";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Loader from "./Loader/Loader";

function Header() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toggleSidebar } = useContext(SidebarContext);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const user = store.getState().userReducer.user;
  const dispatch = useAppDispatch();
  const router = useRouter();

  function handleNotificationsClick() {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
  }

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  }

  const onLogout = async () => {
    try {
      setIsLoading(true);
      await logoutById();
      dispatch(logout());
      router.push("/admin/login");
    } catch (error: any) {
      if (error?.response?.data) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          toast.error(messages.join("\n"));
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("Đăng xuất thất bại !");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
        <div className="container flex items-center justify-end h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
          {/* <!-- Mobile hamburger --> */}
          <button
            className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>
          <ul className="flex items-center flex-shrink-0 space-x-6">
            <li className="relative">
              {/* <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={handleNotificationsClick}
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <BellIcon className="w-5 h-5" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
              ></span>
            </button> */}

              <Dropdown
                align="right"
                isOpen={isNotificationsMenuOpen}
                onClose={() => setIsNotificationsMenuOpen(false)}
              >
                <DropdownItem tag="a" href="#" className="justify-between">
                  <span>Messages</span>
                  <Badge type="danger">13</Badge>
                </DropdownItem>
                <DropdownItem tag="a" href="#" className="justify-between">
                  <span>Sales</span>
                  <Badge type="danger">2</Badge>
                </DropdownItem>
                <DropdownItem onClick={() => alert("Alerts!")}>
                  <span>Alerts</span>
                </DropdownItem>
              </Dropdown>
            </li>
            {/* <!-- Profile menu --> */}
            <li className="relative">
              <button
                className="rounded-full focus:shadow-outline-purple focus:outline-none"
                onClick={handleProfileClick}
                aria-label="Account"
                aria-haspopup="true"
              >
                <Avatar
                  className="align-middle"
                  src={process.env.APP_API_URL + (user ? user.user_image : "")}
                  alt=""
                  aria-hidden="true"
                />
              </button>
              <Dropdown
                align="right"
                isOpen={isProfileMenuOpen}
                onClose={() => setIsProfileMenuOpen(false)}
              >
                <DropdownItem tag="a" href="#">
                  <OutlinePersonIcon
                    className="w-4 h-4 mr-3"
                    aria-hidden="true"
                  />
                  <span>{user?.user_name}</span>
                </DropdownItem>
                <DropdownItem tag="a" href="#">
                  <OutlineCogIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  <span>Cài đặt</span>
                </DropdownItem>
                <DropdownItem onClick={onLogout}>
                  <OutlineLogoutIcon
                    className="w-4 h-4 mr-3"
                    aria-hidden="true"
                  />
                  <span>Đăng xuất</span>
                </DropdownItem>
              </Dropdown>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Header;
