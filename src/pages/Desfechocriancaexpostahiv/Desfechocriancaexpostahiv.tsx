import { useEffect, useMemo, useState } from 'react';
import {  MRT_EditActionButtons,  MaterialReactTable,  createMRTColumnHelper,
  type MRT_ColumnDef,  type MRT_Row,  type MRT_TableOptions,  useMaterialReactTable,} from 'material-react-table';
import {  Box,  Button,  DialogActions,  DialogContent,  DialogTitle,  IconButton,  Tooltip, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Desfechocriancaexpostahiv } from '../../models/types';
//import { api } from '../../apis/axiosClient';
import axiosInstance from '../../apis/axiosInstance';
import { fetch } from '../../apis/desfecho-crianca-api/axiosInstance';


const columnHelper = createMRTColumnHelper<Desfechocriancaexpostahiv>();

const TableDesfechos = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  const columns = useMemo<MRT_ColumnDef<Desfechocriancaexpostahiv>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'Id',
        enableEditing: false,
        size: 80,
      }),
      columnHelper.accessor('no_desfecho_criancaexposta_hiv', {
        header: 'Desfecho',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.no_desfecho_criancaexposta_hiv,
          helperText: validationErrors.no_desfecho_criancaexposta_hiv,
          onFocus: () => setValidationErrors((prev) => ({ ...prev, no_desfecho_criancaexposta_hiv: undefined })),
        },
      }),
    ],
    [validationErrors]
  );

  const { mutateAsync: createDesfecho } = useCreateDesfecho();
  const { data: fetchedDesfecho = [], isLoading: isLoadingDesfechos } = useGetDesfecho();
  const { mutateAsync: updateDesfecho } = useUpdateDesfecho();
  const { mutateAsync: deleteDesfecho } = useDeleteDesfecho();

  const handlecreateDesfecho: MRT_TableOptions<Desfechocriancaexpostahiv>['onCreatingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createDesfecho(values);
    table.setCreatingRow(null);
  };

  const handleSaveDesfecho: MRT_TableOptions<Desfechocriancaexpostahiv>['onEditingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateDesfecho(values);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row: MRT_Row<Desfechocriancaexpostahiv>) => {
    if (window.confirm('Are you sure you want to delete this desfecho?')) {
      deleteDesfecho(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedDesfecho,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    muiToolbarAlertBannerProps: isLoadingDesfechos
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
    onCreatingRowSave: handlecreateDesfecho,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveDesfecho,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Desfecho</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit User</DialogTitle>
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
        Create New User
      </Button>
    ),
    state: {
      isLoading: isLoadingDesfechos,
    },
  });

  return <MaterialReactTable table={table} />;
};

// CREATE hook (post new user to api)
function useCreateDesfecho() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (desfechocriancaexpostahiv: Desfechocriancaexpostahiv) => {
      const response = await axiosInstance.post("/desfechocriancaexpostahiv", {
        no_desfecho_criancaexposta_hiv: desfechocriancaexpostahiv.no_desfecho_criancaexposta_hiv,
      });
      return response.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['desfechocriancaexpostahiv'] }),
  });
}

// READ hook (get users from api)

//export const getTodos = (options?: SecondParameter<typeof fetch>) => {
//    return fetch<Todo[]>({ url: `/todos`, method: "GET" }, options);
//};

/*
fetch('http://localhost:3000/desfechocriancaexpostahiv', {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + tokenDeAcesso, // Se necessário
    }
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erro:', error));
*/
type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];
export const getTodos = (options?: SecondParameter<typeof fetch>) => {
    return fetch<Desfechocriancaexpostahiv[]>({ url: `/desfechocriancaexpostahiv`, method: "GET" }, options);
};



function useGetDesfecho() {
  return useQuery<Desfechocriancaexpostahiv[]>({
    queryKey: ['desfechocriancaexpostahiv'],
    queryFn: async () => {
      //const response = await axiosInstance.get("/desfechocriancaexpostahiv");
      const response = await axiosInstance.get("/desfechocriancaexpostahiv");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
}

// UPDATE hook (put user in api)
function useUpdateDesfecho() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (desfechocriancaexpostahiv: Desfechocriancaexpostahiv) => {
      const response = await axiosInstance.put("/desfechocriancaexpostahiv", {
        id: desfechocriancaexpostahiv.id,
        no_desfecho_criancaexposta_hiv: desfechocriancaexpostahiv.no_desfecho_criancaexposta_hiv,
      });
      return response.data;
    },
    onMutate: (newUserInfo: Desfechocriancaexpostahiv) => {
      queryClient.setQueryData(['desfechocriancaexpostahiv'], (prevUsers: Desfechocriancaexpostahiv[]) =>
        prevUsers?.map((prevUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
        ),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['desfechocriancaexpostahiv'] }),
  });
}

// DELETE hook (delete user in api)
function useDeleteDesfecho() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (desfechocriancaexpostahivId: number) => {
      await axiosInstance.delete("/desfechocriancaexpostahiv", {
        params: { id: desfechocriancaexpostahivId },
      });
      return desfechocriancaexpostahivId;
    },
    onMutate: (desfechocriancaexpostahivId: number) => {
      queryClient.setQueryData(['desfechocriancaexpostahiv'], (prevUsers: Desfechocriancaexpostahiv[]) =>
        prevUsers?.filter((desfechocriancaexpostahiv) => desfechocriancaexpostahiv.id !== desfechocriancaexpostahivId),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['desfechocriancaexpostahiv'] }),
  });
}

const queryClient = new QueryClient();

const DesfechoCriancaExpostaHIV = () => (
  <QueryClientProvider client={queryClient}>
    <TableDesfechos />
  </QueryClientProvider>
);

export default DesfechoCriancaExpostaHIV;

const validateRequired = (value: string) => !!value.length;

function validateUser(desfechocriancaexpostahiv: Desfechocriancaexpostahiv) {
  return {
    no_desfecho_criancaexposta_hiv: !validateRequired(desfechocriancaexpostahiv.no_desfecho_criancaexposta_hiv) ? 'Descrição is Required' : '',
  };
}
