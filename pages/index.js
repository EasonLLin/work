import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
  Box,
} from '@material-ui/core';
import styled from 'styled-components';
import { spacing, flex } from '@material-ui/system';

const StyledContainer = styled(Container)`
  ${spacing}
`;

export default function Home() {
  const [list, setList] = useState([
    { name: 'Amy', processed: [] },
    { name: 'Bob', processed: [] },
    { name: 'Cory', processed: [] },
    { name: 'Dora', processed: [] },
  ]);
  const [processingList, setProcessingList] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [count, setCount] = useState(1);
  const [waitings, setWaitings] = useState(null);

  const findEmpty = () => {
    for (let i = 0; i < processingList.length; i++) {
      if (!processingList[i]) {
        return i;
      }
    }
  };

  const randomTime = () => {
    // random between 500 - 1500
    return Math.floor(Math.random() * 1001) + 500;
  };

  const clearProcessing = async (nextIndex) => {
    // const nextList = list;
    console.log('list0', list);
    const nextProcessedArr = list[nextIndex].processed;
    nextProcessedArr.push(count);
    await setProcessingList(
      processingList.map((item, i) => (i === nextIndex ? null : item))
    );
    await setList(
      list.map((item, i) =>
        i === nextIndex ? { ...item, processed: nextProcessedArr } : item
      )
    );
  };

  const addProcessing = async (nextIndex, prevCount) => {
    await setProcessingList(
      processingList.map((item, i) => (i === nextIndex ? prevCount : item))
    );
  };

  const delay = (time) => {
    return new Promise((res) => setTimeout(res, time));
  };

  const triggerNext = async () => {
    const nextIndex = findEmpty();
    const prevCount = count;
    await setCount(count + 1);

    if (Number.isInteger(nextIndex) && !waitings) {
      await addProcessing(nextIndex, prevCount);
      await delay(randomTime());
      clearProcessing(nextIndex);
    }
  };

  return (
    <StyledContainer p={2} component="span">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>name</TableCell>
              <TableCell>processing</TableCell>
              <TableCell>processed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item, i) => (
              <TableRow key={item.name}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell>
                  {processingList[i] ? processingList[i] : 'idle'}
                </TableCell>
                <TableCell>
                  {item.processed.length ? item.processed.join(',') : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" mt={2} justifyContent="space-between">
        <Box>{`waitings: ${waitings}`}</Box>
        <Button variant="contained" color="primary" onClick={triggerNext}>
          {`Next ${count}`}
        </Button>
      </Box>
    </StyledContainer>
  );
}
