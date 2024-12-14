import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { UnidadeSaude } from '@/models/types'; 
import axiosInstance from '@/apis/axiosInstance';

// Agora, o componente recebe uma função `onSelectUnidade` como prop para passar a unidade selecionada
interface UnidadeSearchProps {
  onSelectUnidade: (unidade: UnidadeSaude) => void; // Função para notificar a seleção
}

export default function UnidadeSearch({ onSelectUnidade }: UnidadeSearchProps) {
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
    onSelectUnidade(unidade); // Passa a unidade selecionada para o componente pai
    setUnidades([]); // Limpa a lista de unidades após a seleção
  };

  return (
    <div>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        onSubmit={(e) => e.preventDefault()} // Previne o comportamento padrão do formulário
      >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Unidade"
          inputProps={{ 'aria-label': 'search unidade' }}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)} // Atualiza o estado quando o valor muda
        />
        <IconButton
          type="button"
          sx={{ p: '10px' }}
          aria-label="search"
          onClick={handleSearch} // Chama a função de busca ao clicar
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* Renderiza a lista de unidades de saúde */}
      {unidades.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Unidades Encontradas:</h3>
          <ul>
            {unidades.map((unidade) => (
              <li
                key={unidade.id}
                style={{ cursor: 'pointer', padding: '5px', border: '1px solid #ccc', marginBottom: '5px' }}
                onClick={() => handleSelectUnidade(unidade)} // Passa a unidade selecionada para o pai e limpa a lista
              >
                <strong>{unidade.no_unidade}</strong> (ID: {unidade.id})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
