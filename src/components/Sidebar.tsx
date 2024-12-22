import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuContent from '@components/MenuContent';

export default function Sidebar() {



  return (
    <div>
      <Drawer open={true} 
      hideBackdrop 
      variant='persistent'
      sx={{ '& .MuiDrawer-paper': {marginTop: '64px'}   }}>
        <MenuContent />
      </Drawer>
    </div>
  );
}
