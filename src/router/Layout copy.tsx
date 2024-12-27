import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Header from '@/components/Header';
import SideMenu from '@/router/SideMenu';
import AppTheme from '@shared-theme/AppTheme';
import { AutoLogoutCountdown } from "../components/auth/AutoLogoutCountdown";
import {  chartsCustomizations,  dataGridCustomizations,  datePickersCustomizations,  treeViewCustomizations,} from '@components/theme/customizations';
import { Outlet } from 'react-router-dom';
import React from 'react';
import SideNav from '@/components/SideNav';
import Sidebar from '@/components/Sidebar';



const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};


// https://www.youtube.com/watch?v=HsdjivqQ7BA




export default function Layout(props: { disableCustomTheme?: boolean }) {
  return (
    <React.Fragment>
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Header />
      <Sidebar />

      <Box sx={{ display: 'flex' }}>
        {/* <SideNav />
        <SideMenu /> */}
        {/* Main content */}
        <Box component="main" sx={(theme) => ({
            flexGrow: 1,
            //backgroundColor: theme.vars ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`: alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}>
          <Stack spacing={2} sx={{alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 },}}>
            <Outlet />
            <AutoLogoutCountdown />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
    </React.Fragment>
  );
}
