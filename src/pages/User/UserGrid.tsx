import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper'; // Importação do Paper, conforme o exemplo do MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function UserGrid() {
  const [rows, setRows] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false); // Estado para controle da modal
  const [deleteId, setDeleteId] = React.useState<number | null>(null); // ID do registro a ser excluído

  // Função de exclusão
  const handleDelete = (id: number) => {
    // Exibe a modal de confirmação
    setDeleteId(id);
    setOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      axios
        .delete(`http://localhost:3000/records/${deleteId}`)
        .then(() => {
          // Atualiza a grid removendo a linha excluída
          setRows((prevRows) => prevRows.filter((row) => row.id !== deleteId));
          setOpen(false); // Fecha a modal após a exclusão
        })
        .catch((error) => {
          console.error('Erro ao excluir o registro:', error);
          setOpen(false); // Fecha a modal mesmo se ocorrer erro
        });
    }
  };

  const cancelDelete = () => {
    setOpen(false); // Fecha a modal se o usuário cancelar
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'firstName', headerName: 'First Name', width: 150, editable: true },
    { field: 'lastName', headerName: 'Last Name', width: 150, editable: true },
    { field: 'age', headerName: 'Age', type: 'number', width: 110, editable: true },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 110,
      renderCell: (params) => {
        return (
          <Link to="/userform" state={{ row: params.row }}>
            <Button variant="contained">Edit</Button>
          </Link>
        );
      },
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 110,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  React.useEffect(() => {
    axios
      .get('http://localhost:3000/records')
      .then((response) => {
        console.log(response.data); // Verifique os dados retornados
        const data = response.data || []; // Garante que seja um array
        setRows(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar os dados:', error);
      });
  }, []);

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Paper sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }} // Define o modelo de paginação inicial
        pageSizeOptions={[5, 10]} // Definindo opções de paginação
        checkboxSelection
        sx={{ border: 0 }}
      />
      <Link to="/userform">
        <Button variant="contained" sx={{ marginTop: 2 }}>
          Add Record
        </Button>
      </Link>

      {/* Modal de confirmação */}
      <Dialog open={open} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this record?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
