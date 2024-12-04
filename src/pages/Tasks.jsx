import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';

import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../util';
import TasksSkeleton from '../_skeletons/TasksSkeleton';
import Pagination from '../components/Pagination';

export default function Tasks() {
  const { user } = useUser();
  const [tasks, setTasks] = useState();

  const [searchParams, setSearchParams] = useSearchParams();
  const [itemCount, setItemCount] = useState(0);
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchTasks = async () => {
      const query = searchParams.size ? '?' + searchParams.toString() : '';
      const res = await fetch(`${API_BASE_URL}/tasks/user/${user._id}${query}`, {
        credentials: 'include',
      });
      const { tasks, taskCount } = await res.json();
      setTasks(tasks);
      setItemCount(taskCount);
    };
    fetchTasks();
  }, [searchParams]);

  const handleStatusFilter = e => {
    const value = e.target.value;
    if (value) {
      searchParams.set('status', value);
    } else {
      searchParams.delete('status');
    }
    setSearchParams(searchParams);
  };

  const handleOrderBy = value => {
    let order = 1;
    const prevValue = searchParams.get('orderBy');
    if (prevValue == value) {
      const prevOrder = searchParams.get('order');
      if (prevOrder) {
        order = -1 * prevOrder;
      }
    }
    searchParams.set('orderBy', value);
    searchParams.set('order', order);
    setSearchParams(searchParams);
  };

  if (!tasks) {
    return <TasksSkeleton />;
  }
  return (
    <Box p='5' maxW='3lg' mx='auto'>
      <Heading
        as='h1'
        fontSize='3xl'
        fontWeight='semibold'
        textAlign='center'
        my='7'
      >
        Задачи к исполнению
      </Heading>
      <Flex justify='space-between' mb='3'>
        <Box w='100px'>
          <Select placeholder='All' onChange={handleStatusFilter}>
            <option value='открыто'>Открыто</option>
            <option value='сделано'>Сделано</option>
          </Select>
        </Box>
        <Button
          colorScheme='green'
          textTransform='uppercase'
          fontWeight='semibold'
        >
          <Link to='/create-task'>Создать новую задачуk</Link>
        </Button>
      </Flex>
      <TableContainer>
        <Table px='3' border='2px solid' borderColor='gray.100'>
          <Thead backgroundColor='gray.100'>
            <Tr>
              <Th>
                <Flex
                  onClick={() => handleOrderBy('name')}
                  cursor='pointer'
                  alignItems='center'>
                  Название задачи {searchParams.get('orderBy') === 'name' && (searchParams.get('order') == 1 ? <BsArrowUp /> : <BsArrowDown />)}
                </Flex>
              </Th>
              <Th>
                <Flex
                  onClick={() => handleOrderBy('priority')}
                  cursor='pointer'
                  alignItems='center'>
                  Приоритет {searchParams.get('orderBy') === 'priority' && (searchParams.get('order') == 1 ? <BsArrowUp /> : <BsArrowDown />)}
                </Flex>
              </Th>
              <Th>
                <Flex
                  onClick={() => handleOrderBy('status')}
                  cursor='pointer'
                  alignItems='center'>
                  Статус {searchParams.get('orderBy') === 'status' && (searchParams.get('order') == 1 ? <BsArrowUp /> : <BsArrowDown />)}
                </Flex>
              </Th>
              <Th>
                <Flex
                  onClick={() => handleOrderBy('due')}
                  cursor='pointer'
                  alignItems='center'>
                  Планируемая дата завершения {searchParams.get('orderBy') === 'due' && (searchParams.get('order') == 1 ? <BsArrowUp /> : <BsArrowDown />)}
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map(task => (
              <Tr key={task._id}>
                <Td>
                  <Link
                    to={`/tasks/${task._id}`}>{task.name}</Link>
                </Td>
                <Td>
                  <Badge
                    colorScheme={task.priority === 'срочно' ?
                      'red' : 'gray'}
                  >
                    {task.priority}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={task.status === 'открыто' ?
                      'orange' : 'green'}
                  >
                    {task.status}
                  </Badge>
                </Td>
                <Td>{task.due ? new Date(task.due).toDateString() :
                  ''}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination itemCount={itemCount} pageSize={4} currentPage={page} />
    </Box >
  );
} 
