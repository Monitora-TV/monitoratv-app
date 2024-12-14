import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { UnidadeSaude } from '@/models/types';
import UnidadeSearch from './UnidadeSearch'; // Importa o componente de busca

export default function ConfirmationDialog() {
  const [open, setOpen] = React.useState(false);
  const [selectedUnidade, setSelectedUnidade] = React.useState<UnidadeSaude | null>(null);
  const [inputType, setInputType] = React.useState<string>('no_unidade'); // Armazena o tipo de input (unidade ou maternidade)

  const handleClickListItem = (type: string) => {
    setInputType(type); // Define o tipo do campo (unidade ou maternidade)
    setOpen(true); // Abre a modal
  };

  const handleClose = () => {
    setOpen(false); // Fecha a modal
  };

  const handleSelectUnidade = (unidade: UnidadeSaude, type: string) => {
    setSelectedUnidade((prev) => {
      if (type === 'no_unidade') {
        return {
          ...prev,
          id: unidade.id,
          no_unidade: unidade.no_unidade,
          cnes_unidade: unidade.cnes_unidade, // Garantir que este campo seja atribuído corretamente
        };
      } else if (type === 'no_maternidade') {
        return {
          ...prev,
          id_maternidade: unidade.id,
          no_maternidade: unidade.no_unidade, // No caso da maternidade, você pode atualizar o nome de unidade aqui
        };
      }
      return prev; // Retorna o estado anterior se nenhum tipo correspondente
    });
    setOpen(false); // Fecha a modal
  };
  
  return (
    <Box sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {/* Campo ID - Unidade (oculto) */}
      <Box sx={{ display: 'none', flexDirection: 'column', width: '20%' }}>
        <InputLabel htmlFor="id_unidade">ID</InputLabel>
        <OutlinedInput
          id="id_unidade"
          value={selectedUnidade ? selectedUnidade.id : ''}
          disabled
          label="ID"
          fullWidth
        />
      </Box>

      {/* Campo Nome Unidade */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
        <InputLabel htmlFor="no_unidade">Nome Unidade</InputLabel>
        <OutlinedInput
          id="no_unidade"
          value={selectedUnidade ? selectedUnidade.no_unidade : ''}
          disabled
          label="Nome"
          endAdornment={
            <IconButton
              sx={{ p: '10px' }}
              aria-label="search"
              onClick={() => handleClickListItem('no_unidade')} // Passa 'no_unidade' para identificar o campo de unidade
            >
              <SearchIcon />
            </IconButton>
          }
          sx={{
            width: '100%', // Ajusta para ocupar 100% do espaço disponível
            maxWidth: '600px', // Define um limite máximo de largura
            height: '45px', // Aumenta a altura do input
            borderRadius: '4px', // Adiciona bordas arredondadas para o estilo
            padding: '0 10px', // Ajusta o padding interno
          }}        
        />
      </Box>

      {/* Modal de busca */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Selecione uma Unidade de Saúde</DialogTitle>
        <DialogContent>
          <UnidadeSearch onSelectUnidade={handleSelectUnidade} inputType={inputType} /> {/* Passa o tipo de input */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Campo ID - Maternidade (oculto) */}
      <Box sx={{ display: 'none', flexDirection: 'column', width: '20%' }}>
        <InputLabel htmlFor="id_maternidade">ID Maternidade</InputLabel>
        <OutlinedInput
          id="id_maternidade"
          value={selectedUnidade ? selectedUnidade.id_maternidade : ''}
          disabled
          label="ID Maternidade"
          fullWidth
        />
      </Box>

      {/* Campo Nome Maternidade */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
        <InputLabel htmlFor="no_maternidade">Nome Maternidade</InputLabel>
        <OutlinedInput
          id="no_maternidade"
          value={selectedUnidade ? selectedUnidade.no_maternidade : ''}
          disabled
          label="Maternidade"
          endAdornment={
            <IconButton
              sx={{ p: '10px' }}
              aria-label="search"
              onClick={() => handleClickListItem('no_maternidade')} // Passa 'no_maternidade' para identificar o campo de maternidade
            >
              <SearchIcon />
            </IconButton>
          }
          sx={{
            width: '100%', // Ajusta para ocupar 100% do espaço disponível
            maxWidth: '600px', // Define um limite máximo de largura
            height: '45px', // Aumenta a altura do input
            borderRadius: '4px', // Adiciona bordas arredondadas para o estilo
            padding: '0 10px', // Ajusta o padding interno
          }}        
        />
      </Box>
    </Box>
  );
}
