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
        // Verifica el mensaje de error devuelto por el servidor
        if (data.message === "user-error") {
          return { error: "El email proporcionado no es válido." };
        } else if (data.message === "password-error") {
          return { error: "La contraseña es incorrecta." };
        }
      }
    }
    // En caso de otro tipo de error, devuelve un mensaje genérico
    console.error("Error al loguearse:", error.message, data);
    return {
      error:
        "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.",
    };
  }
}

export { login };
