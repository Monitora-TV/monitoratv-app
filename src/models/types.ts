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

export type Coordenadoria  = {
  id: number;
  no_coordenadoria: string;
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




export type MonitoraCriancaExpostaHIV = {
  id?: number;
  id_paciente?: number;
  id_monitora_gestante_hiv?: number;
  id_sinan_notificacao?: number;
  nu_notific_sinan?: string;
  dt_notific_sinan?: Date;
  id_unidade_notific_sinan?: number;
  id_maternidade_nascimento?: number;
  dt_saida_maternidade?: Date;
  dt_inicio_monitoramento: Date;
  id_unidade_monitoramento?: number;
  id_desfecho_criexp_hiv?: number;
  dt_desfecho_criexp_hiv?: Date;
  id_origem_desfecho?: number;
  dt_diagnostico_hiv?: Date;
  id_matrix_exame_hiv_diagnostico?: number;
  matrix_exame_conclusao_diagnostico?: string;
  id_tipo_resultado_elisa_diagnostico?: number;
  id_tipo_resultado_hivib_diagnostico?: number;
  flg_coleta_cv_nascimento?: boolean;
  flg_arv_nascimento?: boolean;
  id_arv_nascimento_periodo?: number;
  id_tarv_esquema?: number;
  flg_tarv_28_dias?: boolean;
  id_siscel_cv_primeira?: number;
  id_siscel_cv_penultima?: number;
  id_siscel_cv_ultima?: number;
  id_matrix_exahiv_ultima_pos_12?: number;
  id_matrix_exahiv_ultima_pos_18?: number;
  id_matrix_exahiv_primeiro?: number;
  dt_inicio_profilaxia?: Date;
  id_origem_monitoramento?: number;
  id_usuario?: number;
  dt_atualizacao?: Date;
  tb_paciente?: {
    no_paciente: string;
  };
  tb_unidade_monitoramento?: {
    cnes_unidade: string;
    no_unidade: string;
    id_coordenadoria: number;
    tb_coordenadoria?: {
      no_coordenadoria: string;
    };
    id_supervisao: number;
    tb_supervisao_unidade_saude?: {
      no_supervisao: string;
    };
    id_uvis: number;
    tb_uvis?: {
      no_uvis: string;
    };
  };
  tb_maternidade?: {
    no_unidade: string;
  };
  tb_desfecho_criancaexposta_hiv?: {
    no_desfecho_criancaexposta_hiv: string;
  };
};



export type UnidadeSaude = {
  id?: number;
  no_unidade?: string;
  cnes_unidade?: string; // Não pode ser undefined, já que é obrigatório
  id_maternidade?: number;
  no_maternidade?: string;
  id_coordenadoria?: number;
  id_supervisao?: number;
  id_uvis?: number;
  no_logradouro?: string;
  nu_endereco?: string;
  co_cep?: string;
  co_sigla_estado?: string;
  co_municipio_gestor?: string;
  tb_coordenadoria?: {
    no_coordenadoria: string;
  };
  tb_supervisao?: {
    no_supervisao: string;
  };
  tb_uvis?: {
    no_uvis: string;
  };
}


