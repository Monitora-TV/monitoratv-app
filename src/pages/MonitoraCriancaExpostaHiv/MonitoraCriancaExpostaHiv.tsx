import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { MRT_EditActionButtons, MaterialReactTable, type MRT_ColumnDef, type MRT_Row, type MRT_TableOptions, useMaterialReactTable } from 'material-react-table';
import { InputLabel, OutlinedInput, useMediaQuery } from '@mui/material';   
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MonitoraCriancaExpostaHIV, Desfechocriancaexpostahiv, Coordenadoria } from '@/models/types'; // Atualize conforme o caminho do seu modelo
import axiosInstance from '@/apis/axiosInstance';
import dayjs from 'dayjs'; // Importa o dayjs

import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { UnidadeSaude } from '@/models/types'; 
import UnidadeSearch from '@/pages/UnidadeSaude/UnidadeSearch'; 
import SearchIcon from '@mui/icons-material/Search';

import { MenuItem, Select, FormControl } from '@mui/material';



const TableMonitoraCriancaExpostaHIV = () => {
  const isMobile = useMediaQuery('(max-width: 1000px)');  
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [selectedMonitoraCE, setSelecteMonitoraCE] = useState<MonitoraCriancaExpostaHIV | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false); // Modal para edição
  const [openInsertModal, setOpenInsertModal] = useState(false); // Modal para inserção
  const [newMonitoraCE, setNewMonitoraCE] = useState<MonitoraCriancaExpostaHIV>({nu_notific_sinan: '', id_paciente: 0, dt_inicio_monitoramento: new Date() });

 // Estados para a pesquisa da unidade
 const [open, setOpen] = useState(false);
 const [selectedUnidade, setSelectedUnidade] = useState<UnidadeSaude | null>(null);
 const [inputType, setInputType] = useState<string>('no_unidade'); // Armazena o tipo de input (unidade ou maternidade)


 // Funções para controle de modal e seleção de unidade
 const handleClickListItem = (type: string) => {
   setInputType(type); // Define o tipo do campo (unidade ou maternidade)
   setOpen(true); // Abre a modal
 };

 const handleClose = () => {
   setOpen(false); // Fecha a modal
 };


 const handleSelectUnidade = (unidade: UnidadeSaude, type: string) => {
  setSelectedUnidade((prev) => {
    if (type === 'no_unidade') {
      return {
        ...prev,
        id: unidade.id,
        no_unidade: unidade.no_unidade,
        cnes_unidade: unidade.cnes_unidade, // Garantir que este campo seja atribuído corretamente
      };
    }
    return prev; // Retorna o estado anterior se nenhum tipo correspondente
  });
  setOpen(false); // Fecha a modal após selecionar a unidade
};


