import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from '@components/CustomDatePicker';
import MenuButton from '@components/MenuButton';
import ColorModeIconDropdown from '@shared-theme/ColorModeIconDropdown';
import Search from '@components/Search';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { OptionsMenu } from '../router/OptionsMenu';
import Avatar from '@mui/material/Avatar';
import { useOidc } from "../oidc";
import { Link, useLocation } from "react-router-dom";



export default function Header() {

  const { isUserLoggedIn, login, logout, oidcTokens } = useOidc();
  const { pathname } = useLocation();

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <Typography variant="body1">Monitora TV</Typography>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <CustomDatePicker />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />

        <Avatar
          sizes="small"
          alt={isUserLoggedIn ? oidcTokens.decodedIdToken.name : ''}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {isUserLoggedIn ? oidcTokens.decodedIdToken.preferred_username : ''}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {isUserLoggedIn ? oidcTokens.decodedIdToken.email : ''}
          </Typography>
        </Box>
        <OptionsMenu />

      </Stack>
    </Stack>
  );
}
