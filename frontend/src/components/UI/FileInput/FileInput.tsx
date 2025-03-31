import React, { useEffect, useRef, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface Props {
  name: string;
  label: string;
  onGetFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  id: string;
  className?: string;
  error?: boolean;
  helperText?: string;
}

const FileInput: React.FC<Props> = ({
  name,
  label,
  onGetFile,
  file,
  id,
  className,
  error,
  helperText
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const activateInput: () => void = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }

  const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else setFileName("");

    onGetFile(e);
  };

  useEffect(() => {
    if (!file) setFileName("");
  }, [file]);

  const inputStyle = error
    ? {
      backgroundColor: "#FFECEC",
      borderColor: "#FF0000",
    }
    : {
      backgroundColor: "white",
      borderColor: "darkgreen",
    };

  const buttonStyle = error
    ? {
      borderColor: "#FF0000",
      color: "#FF0000",
    }
    : {
      borderColor: "darkgreen",
      color: "darkgreen",
    };

  return (
    <>
      <input
        style={{ ...inputStyle, display: "none" }}
        type="file"
        name={name}
        ref={inputRef}
        onChange={onFileChange}
      />
      <div className="d-flex justify-content-start gap-4 align-items-center mb-3">
        <input
          style={{
            ...inputStyle,
            padding: "15px 30px",
            borderRadius: "20px",
            border: "1px solid",
          }}
          id={id}
          className={className}
          disabled
          placeholder={label}
          value={fileName}
          onClick={activateInput}
        />
        <button
          type="button"
          style={{
            ...buttonStyle,
            borderRadius: "15px",
            backgroundColor: "white",
            padding: "15px 20px",
            cursor: "pointer",
          }}
          onClick={activateInput}
        >
          <AddPhotoAlternateIcon />
        </button>
      </div>

      {error && helperText && (
        <div
          style={{
            color: "#FF0000",
            fontSize: "12px",
            marginLeft:"10px",
            marginTop:"-5px"
          }}
        >
          {helperText}
        </div>
      )}
    </>
  );
};

export default FileInput;
