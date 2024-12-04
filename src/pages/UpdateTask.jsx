import { API_BASE_URL } from '../util';
import { useState, useEffect } from 'react'
import { BsChevronLeft } from 'react-icons/bs';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Heading, Link } from '@chakra-ui/react';
import TaskForm from '../components/TaskForm';
import UpdateTaskSkeleton from '../_skeletons/UpdateTaskSkeleton';

export default function UpdateTask() {
  const [task, setTask] = useState();
  const { taskId } = useParams();

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

  if (!task) {
    return <UpdateTaskSkeleton />;
  }
  return (
    <Box p='3' maxW='4xl' mx='auto'>
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
      <Heading
        as='h1'
        fontSize='3xl'
        fontWeight='semibold'
        textAlign='center'
        my='7'
      >
        Изменение задачи
      </Heading>
      <TaskForm type='update' task={task} />
    </Box>
  );
} 
