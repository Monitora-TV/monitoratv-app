import { useEffect, useMemo, useState } from 'react';
import { MRT_EditActionButtons, MaterialReactTable, createMRTColumnHelper,  MRT_TableContainer,  MRT_TableHeadCellFilterContainer,
   type MRT_ColumnDef, type MRT_Row, type MRT_TableOptions, useMaterialReactTable } from 'material-react-table';
import { Paper, Stack, useMediaQuery } from '@mui/material';   
import { Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MonitoraCriancaExpostaHIV, Desfechocriancaexpostahiv } from '@/models/types'; // Atualize conforme o caminho do seu modelo
import axiosInstance from '@/apis/axiosInstance';
import dayjs from 'dayjs'; // Importa o dayjs
import { rows } from '@/components/data/gridData';

const columnHelper = createMRTColumnHelper<MonitoraCriancaExpostaHIV>();

const TableMonitoraCriancaExpostaHIV = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  const isMobile = useMediaQuery('(max-width: 1000px)');  

  const formatDate = (date: Date) => {
    return dayjs(date).format('DD/MM/YYYY'); // Formata a data para 'dd/mm/yyyy'
  };  

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'ID',
      enableEditing: false,
      size: 10,
    }),
    columnHelper.accessor('nu_notific_sinan', {
      header: 'Nº SINAN',
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors.nu_notific_sinan,
        helperText: validationErrors.nu_notific_sinan,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, nu_notific_sinan: undefined })),
      },
    }),
    columnHelper.accessor((row) => formatDate(row.dt_inicio_monitoramento), {
        header: 'Início Monit.',
        // Exibir a data formatada na tabela
        muiEditTextFieldProps: {
          required: true,
          type: ('DD/MM/YYYY'), // O tipo continua 'date', mas usaremos 'dayjs' para formatação
          error: !!validationErrors.dt_inicio_monitoramento,
          helperText: validationErrors.dt_inicio_monitoramento,
          onFocus: () => setValidationErrors((prev) => ({ ...prev, dt_inicio_monitoramento: undefined })),
        },
      }),
      columnHelper.accessor('tb_paciente.no_paciente', {
      header: 'Nome do Paciente',
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors.no_paciente,
        helperText: validationErrors.no_paciente,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, no_paciente: undefined })),
      },
    }),
    columnHelper.accessor('tb_unidade_monitoramento.no_unidade', {
      header: 'Unidade de Monitoramento',
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors.no_unidade,
        helperText: validationErrors.no_unidade,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, no_unidade: undefined })),
      },
    }),
    columnHelper.accessor('tb_unidade_monitoramento.tb_coordenadoria.no_coordenadoria', {
      header: 'Coordenadoria',
      filterVariant: 'select',
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors.no_coordenadoria,
        helperText: validationErrors.no_coordenadoria,
        onFocus: () => setValidationErrors((prev) => ({ ...prev, no_coordenadoria: undefined })),
      },
    }),

  ], [validationErrors]);

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
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteMonitoraCriancaExpostaHIV(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedMonitoraCriancaExpostaHIV,
    enableFacetedValues: true,
    initialState: { showColumnFilters: true, columnVisibility: { id: false } },    
    columnFilterDisplayMode: 'custom', //we will render our own filtering UI
    muiFilterTextFieldProps: ({ column }) => ({
      label: `Filter by ${column.columnDef.header}`,
    }),    
    //initialState: { columnVisibility: { id: false } }, //hide firstName column by default
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

  return <MaterialReactTable table={table} />;
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
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
}

function useUpdateMonitoraCriancaExpostaHIV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (monitoraCriancaExpostaHIV: MonitoraCriancaExpostaHIV) => {
      const response = await axiosInstance.patch(`/criancaexpostahiv/${monitoraCriancaExpostaHIV.id}`, monitoraCriancaExpostaHIV);
      return response.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['criancaexpostahiv'] }),
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

const MonitoraCriancaExpostaHIVPage = () => (
  <QueryClientProvider client={new QueryClient()}>
    <TableMonitoraCriancaExpostaHIV />
  </QueryClientProvider>
);

export default MonitoraCriancaExpostaHIVPage;

function validateMonitoraCriancaExpostaHIV(values: MonitoraCriancaExpostaHIV) {
  return {
    nu_notific_sinan: !values.nu_notific_sinan ? 'Nº Notificação is required' : '',
    dt_inicio_monitoramento: !values.dt_inicio_monitoramento ? 'Data Início is required' : '',
    no_paciente: !values.id_paciente ? 'Nome do Paciente is required' : '',
    no_unidade: !values.id_unidade_monitoramento ? 'Unidade de Monitoramento is required' : '',
  };
}
