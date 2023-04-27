import React, { ChangeEvent, useState } from "react";

const CsvUploader: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const fileType = file.type;

      if (fileType !== "text/csv") {
        setError("Please upload a CSV file");
      } else {
        setError(null);
        // do something with the CSV file here
      }
    }
  };

  return (
    <div className="flex flex-col mb-24">
      <h1 className="text-2xl font-bold my-4">Upload CSV File: </h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default CsvUploader;
