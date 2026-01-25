import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
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
  const { quill, quillRef } = useQuill({ theme, modules, formats, placeholder });
  const lastValueRef = useRef("");

  useEffect(() => {
    if (!quill) return;

    const handleChange = () => {
      const html = quill.root.innerHTML;
      lastValueRef.current = html;
      if (onChange) onChange(html);
    };

    quill.on("text-change", handleChange);
    return () => quill.off("text-change", handleChange);
  }, [quill, onChange]);

  useEffect(() => {
    if (!quill) return;

    const incoming = value || "";
    if (incoming !== lastValueRef.current) {
      const selection = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(incoming);
      if (selection) quill.setSelection(selection);
      lastValueRef.current = incoming;
    }
  }, [quill, value]);

  return (
    <div className={className}>
      <div ref={quillRef} />
    </div>
  );
};

export default QuillEditor;
