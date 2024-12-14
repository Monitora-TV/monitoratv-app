import { useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, TextField } from '@mui/material';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMediaQuery } from '@mui/material';   
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UnidadeSaude } from '@/models/types'; 
import UnidadeSearch from './UnidadeSearch'; 
import axiosInstance from '@/apis/axiosInstance';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';

const TableUnidadeSaude = () => {
  const [selectedUnidade, setSelectedUnidade] = useState<UnidadeSaude | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [openEditModal, setOpenEditModal] = useState(false); // Modal para edição
  const [openInsertModal, setOpenInsertModal] = useState(false); // Modal para inserção
  const [newUnidade, setNewUnidade] = useState<UnidadeSaude>({no_unidade: '',cnes_unidade: '',});
  const isMobile = useMediaQuery('(max-width: 1000px)');  

  const columns = useMemo<MRT_ColumnDef<UnidadeSaude>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      enableEditing: false,
    },
    {
      accessorKey: 'no_unidade',
      header: 'Unidade',
      accessorFn: (originalRow) => (originalRow.no_unidade ?? ''),
    },
    {
      accessorKey: 'cnes_unidade',
      header: 'CNES',
      accessorFn: (originalRow) => (originalRow.cnes_unidade ?? ''),
    },
  ], [validationErrors]);

  const { mutateAsync: createUnidadeSaude } = useCreateUnidadeSaude();
  const { data: fetchedUnidadeSaude = [], isLoading: isLoadingUnidadeSaude } = useGetUnidadeSaude();
  const { mutateAsync: updateUnidadeSaude } = useUpdateUnidadeSaude();
  const { mutateAsync: deleteUnidadeSaude } = useDeleteUnidadeSaude();

  const handleEditRowClick = (row: UnidadeSaude) => {
    setSelectedUnidade(row);
    setOpenEditModal(true); // Abre a modal de edição
  };

    

  const handleSaveUnidadeSaude = async () => {
    if (selectedUnidade) {
      const newValidationErrors = validateUnidadeSaude(selectedUnidade);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateUnidadeSaude(selectedUnidade);
      setOpenEditModal(false); // Fecha a modal após salvar
      setSelectedUnidade(null); // Limpa a seleção
    }
  };

  const handleInsertUnidadeSaude = async () => {
    const newValidationErrors = validateUnidadeSaude(newUnidade);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUnidadeSaude(newUnidade);
    setOpenInsertModal(false); // Fecha a modal após salvar
    setNewUnidade({ no_unidade: '', cnes_unidade: '' }); // Limpa os campos
  };

  
  const openDeleteConfirmModal = (row: UnidadeSaude) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteUnidadeSaude(Number(row.id));
    }
  };

  // Função chamada quando uma unidade é selecionada no componente UnidadeSearch
  const handleSelectUnidade = (unidade: UnidadeSaude) => {
    setSelectedUnidade(unidade);
  };




  return (
    <Box>
      {/* Botão Inserir */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setOpenInsertModal(true)} 
        sx={{ marginBottom: '1rem' }}
      >
        Inserir
      </Button>

      {/* Tabela */}
      <MaterialReactTable
        columns={columns}
        data={fetchedUnidadeSaude}
        initialState={{ columnVisibility: { 'id': false } }}
        localization={MRT_Localization_PT_BR}
        enableEditing={true}
        muiToolbarAlertBannerProps={isLoadingUnidadeSaude ? { color: 'error', children: 'Error loading data' } : undefined}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '2rem' }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleEditRowClick(row.original)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => openDeleteConfirmModal(row.original)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />

      {/* Modal de Edição */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Unidade de Saúde</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <TextField
            label="Unidade"
            value={selectedUnidade?.no_unidade || ''}
            onChange={(e) => setSelectedUnidade({ ...selectedUnidade!, no_unidade: e.target.value })}
            error={!!validationErrors.no_unidade}
            helperText={validationErrors.no_unidade}
          />
          <TextField
            label="CNES"
            value={selectedUnidade?.cnes_unidade || ''}
            onChange={(e) => setSelectedUnidade({ ...selectedUnidade!, cnes_unidade: e.target.value })}
            error={!!validationErrors.cnes_unidade}
            helperText={validationErrors.cnes_unidade}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Cancelar</Button>
          <Button onClick={handleSaveUnidadeSaude}>Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Inserção */}
      <Dialog open={openInsertModal} onClose={() => setOpenInsertModal(false)}>
        <DialogTitle>Inserir Unidade de Saúde</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            label="Unidade"
            value={newUnidade.no_unidade}
            onChange={(e) => setNewUnidade({ ...newUnidade, no_unidade: e.target.value })}
            error={!!validationErrors.no_unidade}
            helperText={validationErrors.no_unidade}
          />
          <TextField
            label="CNES"
            value={newUnidade.cnes_unidade}
            onChange={(e) => setNewUnidade({ ...newUnidade, cnes_unidade: e.target.value })}
            error={!!validationErrors.cnes_unidade}
            helperText={validationErrors.cnes_unidade}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInsertModal(false)}>Cancelar</Button>
          <Button onClick={handleInsertUnidadeSaude}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function useCreateUnidadeSaude() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (UnidadeSaude: UnidadeSaude) => {
      const response = await axiosInstance.post("/unidadesaude", UnidadeSaude);
      return response.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['UnidadeSaude'] }),
  });
}

function useGetUnidadeSaude() {
  return useQuery<UnidadeSaude[]>({
    queryKey: ['UnidadeSaude'],
    queryFn: async () => {
      const response = await axiosInstance.get("/unidadesaude");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
}

function useUpdateUnidadeSaude() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (UnidadeSaude: UnidadeSaude) => {
      const response = await axiosInstance.patch(`/unidadesaude/${UnidadeSaude.id}`, UnidadeSaude);
      return response.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['UnidadeSaude'] }),
  });
}

function useDeleteUnidadeSaude() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (UnidadeSaudeId: number) => {
      await axiosInstance.delete(`/unidadesaude/${UnidadeSaudeId}`);
      return UnidadeSaudeId;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['UnidadeSaude'] }),
  });
}

function validateUnidadeSaude(values: UnidadeSaude) {
  return {
    no_unidade: !values.no_unidade ? 'Nome da unidade é obrigatório' : '',
  };
}

const UnidadeSaudePage = () => <TableUnidadeSaude />;
export default UnidadeSaudePage;
