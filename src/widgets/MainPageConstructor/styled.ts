import styled, { css } from "styled-components";

const FinalDataTable = styled.div`
  background-color: whitesmoke;
  padding: 10px;
`;

const FinalDataRowTitle = styled.div`
  font-size: 1.5em;
  margin-bottom: 10px;
  font-weight: 500;
`;

const FinalDataTableRow = styled.div`
  margin-bottom: 30px;
`;

const FinalDataTableCell = styled.div``;

const FinalDataBody = styled.div``;

const FinalDataBodyItem = styled.div<{ isActive: boolean }>`
  display: inline-block;
  min-width: 30px;
  background-color: white;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 10px;
  cursor: pointer;
  text-align: center;

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: lightgreen;
    `}
`;

export const Styled = {
  FinalDataTable,
  FinalDataTableRow,
  FinalDataRowTitle,
  FinalDataTableCell,
  FinalDataBody,
  FinalDataBodyItem,
};
