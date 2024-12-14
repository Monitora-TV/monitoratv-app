import { useEffect, useMemo, useState } from 'react';
import { MRT_EditActionButtons, MaterialReactTable, type MRT_ColumnDef, type MRT_Row, type MRT_TableOptions, useMaterialReactTable } from 'material-react-table';
import { useMediaQuery } from '@mui/material';   
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MonitoraCriancaExpostaHIV, Desfechocriancaexpostahiv } from '@/models/types'; // Atualize conforme o caminho do seu modelo
import axiosInstance from '@/apis/axiosInstance';
import dayjs from 'dayjs'; // Importa o dayjs

import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { UnidadeSaude } from '@/models/types'; 
import UnidadeSearch from '@/pages/UnidadeSaude/UnidadeSearch'; 




//const columnHelper = createMRTColumnHelper<MonitoraCriancaExpostaHIV>();

const TableMonitoraCriancaExpostaHIV = () => {


  const isMobile = useMediaQuery('(max-width: 1000px)');  
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  const [selectedMonitoraCE, setSelecteMonitoraCE] = useState<MonitoraCriancaExpostaHIV | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false); // Modal para edição
  const [openInsertModal, setOpenInsertModal] = useState(false); // Modal para inserção
  const [newMonitoraCE, setNewMonitoraCE] = useState<MonitoraCriancaExpostaHIV>({nu_notific_sinan: '', id_paciente: 0, dt_inicio_monitoramento: new Date() });

  // Função chamada quando uma unidade é selecionada no componente UnidadeSearch
  const [selectedUnidade, setSelectedUnidade] = useState<UnidadeSaude | null>(null);



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
        //setDesfechoOptions([{ value: null, label: "(Sem Desfecho)" }, ...options]);        
        setDesfechoOptions(options);
      } catch (error) {
        console.error('Erro ao buscar os desfechos:', error);
      }
    };

    fetchStates();
  }, []);
  console.log(desfechoOptions);



  const columns = useMemo<MRT_ColumnDef<MonitoraCriancaExpostaHIV>[]>(() => [
    {
      accessorKey: 'id',      
      header: 'ID',
      enableEditing: false,
    },
    {
      accessorKey:'nu_notific_sinan', 
      header: 'Nº SINAN',
      accessorFn: (originalRow) => (originalRow.nu_notific_sinan ?? ''), //must be strings
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
        //required: true,
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
      accessorKey: 'id_unidade_monitoramento',
      header: 'id_unidade_monitoramento',
      
      muiEditTextFieldProps: {
        error: !!validationErrors.id_unidade_monitoramento,
        helperText: validationErrors.id_unidade_monitoramento,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, id_unidade_monitoramento: undefined })),
      },
    },
    {
      accessorKey: 'id_desfecho_criexp_hiv',
      header: 'Desfecho',
      enableEditing: true,
      //filterVariant: 'select',
      Cell: ({ cell }) => {
        const idDesfechoCriexpHiv = cell.getValue<number>(); // Ensure the type is correct
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
      accessorKey: 'tb_unidade_monitoramento.tb_coordenadoria.no_coordenadoria',
      header: 'Coordenadoria',
      filterVariant: 'multi-select',
      muiFilterTextFieldProps: ({ column }) => ({
        label: '',
      }),
      enableFilterMatchHighlighting: false,
      muiEditTextFieldProps: {
        error: !!validationErrors.no_coordenadoria,
        helperText: validationErrors.no_coordenadoria,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, no_coordenadoria: undefined })),
      },
    },
  ], [validationErrors, desfechoOptions]);


  const { mutateAsync: createMonitoraCriancaExpostaHIV } = useCreateMonitoraCriancaExpostaHIV();
  const { data: fetchedMonitoraCriancaExpostaHIV = [], isLoading: isLoadingMonitoraCriancaExpostaHIV } = useGetMonitoraCriancaExpostaHIV();
  const { mutateAsync: updateMonitoraCriancaExpostaHIV } = useUpdateMonitoraCriancaExpostaHIV();
  const { mutateAsync: deleteMonitoraCriancaExpostaHIV } = useDeleteMonitoraCriancaExpostaHIV();

  const handleEditRowClick = (row: MonitoraCriancaExpostaHIV) => {
    setSelecteMonitoraCE(row);
    setSelectedUnidade(row.tb_unidade_monitoramento);
    setOpenEditModal(true); // Abre a modal de edição
  };





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

  // nova modal desacoplada
  const handleInsertMonitoraCE = async () => {
    const newValidationErrors = validateMonitoraCriancaExpostaHIV(newMonitoraCE);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createMonitoraCriancaExpostaHIV(newMonitoraCE);
    setOpenInsertModal(false); // Fecha a modal após salvar
    setNewMonitoraCE({ nu_notific_sinan: '', id_paciente: 0, dt_inicio_monitoramento: new Date() }); // Limpa os campos
  };

        /*  
        onCreatingRowSave: handleCreateMonitoraCriancaExpostaHIV,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveMonitoraCriancaExpostaHIV,
        */

  //  modal tanstack
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


  // nova modal desacoplada
  const handleSaveMonitoraCE = async () => {
    if (selectedMonitoraCE) {
      const newValidationErrors = validateMonitoraCriancaExpostaHIV(selectedMonitoraCE);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      selectedMonitoraCE.id_unidade_monitoramento = selectedUnidade?.id;
      await updateMonitoraCriancaExpostaHIV(selectedMonitoraCE);
      setOpenEditModal(false); // Fecha a modal após salvar
      setSelecteMonitoraCE(null); // Limpa a seleção
    }
  };  

  // nova modal desacoplada
  // Função chamada quando uma unidade é selecionada no componente UnidadeSearch
  const handleSelectUnidade = (unidade: UnidadeSaude) => {
    setSelectedUnidade(unidade);
  };



  const openDeleteConfirmModal = (row: MRT_Row<MonitoraCriancaExpostaHIV>) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMonitoraCriancaExpostaHIV(Number(row.original.id));
    }
  };


  const table = useMaterialReactTable({
    columns,
    data: fetchedMonitoraCriancaExpostaHIV,
    initialState: { 
      //columnVisibility: {'id_unidade_monitoramento': false, 'id_paciente': false, 'id': false},
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
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} >
          <UnidadeSearch onSelectUnidade={handleSelectUnidade} />

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
          <UnidadeSearch onSelectUnidade={handleSelectUnidade} />

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
          id_desfecho_criexp_hiv: monitoraCriancaExpostaHIV.id_desfecho_criexp_hiv,
          id_unidade_monitoramento: monitoraCriancaExpostaHIV.id_unidade_monitoramento,
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
