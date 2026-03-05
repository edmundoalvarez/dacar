import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { login } from "../../index.js";
import { Oval } from "react-loader-spinner";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitLoader(true);

    try {
      const response = await login(formData); // llamás a tu service

      if (response.error) {
        setError(response.error);
        return;
      }

      const { user } = response;

      setUser({
        email: user.email,
        id: user._id,
        username: user.username,
        role: user.role,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al iniciar sesión. Intentá de nuevo.");
    } finally {
      setSubmitLoader(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
        />

        {!submitLoader ? (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        ) : (
          <div className="flex justify-center w-full mt-2">
            <div className="flex justify-center bg-blue-600 rounded px-3 py-2 w-1/2">
              <Oval
                visible={true}
                height="24"
                width="24"
                color="#fff"
                secondaryColor="#fff"
                strokeWidth="6"
                ariaLabel="Cargando"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export { Login };
