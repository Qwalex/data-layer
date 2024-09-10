import React, { FC } from "react";
import { Tabs } from "antd";
import { MainPageConstructor, MainPageSettings } from "@widgets";

export const MainPage: FC = async () => {
  const dataLayers: never[] = []

  return (
    <>
      <Tabs
        items={[
          {
            key: "1",
            label: "Конструктор",
            children: <MainPageConstructor dataLayers={dataLayers} />,
          },
          {
            key: "2",
            label: "Настройки",
            children: <MainPageSettings />,
          },
        ]}
      />
    </>
  );
};
