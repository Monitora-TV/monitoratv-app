import { useEffect, useMemo, useState } from 'react';
import { MRT_EditActionButtons, MaterialReactTable, type MRT_ColumnDef, type MRT_Row, type MRT_TableOptions, useMaterialReactTable } from 'material-react-table';
import { InputLabel, OutlinedInput, useMediaQuery } from '@mui/material';   
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MonitoraCriancaExpostaHIV, Desfechocriancaexpostahiv, Coordenadoria } from '@/models/types'; // Atualize conforme o caminho do seu modelo
import axiosInstance from '@/apis/axiosInstance';
import dayjs from 'dayjs'; // Importa o dayjs

import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { UnidadeSaude } from '@/models/types'; 
import UnidadeSearch from '@/pages/UnidadeSaude/UnidadeSearch'; 
import SearchIcon from '@mui/icons-material/Search';

import { useCreateMonitoraCriancaExpostaHIV, useDeleteMonitoraCriancaExpostaHIV, useGetMonitoraCriancaExpostaHIV, useUpdateMonitoraCriancaExpostaHIV } from './api';



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


  const [coordenadoriaOptions, setcoordenadoriaOptions] = useState<{ value: number; label: string }[]>([]); // Change the name here
  // Função para buscar as coordenadoriaOptions
  useEffect(() => {
    const fetchcoordenadoriaOptions = async () => {
      try {
        const response = await axiosInstance.get("/coordenadoria");
        const options = response.data.map((coordenadoria: Coordenadoria) => ({
          value: coordenadoria.id,
          label: coordenadoria.no_coordenadoria,
        }));
        setcoordenadoriaOptions(options);
      } catch (error) {
        console.error('Erro ao buscar coordenadoriaOptions:', error);
      }
    };

    fetchcoordenadoriaOptions();
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
      accessorFn: (row) => row.tb_unidade_monitoramento?.no_unidade,
      header: 'Unidade Monit.',
      id: 'no_unidade',
    },
    {
      accessorKey: 'id_unidade_monitoramento',
      header: 'Unidade teste',
      // Exibe id_unidade_monitoramento junto com no_unidade na tabela
      accessorFn: (row) => row.tb_unidade_monitoramento,
      Edit: ({ cell, column, row, table }) => {
        const unidade = row.original.tb_unidade_monitoramento?.no_unidade;
        return (
          <div>
     <InputLabel htmlFor="no_unidade">Unidade Monit.</InputLabel>            
        <OutlinedInput
          id="no_unidade"
          value={selectedUnidade ? selectedUnidade.no_unidade : unidade}
          disabled
          label="Nome"
          endAdornment={
            <IconButton
              sx={{ p: '10px' }}
              aria-label="search"
              onClick={() => handleClickListItem('no_unidade')} // Passa 'no_unidade' para identificar o campo de unidade
            >
              <SearchIcon />
            </IconButton>
          }
          sx={{
            width: '100%', // Ajusta para ocupar 100% do espaço disponível
            maxWidth: '600px', // Define um limite máximo de largura
            height: '45px', // Aumenta a altura do input
            borderRadius: '4px', // Adiciona bordas arredondadas para o estilo
            padding: '0 10px', // Ajusta o padding interno
          }}        
        />
          </div>
        );
      },
    },
        {
      accessorKey: 'id_desfecho_criexp_hiv',
      header: 'Desfecho',
      filterVariant:'select',
      filterSelectOptions: desfechoOptions,
      enableEditing: true,
      Cell: ({ cell }) => {
        const selectedDesfecho = desfechoOptions.find(option => option.value === cell.getValue<number>());
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
      accessorKey: 'tb_unidade_monitoramento.id_coordenadoria',
      header: 'Coordenadoria',
      id: 'id_coordenadoria',
      enableEditing: false, 
      filterVariant:'select',
      filterSelectOptions: coordenadoriaOptions,
      Cell: ({ cell }) => {
        const idCoordenadoria = cell.getValue<number>();
        const selectedCoordenadoria = coordenadoriaOptions.find(option => option.value === idCoordenadoria);
        return selectedCoordenadoria ? selectedCoordenadoria.label : 'Sem Coordenadoria';
      },
    },
    ], [validationErrors, desfechoOptions]); // , coordenadoriaOptions

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
    data: fetchedMonitoraCriancaExpostaHIV,
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
        <DialogTitle variant="h3">Edita Monitoramento Crianca Exposta HIV</DialogTitle>
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
          { internalEditComponents }
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

  /*
  return (
    <div>
      <DialogContent>
        <Box>
          <InputLabel htmlFor="desfecho">Desfecho</InputLabel>
          <Select
            id="desfecho"
            value={filters['id_desfecho_criexp_hiv'] || ''}
            onChange={(e) => handleChangeFilter('id_desfecho_criexp_hiv', e.target.value)}
          >
            <MenuItem value="">Nenhum</MenuItem>
            {desfechoOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>

      <MaterialReactTable table={table} />
    </div>
  );
  */
};



const MonitoraCriancaExpostaHIVPage = () => ( <TableMonitoraCriancaExpostaHIV /> );
export default MonitoraCriancaExpostaHIVPage;


function validateMonitoraCriancaExpostaHIV(values: MonitoraCriancaExpostaHIV) {
  return {
    dt_inicio_monitoramento: !values.dt_inicio_monitoramento ? 'Data Início obrigatória' : '',
    id_paciente: !values.id_paciente ? 'Paciente obrigatorio' : '',
    id_unidade_monitoramento: !values.id_unidade_monitoramento ? 'Unidade de Monitoramento obrigatoria' : '',
  };
}
