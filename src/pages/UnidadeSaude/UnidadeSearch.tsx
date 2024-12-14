import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { UnidadeSaude } from '@/models/types';
import axiosInstance from '@/apis/axiosInstance';

// Componente para busca de unidades
interface UnidadeSearchProps {
  onSelectUnidade: (unidade: UnidadeSaude, inputType: string) => void; // Passa o inputType para identificar o campo correto
  inputType: string; // Recebe o tipo de campo, para saber qual input está sendo editado
}

const UnidadeSearch: React.FC<UnidadeSearchProps> = ({ onSelectUnidade, inputType }) => {
  const [searchString, setSearchString] = useState(''); // Estado para armazenar o valor da busca
  const [unidades, setUnidades] = useState<UnidadeSaude[]>([]); // Estado para armazenar as unidades de saúde retornadas

  const handleSearch = async () => {
    if (searchString.trim() === '') return; // Não faz nada se a busca estiver vazia

    try {
      const response = await axiosInstance.get(`unidadesaude/filter/${searchString}`);
      const data = response.data;
      setUnidades(data); // Armazena as unidades no estado
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  

  const handleSelectUnidade = (unidade: UnidadeSaude) => {
    onSelectUnidade(unidade, inputType); // Passa a unidade e o inputType para o componente pai
    setUnidades([]); // Limpa a lista de unidades após a seleção
  };

  return (
    <Box sx={{ '& .MuiDialog-paper': { bgcolor: 'background.paper' } }}>
      <InputLabel htmlFor="search-input">Buscar Unidade</InputLabel>
      <OutlinedInput
        id="search-input"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)} // Atualiza o estado quando o valor muda
        placeholder="Digite o nome da unidade"
        endAdornment={
          <IconButton
            sx={{ p: '10px' }}
            aria-label="search"
            onClick={handleSearch} // Chama a função de busca ao clicar
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

      {/* Renderiza a lista de unidades de saúde */}
      {unidades.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Unidades Encontradas:</h3>
          <List>
            {unidades.map((unidade) => (
              <ListItemButton
                key={unidade.id}
                selected={false}
                onClick={() => handleSelectUnidade(unidade)} // Passa a unidade para a seleção
              >
                <ListItemText
                  primary={unidade.no_unidade}
                  secondary={`ID: ${unidade.id}`}
                />
              </ListItemButton>
            ))}
          </List>
        </div>
      )}
    </Box>
  );
};

export default UnidadeSearch;
