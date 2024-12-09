export type UsStates = {
  id: number;
  state: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  observacao: string;
  stateid: number;
};


export type Desfechocriancaexpostahiv = {
  id: number;
  no_desfecho_criancaexposta_hiv: string;
};

export type tb_usuario = {
  id: number;
  email: string;
  name: string;
  enabled: boolean;
  username: string;
  id_unidade_saude: number;
  dt_ultimo_acesso: string;
  dt_cadastro: Date;
};
