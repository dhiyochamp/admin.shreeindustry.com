import React, { useState } from "react";
import { MdAttachFile } from "react-icons/md";
import { IoClose } from "react-icons/io5";

function DocumentInputBox({ maxFiles = 2, onFilesChange }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    if (files.length + newFiles.length > maxFiles) {
      alert(`You can only attach up to ${maxFiles} files.`);
      return;
    }

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    // Pass the updated files to the parent component
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const handleFileRemove = (index) => {
    const updatedFiles = files.filter((_, fileIndex) => fileIndex !== index);
    setFiles(updatedFiles);

    // Pass the updated files to the parent component
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <>
      <div className="grid grid-cols-3 items-center gap-4 relative">
        <label className="text-sm font-normal text-textColor">Document</label>
        <div className="relative col-span-2">
          <div
            className="border-gray-300 rounded-md border py-2 pl-2 pr-2 flex items-center justify-between cursor-pointer"
            onClick={triggerFileInput}
          >
            <span className="text-gray-500 text-sm">
              {files.length > 0
                ? `${files.length} file(s) selected`
                : "Attach files"}
            </span>
            <MdAttachFile className="text-gray-500" />
          </div>
          <input
            id="fileInput"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded-md"
          >
            <span className="text-sm truncate w-[85%]" title={file.name}>
              {file.name}
            </span>
            <IoClose
              size={16}
              className="text-red-500 cursor-pointer"
              onClick={() => handleFileRemove(index)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default DocumentInputBox;
