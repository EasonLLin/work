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

// can use state machine to control states
export default function Home() {
  const [list, setList] = useState([
    { name: 'Amy', processing: null, processed: [] },
    { name: 'Bob', processing: null, processed: [] },
    { name: 'Cory', processing: null, processed: [] },
    { name: 'Dora', processing: null, processed: [] },
  ]);
  const [count, setCount] = useState(0);
  const [waitings, setWaitings] = useState(null);

  // find people that not in processing
  const findEmpty = () => {
    for (let i = 0; i < list.length; i++) {
      if (!list[i].processing) {
        return i;
      }
    }
    return null;
  };

  // random between 500 - 1500
  // normally random will put into utility file
  const randomTime = () => {
    return Math.floor(Math.random() * 1001) + 500;
  };

  const clearProcessing = async (nextIndex) => {
    const nextProcessedArr = list[nextIndex].processed;
    nextProcessedArr.push(count);
    await setList((prev) =>
      prev.map((item, i) =>
        i === nextIndex
          ? { ...item, processing: null, processed: nextProcessedArr }
          : item
      )
    );
  };

  const waitingToProcessing = (nextIndex, waitings) => {
    console.log('add', waitings, 'at index', nextIndex);
    setList((prev) =>
      prev.map((item, i) =>
        i === nextIndex ? { ...item, processing: waitings } : item
      )
    );
  };

  const delay = (time) => {
    return new Promise((res) => setTimeout(res, time));
  };

  const countToWaitings = async (nextWaitings) => {
    console.log(
      'next waitings',
      count + 1 > (nextWaitings || 0) ? (nextWaitings || 0) + 1 : null,
      count,
      waitings
    );
    await setWaitings(
      count + 1 > (nextWaitings || 0) ? (nextWaitings || 0) + 1 : null
    );
  };

  const triggerNext = async () => {
    // const nextIndex = findEmpty();
    // const prevCount = count;
    await setCount(count + 1);

    // if (Number.isInteger(nextIndex) && !waitings) {
    //   await addProcessing(nextIndex, prevCount);
    //   await delay(randomTime());
    //   await clearProcessing(nextIndex);
    // }

    if (!waitings) {
      await setWaitings(count + 1);
    }
  };

  useEffect(() => {
    const trigger = async () => {
      const nextIndex = findEmpty();
      console.log('nextIndex00', nextIndex);
      if (Number.isInteger(nextIndex)) {
        await countToWaitings(waitings);
        await waitingToProcessing(nextIndex, waitings);
        console.log('nextIndex', nextIndex);
        console.log('waitings', waitings);
        console.log('count', count);
        console.log(
          'set waitings to',
          count + 1 > (waitings || 0) ? (waitings || 0) + 1 : null
        );
        await delay(randomTime());
        await clearProcessing(nextIndex);
        if (count + 1 > (waitings || 0)) {
          console.log('count to waitings');
          await countToWaitings(waitings + 1);
        }
        console.log('===========================');
      }
      // if (!Number.isInteger(nextIndex) && waitings) {
      //   // console.log('cw', count, waitings);
      //   // if (count > (waitings || 0)) {
      //   console.log('count to waitings');
      //   await countToWaitings(waitings + 1);
      //   // await
      //   // }
      // }
    };

    console.log('waitings0', waitings);
    if (waitings) {
      trigger();
    }
    // if (!waitings && count > (waitings || 0)) {
    //   setWaitings(count);
    // }
  }, [waitings, count]);

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
            {list.map((item) => (
              <TableRow key={item.name}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell>
                  {item.processing ? item.processing : 'idle'}
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
          {`Next ${count + 1}`}
        </Button>
      </Box>
    </StyledContainer>
  );
}
