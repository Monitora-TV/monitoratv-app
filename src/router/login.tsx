import { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/ssr";
import { KeycloakInstance } from "keycloak-js";
import { useNavigate } from "react-router-dom"; // Usando useNavigate para navegação

const LoginPage = () => {
  const { initialized, keycloak } = useKeycloak<KeycloakInstance>();
  const navigate = useNavigate(); // Hook do React Router para navegação

  const { login = () => {}, authenticated } = keycloak || {};

  useEffect(() => {
    // Espera até que o Keycloak esteja inicializado
    if (!initialized) {
      return;
    }

    // Se não estiver autenticado, chama o login
    if (!authenticated) {
      login();
    }
  }, [login, authenticated, initialized]);

  useEffect(() => {
    // Após o login, redireciona para a página desejada
    if (!initialized) {
      return;
    }

    if (authenticated) {
      navigate("/dashboard"); // Redireciona para o dashboard após autenticação
    }
  }, [initialized, authenticated, navigate]);

  return null; // Não renderiza nada enquanto o login estiver em andamento
};

export default LoginPage;
