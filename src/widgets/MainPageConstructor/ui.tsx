"use client";
import { ElementRef, useEffect, useState, useRef, FC, useMemo, useCallback, ChangeEventHandler } from "react";
import { Button, Input, Radio, Table, TableProps } from "antd";
import styled, { css } from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { DYNAMIC_PARAMETERS, ADDITIONAL_REMOVE_COLUMNS, URL_REGEX } from "@shared/config";
import {
  compareObjects,
  getInitialDataLayer,
  stringifyObjectValues,
  getFormattedObjectString,
} from "@shared/lib";
import { EProjects, isStringArray } from "@shared/types";
import { DataLayerManager } from "../DataLayersManager";
import { TMainPageConstructor } from "./types";
import { Styled } from "./styled";

const getPrefix = () => {
  "use client"

  return window.location.pathname.replace(/^\//, '') || 'index'
}

const safeSplit = (str = ''): string[] => {
  return str.split(';')
}

const toColumns = (array: string[]): TableProps["columns"] =>
  array.map((item) => ({
    title: item,
    dataIndex: item,
    key: item,
  }));

const toDataSource = (head: TableProps["columns"], data: string[]) => {
  const dataSource = data?.map((row) => {
    return safeSplit(row)
      .reduce<Record<string, string>>((acc, value, index) => {
        const title = head?.[index]?.title

        if (typeof title === "string") {
          acc[title] = value;
        }

        return acc;
      }, {});
  });

  return dataSource;
};

const isDataLayerKey = (
  key: string
): key is keyof ReturnType<typeof getInitialDataLayer> =>
  key in getInitialDataLayer();

const getRotateTableData = (
  head: TableProps["columns"],
  dataSource: Record<string, string>[]
): Record<string, string[]> | undefined => {
  return head?.reduce<Record<string, string[]>>((acc, currentValue) => {
    const title = currentValue.title as string;

    acc[title] = dataSource.map((dataSourceItem) => dataSourceItem[title]);

    return acc;
  }, {});
};

const getSameValuesColumns = (
  head: TableProps["columns"],
  dataSource: Record<string, string>[],
  isDefault: boolean = false,
  project: EProjects
) => {
  const rotateTable = getRotateTableData(head, dataSource);
  const initialDataLayer = getInitialDataLayer({ stringify: true, project });

  if (typeof rotateTable === "undefined") {
    return [];
  }

  const result =
    rotateTable &&
    Object.entries<string[]>(rotateTable).reduce<string[]>(
      (acc, [key, values]) => {
        const isSameValues =
          values?.every((value) => value === values[0]) ?? false;

        if (
          (isSameValues &&
            isDefault &&
            isDataLayerKey(key) &&
            values[0] === initialDataLayer[key]) ||
          (isSameValues &&
            !isDefault &&
            isDataLayerKey(key) &&
            values[0] !== initialDataLayer[key])
        ) {
          acc.push(key);
        }

        return acc;
      },
      []
    );

  return result;
};

const CheckedTextareaWrapper = styled.div<{ isSuccess: boolean }>`
  ${({ isSuccess }) =>
    isSuccess &&
    css`
      background-color: greenyellow;
      cursor: pointer;

      > * {
        opacity: 0;
      }
    `}
`;

const Cell = ({
  column,
  value,
  project,
  color,
  onChangeCheckInput,
}: {
  column: string;
  value: string;
  project: EProjects;
  color?: string;
  onChangeCheckInput?: (obj: Record<string, string>) => Record<string, string>;
}) => {
  const isChecked = useRef(false);
  const [diffProps, setDiffProps] = useState<Record<string, string>>({});
  const hasDiffProps = Object.keys(diffProps)?.length > 0;
  const isSuccessChecked = isChecked.current && !hasDiffProps;
  const isLink = URL_REGEX.test(value)

  if (column === "Проверка") {
    return (
      <>
        <CheckedTextareaWrapper isSuccess={isSuccessChecked}>
          <Input.TextArea
            onChange={({ currentTarget }) => {
              isChecked.current = true;
              const value = currentTarget.value;

              try {
                setDiffProps(onChangeCheckInput?.(JSON.parse(value)) || {});
              } catch {
                console.error("Ошибка при копировании объекта");
              }
            }}
          />
        </CheckedTextareaWrapper>
        {hasDiffProps && (
          <SyntaxHighlighter>
            {getFormattedObjectString(diffProps)}
          </SyntaxHighlighter>
        )}
      </>
    );
  }
  const initialDataLayer = getInitialDataLayer({ stringify: true, project });
  const isDefault = isDataLayerKey(column)
    ? initialDataLayer[column] === value
    : false;
  const divProps = color
    ? {
        style: {
          'max-width': '300px',
          background: color,
        },
      }
    : {
      style: {
        'max-width': '300px',
      }
    };

  const cellProps = isDefault
    ? {
        style: {
          background: "rgba(255,0,0,.3)",
        },
      }
    : undefined;
  return (
    <div {...divProps}>
      <p {...cellProps}>{isLink ? <a href={value} target="_blank">Перейти</a> : value}</p>
    </div>
  );
};

export const MainPageConstructor: FC<TMainPageConstructor> = ({
  dataLayers,
}) => {
  const [regex, setRegex] = useState('\\n\\b')
  const [compared, setCompared] = useState([])
  const [showOnly, setShowOnly] = useState<string>("");
  const [project, setProject] = useState<EProjects>();
  const [isShowHiddenColumns, setIsShowHiddenColumns] = useState(false);
  const [head, setHead] = useState<TableProps["columns"]>([]);
  const [body, setBody] = useState<Record<string, string>[]>([]);
  const [sameValuesColumns, setSameValuesColumns] = useState<string[]>([]);
  const [removedColumns, setRemovedColumns] = useState<string[]>([]);
  const textareaRef = useRef<ElementRef<typeof Input.TextArea>>(null);
  const checkTextAreaRef = useRef<ElementRef<typeof Input.TextArea>>(null);
  const isFirstRender = useRef(true)
  const computedBody = useMemo(
    () =>
      body.filter((bodyItem) => {
        if (!showOnly) {
          return true;
        }

        const [showOnlyKey, showOnlyValue] = showOnly.split(":");

        return bodyItem[showOnlyKey] === showOnlyValue;
      }),
    [body, showOnly]
  );
  const [defaultValuesColumns, setDefaultValuesColumns] = useState<string[]>(
    []
  );

  const checkTextAreaChangeHandler: ChangeEventHandler<HTMLTextAreaElement> = useCallback(({ currentTarget }) => {
    const result: Record<'success' | 'errors' | 'notFind', string[]> = {
      success: [],
      errors: [],
      notFind: [],
    }
    try {
      const parsedData = JSON.parse(currentTarget.value) as {event: string}[]
      //@ts-ignore
      setCompared(compared => [...compared, ...parsedData])

      parsedData.forEach((parsedEventItem: { event: string }) => {
        const eventFromBody = body.find(({ event }) => event === parsedEventItem.event)

        if (!eventFromBody) {
          result.notFind.push(parsedEventItem.event)
          return
        }

        const compareResult = compareObjects(eventFromBody, parsedEventItem)

        if (compareResult && Object.keys(compareResult).length === 0) {
          result.success.push(parsedEventItem.event)
          return
        }

        //@ts-ignore
        result.errors.push(parsedEventItem)
      })
    } catch (e) {
      console.error(e)
    }

    console.log(result)
  }, [body])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  useEffect(() => {
    const localStorageShowOnly = window.localStorage.getItem(getPrefix() + "-showOnly");
    const localStorageProject = window.localStorage.getItem(getPrefix() + "-project");
    const localStorageHead = window.localStorage.getItem(getPrefix() + "-tableHead");
    const localStorageBody = window.localStorage.getItem(getPrefix() + "-tableBody");

    if (localStorageShowOnly) {
      setShowOnly(localStorageShowOnly);
    }

    if (localStorageProject) {
      setProject(localStorageProject as EProjects);
    }

    if (localStorageBody && localStorageHead) {
      try {
        const parsedBody: Record<string, unknown>[] =
          JSON.parse(localStorageBody);
        setHead(JSON.parse(localStorageHead));
        setBody(
          parsedBody?.map((parsedBodyItem) =>
            stringifyObjectValues(parsedBodyItem)
          )
        );
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (defaultValuesColumns?.length > 0) {
      setRemovedColumns(() =>
        [...DYNAMIC_PARAMETERS, ...ADDITIONAL_REMOVE_COLUMNS].concat(
          defaultValuesColumns
        )
      );
    }
  }, [defaultValuesColumns]);

  useEffect(() => {
    if (isFirstRender.current) {
      return
    }

    window.localStorage.setItem(getPrefix() + "-showOnly", showOnly);

    if (project) {
      window.localStorage.setItem(getPrefix() + "-project", project);
      setSameValuesColumns(
        getSameValuesColumns(head, computedBody, false, project)
      );
      setDefaultValuesColumns(
        getSameValuesColumns(head, computedBody, true, project)
      );
    }

    if (Array.isArray(head) && head.length > 0) {
      window.localStorage.setItem(getPrefix() + "-tableHead", JSON.stringify(head));
    }

    if (Array.isArray(body) && body.length > 0) {
      window.localStorage.setItem(getPrefix() + "-tableBody", JSON.stringify(body));
    }
  }, [head, body, project, showOnly, computedBody]);

  const clickHandler = () => {
    const textareaValue =
      textareaRef.current?.resizableTextArea?.textArea.value;
    const reg = new RegExp(regex)
    console.log({reg})
    const [headValue, ...bodyValue] = textareaValue?.split(reg) || [];
    const splitedHead = safeSplit(headValue).filter(Boolean)

    if (isStringArray(splitedHead)) {
      setHead(toColumns(splitedHead));
    }

    if (isStringArray(bodyValue)) {
      setBody(() => toDataSource(toColumns(splitedHead), bodyValue).map(bodyItem => stringifyObjectValues(bodyItem)));
    }

    // console.log({
    //   head: splitedHead, body: body.map((bodyObje) => Object.entries(bodyObje))
    // })
  };

  const showHiddenColumns = [
    { label: "Да", value: true },
    { label: "Нет", value: false },
  ];

  const projectOptions = [
    { label: "Банк", value: EProjects.BANK },
    { label: "Деньги", value: EProjects.DENGI },
  ];

  return (
    <>
      <DataLayerManager
        dataLayers={dataLayers}
        onSelectDataLayer={(data) => console.log(data)}
      />
      <p>Регулярка</p>
      <Input value={regex} onChange={({ currentTarget }) => setRegex(currentTarget.value)} />
      <p>Проект</p>
      <Radio.Group
        options={projectOptions}
        onChange={({ target: { value } }) => setProject(value)}
        value={project}
        optionType="button"
      />
      <p>Динамические параметры</p>
      <SyntaxHighlighter>
        {JSON.stringify(DYNAMIC_PARAMETERS)}
      </SyntaxHighlighter>
      <p>Удаленные колонки (включая с дефолтными параметрами)</p>
      <SyntaxHighlighter>{JSON.stringify(removedColumns)}</SyntaxHighlighter>
      <p>Дополнительно удаленные колонки</p>
      <SyntaxHighlighter>
        {JSON.stringify(ADDITIONAL_REMOVE_COLUMNS)}
      </SyntaxHighlighter>
      <p>Колонки полностью с дефолтными параметрами</p>
      <SyntaxHighlighter>
        {JSON.stringify(defaultValuesColumns)}
      </SyntaxHighlighter>
      <p>Колонки c полностью одинаковыми не дефолтными значениями</p>
      <SyntaxHighlighter>{JSON.stringify(sameValuesColumns)}</SyntaxHighlighter>
      <p>Таблица из exel</p>
      <Input.TextArea ref={textareaRef} autoSize />
      <p>Мультипроверка событий</p>
      <Input.TextArea ref={checkTextAreaRef} autoSize onChange={checkTextAreaChangeHandler} />
      <br />
      <br />
      <Button onClick={clickHandler}>Действие</Button>
      <br />
      <br />
      <p>Показать скрытые колонки</p>
      <Radio.Group
        options={showHiddenColumns}
        onChange={({ target: { value } }) => setIsShowHiddenColumns(value)}
        value={isShowHiddenColumns}
        optionType="button"
      />
      <br />
      <br />
      {(head || body) && (
        <Table scroll={{ x: "max-content" }} dataSource={computedBody}>
          {head
            ?.filter(({ title }) => {
              if (isShowHiddenColumns) {
                return true;
              }
              return (
                typeof title === "string" && !removedColumns.includes(title)
              );
            })
            .concat({
              title: "Проверка",
              key: "check",
            })
            .map(({ title, key }) => (
              <Table.Column
                title={title}
                key={key}
                //@ts-ignore
                dataIndex={key}
                render={(value, column) => (
                  <Cell
                    column={title as string}
                    value={value}
                    project={project as EProjects}
                    color={
                      sameValuesColumns.includes(title as string)
                        ? "rgba(0,255,100, .5)"
                        : undefined
                    }
                    onChangeCheckInput={(currentObject) =>
                      compareObjects(column, currentObject)
                    }
                  />
                )}
              />
            ))}
        </Table>
      )}
      <h2>Финальные данные</h2>
      <Styled.FinalDataTable>
        {Object.entries(getRotateTableData(head, body) || {})
          .filter(
            ([key]) => typeof key === "string" && !removedColumns.includes(key)
          )
          .map(([key, value]) => (
            <Styled.FinalDataTableRow key={key}>
              <Styled.FinalDataTableCell>
                <Styled.FinalDataRowTitle>{key}</Styled.FinalDataRowTitle>
              </Styled.FinalDataTableCell>
              <Styled.FinalDataTableCell>
                <Styled.FinalDataBody>
                  {Array.from(new Set(value)).map((valItem) => (
                    <Styled.FinalDataBodyItem
                      isActive={showOnly === `${key}:${valItem}`}
                      key={valItem}
                      onClick={() =>
                        setShowOnly((oldValue) =>
                          oldValue === `${key}:${valItem}`
                            ? ""
                            : `${key}:${valItem}`
                        )
                      }
                    >
                      {valItem}
                    </Styled.FinalDataBodyItem>
                  ))}
                </Styled.FinalDataBody>
              </Styled.FinalDataTableCell>
            </Styled.FinalDataTableRow>
          ))}
      </Styled.FinalDataTable>
    </>
  );
};
