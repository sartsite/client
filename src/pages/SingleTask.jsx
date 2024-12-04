import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BsChevronLeft } from 'react-icons/bs';
import {
  Badge,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Link,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/react';
import toast from 'react-hot-toast';

import { API_BASE_URL } from '../util';
import SingleTaskSkeleton from '../_skeletons/SingleTaskSkeleton';
import DeleteConfirmation from '../components/DeleteConfirmation';

export default function SingleTask() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [task, setTask] = useState();
  const { taskId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setTask(data);
    };
    fetchTask();
  }, []);

  const handleDeleteTask = async () => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`,
      {
        credentials: 'include',
        method: 'DELETE',
      }
    );
    const data = await res.json();
    if (res.status === 200) {
      toast.success(data.message);
      navigate('/tasks');
    } else {
      toast.error(data.message);
    }
  };

  if (!task) {
    return <SingleTaskSkeleton />;
  }
  return (
    <Box p='3' maxW='lg' mx='auto'>
      <Link
        as={RouterLink}
        to={`/tasks`}
        color='teal'
        _hover={{ textDecor: 'none' }}
        display='flex'
        alignItems='center'
      >
        <BsChevronLeft /> Все задачи
      </Link>
      <Heading fontSize='3xl' fontWeight='semibold' textAlign='center'
        my='7'>
        {task.name}
      </Heading>
      <Stack direction='row'>
        <Badge
          fontSize='md'
          colorScheme={task.status === 'открыто' ? 'orange' : 'green'}
        >
          {task.status}
        </Badge>
        {task.due && <Text>{new
          Date(task.due).toLocaleDateString()}</Text>}
        <Badge
          fontSize='md'
          colorScheme={task.priority === 'срочно' ? 'red' : 'gray'}
        >
          {task.priority}
        </Badge>
      </Stack>
      <Card mt='4' border='1px solid' borderColor='gray.200'>
        <CardBody>
          <Text>{task.description}</Text>
        </CardBody>
      </Card>
      <Flex justify='space-between' mt='5'>
        <Text as='span' color='red.600' cursor='pointer' onClick={onOpen}>
          Удалить задачу
        </Text>
        <Link
          as={RouterLink}
          to={`/update-task/${task._id}`}
          color='teal'
          _hover={{ textDecor: 'none' }}
        >
          Изменить задачу
        </Link>
      </Flex>
      <DeleteConfirmation
        alertTitle='Delete Task'
        handleClick={handleDeleteTask}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
} 