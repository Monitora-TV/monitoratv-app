import Drawer from '@mui/material/Drawer';
import MenuContent from '@components/MenuContent';

export default function Sidebar() {
  return (
    <div>
      <Drawer open={true} 
      hideBackdrop 
      variant='persistent'
      sx={{ '& .MuiDrawer-paper': {marginTop: '64px'}   }}
      >
        <MenuContent />
      </Drawer>
    </div>
  );
}
