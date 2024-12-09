import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import MenuContent from '@components/MenuContent';


const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  return (
    <Drawer variant="permanent" sx={{display: { xs: 'none', md: 'block' },[`& .${drawerClasses.paper}`]: {backgroundColor: 'background.paper',},}}>
      <Divider />
      <MenuContent />
    </Drawer>
  );
}