const handleSaveMonitoraCE = async () => {
  if (selectedMonitoraCE) {
    const newValidationErrors = validateMonitoraCriancaExpostaHIV(selectedMonitoraCE);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    selectedMonitoraCE.id_unidade_monitoramento = selectedUnidade?.id; // Atualiza a unidade selecionada
    await updateMonitoraCriancaExpostaHIV(selectedMonitoraCE);
    setOpenEditModal(false);
    setSelecteMonitoraCE(null);
  }
};

  const formatDate = (date: Date) => {
    return dayjs(date).format('DD/MM/YYYY'); // Formata a data para 'dd/mm/yyyy'
  };


  const [desfechoOptions, setDesfechoOptions] = useState<{ value: number; label: string }[]>([]);  
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axiosInstance.get("/desfechocriancaexpostahiv");
        const options = response.data.map((desfechoOptions: Desfechocriancaexpostahiv) => ({
          value: desfechoOptions.id,
          label: desfechoOptions.no_desfecho_criancaexposta_hiv,
        }));
        setDesfechoOptions(options);
      } catch (error) {
        console.error('Erro ao buscar os desfechos:', error);
      }
    };

    fetchStates();
  }, []);


  // Estado para o filtro da coordenadoria
  const [coordenadoriaFilter, setCoordenadoriaFilter] = useState<string>('');
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axiosInstance.get("/coordenadoria");
        const options = response.data.map((coordenadoriaFilter: Coordenadoria) => ({
          value: coordenadoriaFilter.id,
          label: coordenadoriaFilter.no_coordenadoria,
        }));
        setCoordenadoriaFilter(options);
      } catch (error) {
        console.error('Erro ao buscar os desfechos:', error);
      }
    };

    fetchStates();
  }, []);



  
  const columns = useMemo<MRT_ColumnDef<MonitoraCriancaExpostaHIV>[]>(() => [
    {
      accessorKey: 'id',      
      header: 'ID',
      enableEditing: false,
    },
    {
      accessorKey:'nu_notific_sinan', 
      header: 'Nº SINAN',
      accessorFn: (originalRow) => (originalRow.nu_notific_sinan ?? ''),
      muiEditTextFieldProps: {
        error: !!validationErrors.nu_notific_sinan,
        helperText: validationErrors.nu_notific_sinan,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, nu_notific_sinan: undefined })),
      },
    },
    {
      accessorKey: 'dt_inicio_monitoramento', 
      accessorFn: (row) => formatDate(row.dt_inicio_monitoramento),      
      header: 'Início Monit.',
      muiEditTextFieldProps: {
        type: ('DD/MM/YYYY'), 
        error: !!validationErrors.dt_inicio_monitoramento,
        helperText: validationErrors.dt_inicio_monitoramento,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, dt_inicio_monitoramento: undefined })),
      },
    },
    {
      accessorKey: 'id_paciente', 
      header: 'id_paciente',
      muiEditTextFieldProps: {
        error: !!validationErrors.id_paciente,
        helperText: validationErrors.id_paciente,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, id_paciente: undefined })),
      },
    },
    {
      accessorKey: 'tb_paciente.no_paciente', 
      header: 'Nome',
      muiEditTextFieldProps: {
        error: !!validationErrors.tb_paciente,
        helperText: validationErrors.tb_paciente,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, tb_paciente: undefined })),
      },
    },
    { 
      accessorKey: 'tb_unidade_monitoramento.no_unidade',
      header: 'Unidade de Monitoramento',
      muiEditTextFieldProps: {
        error: !!validationErrors.tb_unidade_monitoramento,
        helperText: validationErrors.tb_unidade_monitoramento,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, tb_unidade_monitoramento: undefined })),
      },
    },
    {
      accessorKey: 'id_desfecho_criexp_hiv',
      header: 'Desfecho',
      enableEditing: true,
      Cell: ({ cell }) => {
        const idDesfechoCriexpHiv = cell.getValue<number>();
        const selectedDesfecho = desfechoOptions.find(option => option.value === idDesfechoCriexpHiv);
        return selectedDesfecho ? selectedDesfecho.label : 'Sem Desfecho';
      },
      muiEditTextFieldProps: {
        select: true,
        error: !!validationErrors.id_desfecho_criexp_hiv,
        helperText: validationErrors.id_desfecho_criexp_hiv
      },
      editSelectOptions: desfechoOptions,
    },
    {
      accessorKey: 'id_unidade_monitoramento',
      id: 'id_unidade_monitoramento',
      header: 'id_unidade_monitoramento',
      accessorFn: (row) => row.tb_unidade_monitoramento,
      Cell: () => null,  // Remover o botão da tabela
      muiEditTextFieldProps: {
        error: !!validationErrors.id_unidade_monitoramento,
        helperText: validationErrors.id_unidade_monitoramento,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, id_unidade_monitoramento: undefined })),
      },
    },
    {
      accessorKey: 'tb_unidade_monitoramento.tb_coordenadoria.no_coordenadoria',
      header: 'Coordenadoria',
      // Defina o filtro customizado aqui
      filterVariant: 'multi-select',  // ou 'multi-select' se for uma lista de opções
      enableFilterMatchHighlighting: false,
      // Filtro customizado
      muiEditTextFieldProps: {
        error: !!validationErrors.no_coordenadoria,
        helperText: validationErrors.no_coordenadoria,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, no_coordenadoria: undefined })),
      },
      // Filtro do tipo texto
      renderColumnFilter: () => (
        <TextField
          label="Filtrar Coordenadoria"
          variant="outlined"
          value={coordenadoriaFilter || ''}
          onChange={(e) => setCoordenadoriaFilter(e.target.value)} // Atualiza o filtro
          fullWidth
        />
      ),
    },
    ], [validationErrors, desfechoOptions, coordenadoriaFilter]);

  const { mutateAsync: createMonitoraCriancaExpostaHIV } = useCreateMonitoraCriancaExpostaHIV();
  const { data: fetchedMonitoraCriancaExpostaHIV = [], isLoading: isLoadingMonitoraCriancaExpostaHIV } = useGetMonitoraCriancaExpostaHIV();
  const { mutateAsync: updateMonitoraCriancaExpostaHIV } = useUpdateMonitoraCriancaExpostaHIV();
  const { mutateAsync: deleteMonitoraCriancaExpostaHIV } = useDeleteMonitoraCriancaExpostaHIV();

  
  


  const handleCreateMonitoraCriancaExpostaHIV: MRT_TableOptions<MonitoraCriancaExpostaHIV>['onCreatingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateMonitoraCriancaExpostaHIV(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createMonitoraCriancaExpostaHIV(values);
    table.setCreatingRow(null);
  };
  const handleInsertMonitoraCE = async () => {
    const newValidationErrors = validateMonitoraCriancaExpostaHIV(newMonitoraCE);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createMonitoraCriancaExpostaHIV(newMonitoraCE);
    setOpenInsertModal(false); 
    setNewMonitoraCE({ nu_notific_sinan: '', id_paciente: 0, dt_inicio_monitoramento: new Date() });
  };




  const handleSaveMonitoraCriancaExpostaHIV: MRT_TableOptions<MonitoraCriancaExpostaHIV>['onEditingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateMonitoraCriancaExpostaHIV(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateMonitoraCriancaExpostaHIV(values);
    table.setEditingRow(null);
  };


  const openDeleteConfirmModal = (row: MRT_Row<MonitoraCriancaExpostaHIV>) => {
    if (row.getValue('id')) {
      setOpenInsertModal(false);
      deleteMonitoraCriancaExpostaHIV(row.getValue('id'));
    }
  };

  const handleDelete = async (row: MRT_Row<MonitoraCriancaExpostaHIV>) => {
    try {
      await deleteMonitoraCriancaExpostaHIV(row.getValue('id'));
      alert('Registro deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar o registro:', error);
    }
  };



  const table = useMaterialReactTable({
    columns,
    data: fetchedMonitoraCriancaExpostaHIV.filter(item => {
      // Filtra os dados com base no filtro da coordenadoria
      if (coordenadoriaFilter) {
        return item.tb_unidade_monitoramento?.tb_coordenadoria?.no_coordenadoria
          .toLowerCase()
          .includes(coordenadoriaFilter.toLowerCase());
      }
      return true;
    }),
    initialState: { 
      columnVisibility: { 'id_unidade_monitoramento': false, 'id_paciente': false, 'id': false },
      showColumnFilters: true, showGlobalFilter: true 
    },
    localization: MRT_Localization_PT_BR,
    enableFacetedValues: true,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    muiToolbarAlertBannerProps: isLoadingMonitoraCriancaExpostaHIV
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateMonitoraCriancaExpostaHIV,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveMonitoraCriancaExpostaHIV,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Monitora Crianca Exposta HIV</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Adicionando o campo de Unidade Monitoramento com o botão de pesquisa */}
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <InputLabel htmlFor="no_unidade">Unidade Monitoramento</InputLabel>
            <OutlinedInput
              id="no_unidade"
              value={selectedUnidade ? selectedUnidade.no_unidade : ''}
              disabled
              label="Unidade"
              endAdornment={
                <IconButton
                  sx={{ p: '10px' }}
                  aria-label="search"
                  onClick={() => handleClickListItem('no_unidade')} // Abre a pesquisa para 'no_unidade'
                >
                  <SearchIcon />
                </IconButton>
              }
              sx={{
                width: '100%', 
                maxWidth: '600px', 
                height: '45px', 
                borderRadius: '4px', 
                padding: '0 10px', 
              }}        
            />
          </Box>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
      renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edita Monitora Crianca Exposta HIV</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Dialog para seleção de Unidade */}
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Selecione uma Unidade de Monitoramento</DialogTitle>
            <DialogContent>
              <UnidadeSearch onSelectUnidade={handleSelectUnidade} inputType={inputType} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">Fechar</Button>
            </DialogActions>
          </Dialog>
        {/* Renderização do formulário de criação e edição */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <InputLabel htmlFor="no_unidade">Unidade Monitoramento</InputLabel>
          <OutlinedInput
            id="no_unidade"
            value={selectedUnidade ? selectedUnidade.no_unidade : ''} // Exibe a unidade selecionada
            disabled
            label="Unidade"
            endAdornment={
              <IconButton
                sx={{ p: '10px' }}
                aria-label="search"
                onClick={() => handleClickListItem('no_unidade')} // Chama a pesquisa de unidades
              >
                <SearchIcon />
              </IconButton>
            }
            sx={{
              width: '100%',
              maxWidth: '600px',
              height: '45px',
              borderRadius: '4px',
              padding: '0 10px',
            }}        
          />
        </Box>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
        renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
        Inserir Cadastro
      </Button>
    ),
    state: {
      isLoading: isLoadingMonitoraCriancaExpostaHIV,
    },
  });

  return <MaterialReactTable table={table} />
};




