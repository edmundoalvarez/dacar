import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";

const QuillEditor = ({
  value = "",
  onChange,
  modules,
  formats,
  theme = "snow",
  placeholder,
  className,
}) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const lastValueRef = useRef("");
  const [isReady, setIsReady] = useState(false);

  // Inicializar Quill dinámicamente
  useEffect(() => {
    let isMounted = true;

    const initQuill = async () => {
      if (!containerRef.current || quillRef.current) return;

      // Importación dinámica de Quill
      const Quill = (await import("quill")).default;

      if (!isMounted || !containerRef.current) return;

      const quill = new Quill(containerRef.current, {
        theme,
        modules: modules || {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
        },
        formats: formats || [
          "header",
          "bold",
          "italic",
          "underline",
          "list",
          "bullet",
        ],
        placeholder,
      });

      quillRef.current = quill;

      // Setear valor inicial
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
        lastValueRef.current = value;
      }

      // Listener de cambios
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        lastValueRef.current = html;
        if (onChange) onChange(html);
      });

      setIsReady(true);
    };

    initQuill();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sincronizar valor externo
  useEffect(() => {
    if (!quillRef.current || !isReady) return;

    const incoming = value || "";
    if (incoming !== lastValueRef.current) {
      const selection = quillRef.current.getSelection();
      quillRef.current.clipboard.dangerouslyPasteHTML(incoming);
      if (selection) quillRef.current.setSelection(selection);
      lastValueRef.current = incoming;
    }
  }, [value, isReady]);

  return (
    <div className={className}>
      <div ref={containerRef} />
    </div>
  );
};

export default QuillEditor;
