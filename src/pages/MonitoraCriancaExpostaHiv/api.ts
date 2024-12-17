import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MonitoraCriancaExpostaHIV } from '@/models/types'; // Atualize conforme o caminho do seu modelo
import axiosInstance from '@/apis/axiosInstance';


export function useCreateMonitoraCriancaExpostaHIV() {
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
  
export function useUpdateMonitoraCriancaExpostaHIV() {
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
  
export function useDeleteMonitoraCriancaExpostaHIV() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (monitoraCriancaExpostaHIVId: number) => {
        await axiosInstance.delete(`/criancaexpostahiv/${monitoraCriancaExpostaHIVId}`);
        return monitoraCriancaExpostaHIVId;
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['monitoraCriancaExpostaHIV'] }),
    });
}
  
  
