import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from 'react-hook-form';
import { API_BASE_URL } from '../util';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Button,
} from '@chakra-ui/react';

export default function TaskForm({ type, task }) {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues:
      type === 'update'
        ? {
          ...task,
          due: task.due ? new Date(task.due) : '',
        }
        : {},
  });

  const navigate = useNavigate();

  const doSubmit = async values => {
    if (type === 'create') {
      const res = await fetch(`${API_BASE_URL}/tasks/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const response = await res.json();
      if (res.status === 200) {
        toast.success(`New Task Created: ${values.name}`);
        navigate(`/tasks/${response.insertedId}`);
      } else {
        toast.error(response.message);
      }
    }
    if (type === 'update') {
      delete values._id;
      const res = await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const response = await res.json();
      if (res.status === 200) {
        toast.success(`Task Updated: ${values.name}`);
        navigate(`/tasks/${task._id}`);
      } else {
        toast.error(response.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(doSubmit)}>
      <Stack direction={{ base: 'column', md: 'row' }} gap='4'>
        <Flex direction='column' flex='1' gap='4'>

          <Flex direction='column' flex='1' gap='4'>
            <FormControl isInvalid={errors.name}>
              <Input
                id='name'
                type='text'
                placeholder='Название задачи'
                {...register('name', { required: 'Название задачи обязательно' })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.description}>
              <Textarea
                id='description'
                type='text'
                placeholder='Описание'
                rows={4}
                {...register('description', {
                  required: 'Описание обязательно',
                })}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <Flex direction='column' flex='1' gap='4'>
          </Flex>
        </Flex>
        <Flex direction='column' flex='1' gap='4'>
          <Flex direction='column' flex='1' gap='4'>
            <FormControl isInvalid={errors.priority}>
              <Select
                placeholder='Приоритет'
                {...register('priority', {
                  required: 'Приоритет обязателен'
                })}
              >
                <option value='срочно'>Срочно</option>
                <option value='не срочно'>Не срочно</option>
              </Select>
              <FormErrorMessage>
                {errors.priority && errors.priority.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.status}>
              <Select
                placeholder='Статус'
                {...register('status', {
                  required: 'Статус обязателен'
                })}
              >
                <option value='открыто'>Открыто</option>
                <option value='сделано'>Сделано</option>
              </Select>
              <FormErrorMessage>
                {errors.status && errors.status.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl sx={{
              '.react-datepicker-wrapper': {
                width: '100%',
              },
            }}>
              <Controller
                control={control}
                name='due'
                render={({ field }) => (
                  <Input
                    as={DatePicker}
                    id='due'
                    {...field}
                    selected={field.value}
                    showTimeSelect
                    timeInputLabel='Time:'
                    dateFormat='MM/dd/yyyy h:mm aa'
                    placeholderText='Планируемая дата завершения (опционально)'
                  />
                )}
              />
            </FormControl>
            <Button
              type='submit'
              isLoading={isSubmitting}
              colorScheme='teal'
              textTransform='uppercase'
            >
              Сохранить
            </Button>
          </Flex>
        </Flex>
      </Stack >
    </form >
  );
} 
