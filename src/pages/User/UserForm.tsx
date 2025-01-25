import * as React from 'react';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FormData {
  firstName: string;
  lastName: string;
  age: number;
}

export default function UserForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();
  const location = useLocation();
  const [editingRow, setEditingRow] = React.useState<any | null>(location.state?.row || null);

  React.useEffect(() => {
    if (editingRow) {
      reset(editingRow);
    }
  }, [editingRow, reset]);

  const onSubmit = (data: FormData) => {
    if (editingRow) {
      // Atualizando um registro existente
      axios.put(`http://localhost:3000/records/${editingRow.id}`, data)
        .then(() => {
          navigate('/user');
        })
        .catch((error) => {
          console.error('Erro ao salvar os dados:', error);
        });
    } else {
      // Adicionando um novo registro
      axios.post('http://localhost:3000/records', data)
        .then(() => {
          navigate('/user');
        })
        .catch((error) => {
          console.error('Erro ao salvar os dados:', error);
        });
    }
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <h2>{editingRow ? 'Edit Record' : 'Add Record'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>First Name:</label>
          <input
            {...register('firstName', { required: 'First Name is required' })}
            defaultValue={editingRow ? editingRow.firstName : ''}
          />
          {errors.firstName && <span>{errors.firstName.message}</span>}
        </div>
        <div>
          <label>Last Name:</label>
          <input
            {...register('lastName', { required: 'Last Name is required' })}
            defaultValue={editingRow ? editingRow.lastName : ''}
          />
          {errors.lastName && <span>{errors.lastName.message}</span>}
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            {...register('age', { required: 'Age is required' })}
            defaultValue={editingRow ? editingRow.age : ''}
          />
          {errors.age && <span>{errors.age.message}</span>}
        </div>
        <div>
          <Button type="submit" variant="contained">
            {editingRow ? 'Save Changes' : 'Add Record'}
          </Button>
        </div>
      </form>
    </Box>
  );
}
