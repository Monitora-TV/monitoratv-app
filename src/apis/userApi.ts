import { api } from './axiosClient';

const userApi = {
    getStates() {
        const url = '/states';
        return api.get(url);
    },

}

/*
https://www.udemy.com/course/react-typescript-build-ecommerce-project/learn/lecture/45793657#questions/22503141

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


const response = await api.get('/states');


const response = await api.post("/user", {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    observacao: user.observacao,
    stateid: user.stateid,
  });
  return response.data;




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
          
*/