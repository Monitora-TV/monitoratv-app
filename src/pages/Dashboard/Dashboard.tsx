import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MonitoraCriancaExpostaHIVPage from '../MonitoraCriancaExpostaHiv/MonitoraCriancaExpostaHiv';
import HighlightedCard from '@components/HighlightedCard';
import PageViewsBarChart from '@components/PageViewsBarChart';
import SessionsChart from '@components/SessionsChart';
// import StatCard, { StatCardProps } from '@components/StatCard';

import DashboardTotalCountCard, { DashboardTotalCountCardProps } from '@/components/dashboard/DashboardTotalCountCard';
import { useOidc } from "../../oidc";
import axiosInstance from '@/apis/axiosInstance';


/*
const data: DashboardTotalCountCardProps[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];
*/

export default function Dashboard() {

  const { oidcTokens, goToAuthServer, backFromAuthServer } = useOidc({ assertUserLoggedIn: true });



  // Criação do estado para armazenar os dados da API
  const [data, setData] = React.useState<DashboardTotalCountCardProps[]>([]);

  // Função para buscar os dados da API
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/criancaexpostahiv/count-by-desfecho");
      // Mapeia os dados para o formato necessário para o Dashboard
      const formattedData = response.data.map((item: any) => ({
        title: item.no_desfecho_criancaexposta_hiv,
        value: item.total.toString(),
      }));

      // Atualiza o estado com os dados formatados
      setData(formattedData);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  // Chama a função fetchData quando o componente for montado
  React.useEffect(() => {
    fetchData();
  }, []);  


  return (
    <div style={{marginLeft:'300px'}}>
    <Box  sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Visão Geral
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <DashboardTotalCountCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <MonitoraCriancaExpostaHIVPage />
        </Grid>
      </Grid>
    </Box>
    </div>
  );
}