function useCreateMonitoraCriancaExpostaHIV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (monitoraCriancaExpostaHIV: MonitoraCriancaExpostaHIV) => {
      const response = await axiosInstance.post("/monitoraCriancaExpostaHIV", monitoraCriancaExpostaHIV);
      return response.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['monitoraCriancaExpostaHIV'] }),
  });
}



export function useGetMonitoraCriancaExpostaHIV() {
  return useQuery<MonitoraCriancaExpostaHIV[]>({
    queryKey: ['monitoracriancaexpostahiv'],
    queryFn: async () => {
      const response = await axiosInstance.get("/criancaexpostahiv");
      
      // Tratando valores nulos na resposta da API
      const data = response.data.map((item: { tb_desfecho_criancaexposta_hiv: any; tb_maternidade: any; tb_unidade_monitoramento: any; tb_paciente: any; }) => ({
        ...item,
        // Garantindo que valores nulos ou undefined sejam tratados
        tb_desfecho_criancaexposta_hiv: item.tb_desfecho_criancaexposta_hiv ?? [],  // Se for null ou undefined, será um array vazio
        tb_maternidade: item.tb_maternidade ?? {},  // Se for null ou undefined, será um objeto vazio
        tb_unidade_monitoramento: item.tb_unidade_monitoramento ?? {},  // Se for null ou undefined, será um objeto vazio
        tb_paciente: item.tb_paciente ?? {},  // Se for null ou undefined, será um objeto vazio
      }));

      return data; // Retornando os dados já tratados
    },
    refetchOnWindowFocus: false,
  });
}

