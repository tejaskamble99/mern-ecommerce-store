"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";


const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start writing...",
      width: "100%", 
      height: 350, 
      toolbarAdaptive: true, 
      toolbarSticky: false,
      allowResizeX: false, 
      allowResizeY: true,
      hidePoweredByJodit: true, // ✅ THIS REMOVES THE WATERMARK!
    }),
    [placeholder]
  );

  return (
    <div style={{ maxWidth: "100%", width: "100%", color: "black", overflowX: "hidden" }}>
      <JoditEditor
        value={value}
        config={config}
        onBlur={onChange} 
      />
    </div>
  );
};

export default RichTextEditor;