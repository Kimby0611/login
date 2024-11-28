import React, { useState } from "react";
import "./Pages.css"; // CSS 파일 가져오기

const NewWrite = () => {
  const [text, setText] = useState(""); // 텍스트 상태
  const [files, setFiles] = useState([]); // 업로드된 파일 상태

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // 여러 파일 선택 가능
    setFiles([...files, ...selectedFiles]); // 기존 파일과 새 파일 병합
  };

  const handleFileRemove = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove)); // 선택된 파일 삭제
  };

  const handleSubmit = () => {
    // 작성 내용 및 파일을 처리
    const formData = new FormData();
    formData.append("text", text);
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    // 예: 서버로 전송 (fetch 또는 axios 사용)
    console.log("Form Submitted", { text, files });
  };

  return (
    <div className="new-write-container">
      <h1 className="new-write-title">새 글 작성</h1>
      {/* 텍스트 입력 필드 */}
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="내용을 입력하세요..."
        rows="5"
        className="new-write-textarea"
      ></textarea>

      {/* 파일 업로드 */}
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="new-write-file-input"
      />

      {/* 미리보기 */}
      <div className="new-write-preview-container">
        {files.map((file, index) => (
          <div key={index} className="new-write-preview-item">
            {file.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="new-write-preview-image"
              />
            )}
            {file.type.startsWith("video/") && (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="new-write-preview-video"
              />
            )}
            <p className="new-write-preview-text">{file.name}</p>
            {/* 삭제 버튼 */}
            <button
              onClick={() => handleFileRemove(index)}
              className="new-write-remove-button"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* 제출 버튼 */}
      <button onClick={handleSubmit} className="new-write-submit-button">
        제출
      </button>
    </div>
  );
};

export default NewWrite;
