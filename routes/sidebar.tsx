interface IRoute {
  path?: string;
  icon?: string;
  name: string;
  routes?: IRoute[];
  checkActive?(pathname: String, route: IRoute): boolean;
  exact?: boolean;
}

export function routeIsActive(pathname: String, route: IRoute): boolean {
  if (route.checkActive) {
    return route.checkActive(pathname, route);
  }

  return route?.exact
    ? pathname == route?.path
    : route?.path
    ? pathname.indexOf(route.path) === 0
    : false;
}

const routes: IRoute[] = [
  {
    path: "/admin",
    icon: "HomeIcon",
    name: "Dashboard",
    exact: true,
  },
  {
    path: "/admin/accounts",
    icon: "PeopleIcon",
    name: "Tài khoản",
  },
  {
    path: "/admin/products",
    icon: "MenuIcon",
    name: "Sản phẩm",
  },
  {
    path: "/admin/templates",
    icon: "SunIcon",
    name: "Mẫu thiết kế",
  },
  {
    path: "/admin/orders",
    icon: "FormsIcon",
    name: "Đơn hàng",
  },
  {
    path: "/admin/reviews",
    icon: "ModalsIcon",
    name: "Đánh giá",
  },
];

export type { IRoute };
export default routes;
