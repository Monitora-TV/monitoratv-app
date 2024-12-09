import { useEffect, useMemo, useState } from 'react';
import {  MRT_EditActionButtons,  MaterialReactTable,  createMRTColumnHelper,
  type MRT_ColumnDef,  type MRT_Row,  type MRT_TableOptions,  useMaterialReactTable,} from 'material-react-table';
import {  Box,  Button,  DialogActions,  DialogContent,  DialogTitle,  IconButton,  Tooltip, } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, UsStates } from '../../models/types';
import { api } from '../../apis/axiosClient';


const columnHelper = createMRTColumnHelper<User>();

const TableUsers = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [stateOptions, setStateOptions] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/states');
        const options = response.data.map((usStates: UsStates) => ({
          value: usStates.id,
          label: usStates.state,
        }));
        setStateOptions(options);
      } catch (error) {
        console.error('Erro ao buscar os estados:', error);
      }
    };

    fetchStates();
  }, []);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'Id',
        enableEditing: false,
        size: 80,
      }),
      columnHelper.accessor('firstName', {
        header: 'Primeiro Nome',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.firstName,
          helperText: validationErrors.firstName,
          onFocus: () => setValidationErrors((prev) => ({ ...prev, firstName: undefined })),
        },
      }),
      columnHelper.accessor('lastName', {
        header: 'Ultimo Nome',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.lastName,
          helperText: validationErrors.lastName,
          onFocus: () => setValidationErrors((prev) => ({ ...prev, lastName: undefined })),
        },
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors.email,
          helperText: validationErrors.email,
          onFocus: () => setValidationErrors((prev) => ({ ...prev, email: undefined })),
        },
      }),
      columnHelper.accessor('stateid', {
        header: 'State',
        Cell: ({ cell }) => {
          const stateId = cell.getValue<number>(); // Ensure the type is correct
          const selectedState = stateOptions.find(option => option.value === stateId);
          return selectedState ? selectedState.label : 'Unknown State';
        },
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors.stateid,
          helperText: validationErrors.stateid,
        },
        editSelectOptions: stateOptions,
      }),
      columnHelper.accessor('observacao', {
        header: 'Observacao',
        muiEditTextFieldProps: {
          required: false,
          error: !!validationErrors.observacao,
          helperText: validationErrors.observacao,
          onFocus: () => setValidationErrors((prev) => ({ ...prev, observacao: undefined })),
        },
      }),
    ],
    [validationErrors, stateOptions]
  );

  const { mutateAsync: createUser } = useCreateUser();
  const { data: fetchedUsers = [], isLoading: isLoadingUsers } = useGetUsers();
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: deleteUser } = useDeleteUser();

  const handleCreateUser: MRT_TableOptions<User>['onCreatingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null);
  };

  const handleSaveUser: MRT_TableOptions<User>['onEditingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row: MRT_Row<User>) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    muiToolbarAlertBannerProps: isLoadingUsers
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
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New User</DialogTitle>
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
      isLoading: isLoadingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

// CREATE hook (post new user to api)
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      const response = await api.post("/user", {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        observacao: user.observacao,
        stateid: user.stateid,
      });
      return response.data;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

// READ hook (get users from api)
function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get("/users");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
}

// UPDATE hook (put user in api)
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      const response = await api.put("/user", {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        observacao: user.observacao,
        stateid: user.stateid,
      });
      return response.data;
    },
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(['users'], (prevUsers: User[]) =>
        prevUsers?.map((prevUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
        ),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

// DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      await api.delete("/user", {
        params: { id: userId },
      });
      return userId;
    },
    onMutate: (userId: number) => {
      queryClient.setQueryData(['users'], (prevUsers: User[]) =>
        prevUsers?.filter((user) => user.id !== userId),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <TableUsers />
  </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

function validateUser(user: User) {
  return {
    firstName: !validateRequired(user.firstName) ? 'First Name is Required' : '',
    lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
    email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
    stateid: !user.stateid ? 'State is Required' : '',
  };
}
