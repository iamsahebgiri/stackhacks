import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Badge,
  Flex,
  useDisclosure,
  Button,
  InputGroup,
  Input,
  InputLeftElement,
  Box,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { useStoreState, useStoreActions } from "easy-peasy";

import { IoCaretDown, IoCaretUp, IoSearch } from "react-icons/io5";
import { useTable, useSortBy, useFilters } from "react-table";
import clsx from "clsx";
import EditOrderModal from "./EditOrderModal";

function OrdersTable() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const data = useStoreState((state) => state.orders);
  const getAllOrdersByAdmin = useStoreActions((actions) => actions.getAllOrdersByAdmin);
  const [filterInput, setFilterInput] = useState("");
  const [id, setId] = useState("");

  const columns = React.useMemo(
    () => [
      {
        Header: "Food Name",
        accessor: "foodItem",
      },
      {
        Header: "Ordered by",
        accessor: "orderedBy",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Estimated Time",
        accessor: "estimatedTime",
      },
      {
        Header: "Edit",
        accessor: "id",
      },
    ],
    []
  );

  useEffect(() => {
    getAllOrdersByAdmin();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter("foodItem", value);
    setFilterInput(value);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable({ columns, data }, useFilters, useSortBy);

  return (
    <>
      <Box px="4" my="4">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<Icon as={IoSearch} color="gray.300" />}
          />
          <Input
            type="text"
            value={filterInput}
            onChange={handleFilterChange}
            placeholder="Search food name"
            focusBorderColor="teal.500"
          />
        </InputGroup>
      </Box>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <Flex>
                    {column.render("Header")}
                    <chakra.span pl="1">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <Icon as={IoCaretDown} />
                        ) : (
                          <Icon as={IoCaretUp} />
                        )
                      ) : null}
                    </chakra.span>
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell, i) => (
                  <Td {...cell.getCellProps()}>
                    {i === 2 ? (
                      <Badge
                        colorScheme={clsx(
                          cell.value.toLowerCase() === "pending" && "red",
                          cell.value.toLowerCase() === "finished" && "green",
                          cell.value.toLowerCase() === "cooking" && "yellow"
                        )}
                      >
                        {cell.render("Cell")}
                      </Badge>
                    ) : i === 4 ? (
                      <Button
                        size="xs"
                        onClick={() => {
                          setId(cell.value);
                          // console.log(cell.value);
                          onOpen();
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      cell.render("Cell")
                    )}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <EditOrderModal id={id} onClose={onClose} isOpen={isOpen} />
    </>
  );
}

export default OrdersTable;
