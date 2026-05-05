import type { ReactNode } from "react";
import {
  RiBarChartBoxLine,
  RiDashboardLine,
  RiUserLine,
} from "@remixicon/react";

export const dashboardMainRoutes = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <RiDashboardLine />,
  },
  {
    title: "Analises",
    url: "/dashboard/analyses",
    icon: <RiBarChartBoxLine />,
  },
  {
    title: "Conta",
    url: "/dashboard/account",
    icon: <RiUserLine />,
  },
] as const satisfies ReadonlyArray<{
  title: string;
  url: string;
  icon: ReactNode;
}>;

export const dashboardSecondaryRoutes = [] as const satisfies ReadonlyArray<{
  title: string;
  url: string;
  icon: ReactNode;
}>;

export const dashboardRouteMeta = {
  "/dashboard": {
    title: "Dashboard",
  },
  "/dashboard/account": {
    title: "Conta",
  },
  "/dashboard/analyses": {
    title: "Analises",
  },
  "/dashboard/billing": {
    title: "Cobranca",
  },
  "/dashboard/settings": {
    title: "Configuracoes",
  },
} as const;

export type DashboardRoutePath = keyof typeof dashboardRouteMeta;