function useUpdateMonitoraCriancaExpostaHIV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (monitoraCriancaExpostaHIV: MonitoraCriancaExpostaHIV) => {
      const response = await axiosInstance.patch(`/criancaexpostahiv/${monitoraCriancaExpostaHIV.id}`,
        {
          id_desfecho_criexp_hiv: Number(monitoraCriancaExpostaHIV.id_desfecho_criexp_hiv),
          id_unidade_monitoramento: Number(monitoraCriancaExpostaHIV.id_unidade_monitoramento),
        }
      );
      return response.data;
    },
    onMutate: (newUserInfo: MonitoraCriancaExpostaHIV) => {
      queryClient.setQueryData(['monitoraCriancaExpostaHIV'], (prevUsers: MonitoraCriancaExpostaHIV[]) =>
        prevUsers?.map((prevUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
        ),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['monitoraCriancaExpostaHIV'] }),
  });
}

function useDeleteMonitoraCriancaExpostaHIV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (monitoraCriancaExpostaHIVId: number) => {
      await axiosInstance.delete(`/criancaexpostahiv/${monitoraCriancaExpostaHIVId}`);
      return monitoraCriancaExpostaHIVId;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['monitoraCriancaExpostaHIV'] }),
  });
}


const MonitoraCriancaExpostaHIVPage = () => ( <TableMonitoraCriancaExpostaHIV /> );
export default MonitoraCriancaExpostaHIVPage;


function validateMonitoraCriancaExpostaHIV(values: MonitoraCriancaExpostaHIV) {
  return {
    dt_inicio_monitoramento: !values.dt_inicio_monitoramento ? 'Data Início obrigatória' : '',
    id_paciente: !values.id_paciente ? 'Paciente obrigatorio' : '',
    id_unidade_monitoramento: !values.id_unidade_monitoramento ? 'Unidade de Monitoramento obrigatoria' : '',
  };
}
