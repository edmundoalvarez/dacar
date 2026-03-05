import axios from "axios";
import config from "../../config.json";
import Cookies from "js-cookie";

async function login(data) {
  try {
    const response = await axios.post(config.apiAuth, data);

    // Verifica el estado de la respuesta
    if (response.status === 200) {
      const res = response.data;
      Cookies.set("userId", res.user._id);
      Cookies.set("token", res.jwToken);
      Cookies.set("role", res.user.role);
      return res;
    } else {
      // En caso de error, construye un objeto JSON con el mensaje de error
      return {
        error:
          "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.",
      };
    }
  } catch (error) {
    // Verifica si hay una respuesta de error del servidor
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        if (data.message === "user-error") {
          return { error: "El usuario proporcionado no es válido." };
        } else if (data.message === "password-error") {
          return { error: "La contraseña es incorrecta." };
        } else if (data.message === "user-inactive") {
          return { error: "El usuario se encuentra inactivo." };
        }
      }
    }
    // En caso de otro tipo de error, devuelve un mensaje genérico
    console.error("Error al loguearse:", error.message, error.response?.data);
    return {
      error:
        "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.",
    };
  }
}

export { login };
