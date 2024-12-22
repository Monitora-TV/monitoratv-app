import * as React from 'react';
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



  const [open, setOpen] = React.useState(false);
  const [inputType, setInputType] = React.useState<string>('no_unidade'); // Armazena o tipo de input (unidade ou maternidade)

  const [selectedUnidade, setSelectedUnidade] = React.useState<UnidadeSaude | null>(null);
  const [selectedMaternidade, setSelectedMaternidade] = React.useState<UnidadeSaude | null>(null);


  const handleClickListItem = (type: string) => {
    setInputType(type); // Define o tipo do campo (unidade ou maternidade)
    setOpen(true); // Abre a modal
  };

  const handleClose = () => {
    setOpen(false); // Fecha a modal
  };


  //setSelectedUnidade

  const handleSelectUnidade = (unidade: UnidadeSaude, type: string) => {

    if (type === 'no_unidade') {
      setSelectedUnidade((prev) => {
        return {
          ...prev,
          id: unidade.id,
          no_unidade: unidade.no_unidade,
          cnes_unidade: unidade.cnes_unidade, // Garantir que este campo seja atribuído corretamente
        };
      })
      } else if (type === 'no_maternidade') {
        setSelectedMaternidade((prev) => {
        return {
          ...prev,
          id: unidade.id,
          no_unidade: unidade.no_unidade, // No caso da maternidade, você pode atualizar o nome de unidade aqui
          cnes_unidade: unidade.cnes_unidade,
        };
      })};

    setOpen(false); // Fecha a modal
  };


  const handleSaveMonitoraCE = async (original: MonitoraCriancaExpostaHIV) => {
    if (selectedMonitoraCE) {
      const newValidationErrors = validateMonitoraCriancaExpostaHIV(selectedMonitoraCE);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      
      // Verifique se a unidade foi selecionada e adicione o id_unidade_monitoramento
      if (selectedUnidade) {
        selectedMonitoraCE.id_unidade_monitoramento = selectedUnidade.id;  // Atualiza a unidade no objeto
      }

      await updateMonitoraCriancaExpostaHIV(selectedMonitoraCE); // Função de atualização do registro
      setOpenEditModal(false); // Fecha o modal após salvar
      setSelecteMonitoraCE(null); // Limpa a seleção
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
      enableEditing:true,
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
      header: 'Name',
      muiEditTextFieldProps: ({ cell }) => ({
        onBlur: (event) => {
          console.info(event);
        },
      }),
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
      accessorKey: 'tb_unidade_monitoramento.no_unidade',
      header: 'Unidade Monit',
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



  const handleSaveMonitoraCriancaExpostaHIV: MRT_TableOptions<MonitoraCriancaExpostaHIV>['onEditingRowSave'] = async ({ values, table, exitEditingMode }) => {
    const newValidationErrors = validateMonitoraCriancaExpostaHIV(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateMonitoraCriancaExpostaHIV(values); // Atualiza o valor na API ou banco de dados

    // Após salvar, sai do modo de edição
    exitEditingMode();

    table.setEditingRow(null); // Fecha o modo de edição na tabela
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
        {/* Modal de busca */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Selecione uma Unidade de Saúde</DialogTitle>
          <DialogContent>
            <UnidadeSearch onSelectUnidade={handleSelectUnidade} inputType={inputType} /> {/* Passa o tipo de input */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row }) => (
      <>
        <DialogTitle variant="h4">Editar Crianca Exposta HIV</DialogTitle>
        <DialogContent sx={{ maxWidth:'lg', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Modal de busca */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Selecione uma Unidade de Saúde</DialogTitle>
            <DialogContent>
              <UnidadeSearch onSelectUnidade={handleSelectUnidade} inputType={inputType} /> {/* Passa o tipo de input */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>
    
          <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off">    
          {/* Campos de edição personalizados */}
          <TextField
            label="Nº SINAN"
            value={row.original.nu_notific_sinan}
            onChange={(e) => {
              row.original.nu_notific_sinan = e.target.value; // Atualiza os dados diretamente no objeto original
              // Aqui, use `table.setEditingRow` apenas quando você tem o objeto correto
              table.setEditingRow(row); // Passando o objeto de linha correto
            }}
            fullWidth
          />
          <TextField
            label="Data Início"
            type="date"
            lang="MRT_Localization_PT_BR"
            value={dayjs(row.original.dt_inicio_monitoramento).format('YYYY-MM-DD')} // Garantir o formato correto
            onChange={(e) => {
              row.original.dt_inicio_monitoramento = dayjs(e.target.value).toDate(); // Atualiza a data com a nova data formatada
              table.setEditingRow(row); // Passando o objeto de linha correto
            }}
            fullWidth
          />
          <TextField
            label="ID do Paciente"
            value={Number(row.original.id_paciente)}
            onChange={(e) => {
              row.original.id_paciente = Number(e.target.value); // Atualiza o ID do paciente
              table.setEditingRow(row); // Passando o objeto de linha correto
            }}
            fullWidth
          />
          {/* Campo Unidade Monitoramento */}
          <div>
          <TextField
            id="id_unidade_monitoramento"
            label="ID"
            value= {row.original.id_unidade_monitoramento}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />            

          <TextField
            label="Unidade Monit."
            value={row.original.tb_unidade_monitoramento?.no_unidade} // Mostra o ID e nome da unidade
            onChange={(e) => {
              // Atualiza o campo ID da unidade
              row.original.id_unidade_monitoramento = Number(e.target.value); 
              // Você pode adicionar um código para atualizar o nome também, caso o usuário edite
              table.setEditingRow(row); // Passando o objeto de linha correto
            }}
            fullWidth
            // Ação de abrir o modal para busca de unidade de saúde
            InputProps={{
              endAdornment: (
                <IconButton
                  sx={{ p: '10px' }}
                  aria-label="search"
                  onClick={() => handleClickListItem('no_unidade')}
                >
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          </div>
          </Box>


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



const MonitoraCriancaExpostaHIVPage = () => ( <TableMonitoraCriancaExpostaHIV /> );
export default MonitoraCriancaExpostaHIVPage;


function validateMonitoraCriancaExpostaHIV(values: MonitoraCriancaExpostaHIV) {
  return {
    dt_inicio_monitoramento: !values.dt_inicio_monitoramento ? 'Data Início obrigatória' : '',
    id_paciente: !values.id_paciente ? 'Paciente obrigatorio' : '',
    id_unidade_monitoramento: !values.id_unidade_monitoramento ? 'Unidade de Monitoramento obrigatoria' : '',
  };
}
