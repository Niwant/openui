import React, { createContext, ReactNode, useContext } from "react";

export interface SideBarChartData {
  title: string;
  values: {
    value: number;
    label: string;
    color: string;
  }[];
}

interface SideBarTooltipContextType {
  data: SideBarChartData | undefined;
  isSideBarTooltipOpen: boolean;
  setData: (data: SideBarChartData) => void;
  setIsSideBarTooltipOpen: (isOpen: boolean) => void;
}

const noop = () => {};

const defaultSideBarTooltipContext: SideBarTooltipContextType = {
  data: undefined,
  isSideBarTooltipOpen: false,
  setData: noop,
  setIsSideBarTooltipOpen: noop,
};

const SideBarTooltipContext = createContext<SideBarTooltipContextType | undefined>(undefined);

interface SideBarTooltipProviderProps {
  children: ReactNode;
  isSideBarTooltipOpen: boolean;
  setIsSideBarTooltipOpen: (isOpen: boolean) => void;
  data: SideBarChartData | undefined;
  setData: (data: SideBarChartData) => void;
}

export const SideBarTooltipProvider: React.FC<SideBarTooltipProviderProps> = ({
  children,
  isSideBarTooltipOpen,
  setIsSideBarTooltipOpen,
  data,
  setData,
}) => {
  const value: SideBarTooltipContextType = {
    data,
    isSideBarTooltipOpen,
    setData,
    setIsSideBarTooltipOpen,
  };

  return <SideBarTooltipContext.Provider value={value}>{children}</SideBarTooltipContext.Provider>;
};

export const useSideBarTooltip = (): SideBarTooltipContextType => {
  const context = useContext(SideBarTooltipContext);
  if (context === undefined) {
    return defaultSideBarTooltipContext;
  }
  return context;
};

export default SideBarTooltipContext;
