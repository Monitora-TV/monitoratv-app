import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGetDesfecho } from '@/pages/Desfechocriancaexpostahiv/Desfechocriancaexpostahiv'; // Importando o hook que busca os dados

export default function SelectDesfechoCriancaExpostaHIV({ setFilter }: { setFilter: (id: number) => void }) {
  const [selectedDesfecho, setSelectedDesfecho] = React.useState<string>('-1'); // Inicializa com string vazia

  const { data: desfechos = [], isLoading, isError } = useGetDesfecho(); // Pega os dados da API

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setSelectedDesfecho(selectedValue);

    // Quando a opção "Todos" (id = -1) for selecionada, exibe todos os desfechos sem filtrar
    setFilter(Number(selectedValue)); // Converte para número antes de passar para o filtro
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="select-desfecho-label">Desfecho</InputLabel>
      <Select
        labelId="select-desfecho-label"
        id="select-desfecho"
        value={selectedDesfecho} // O valor agora é uma string
        onChange={handleChange}
        label="Desfecho"
      >
        {/* Opção "Todos" com valor -1, que será tratado como string */}
        <MenuItem value="-1">
          Todos
        </MenuItem>

        {/* Mapeando os desfechos da API */}
        {desfechos.map((desfecho) => (
          <MenuItem key={desfecho.id} value={String(desfecho.id)}>
            {desfecho.no_desfecho_criancaexposta_hiv}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
