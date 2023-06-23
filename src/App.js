import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from "./components/Header";
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function App() {
  const [myFiles, setMyFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filePath, setFilePath] = useState("/file-server/");
  const [showChartModal, setShowChartModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [sortOption, setSortOption] = useState("");
  useEffect(() => {
    setMyFiles(data);
  }, []);
  useEffect(() => {
    // Update filtered files when myFiles or searchQuery changes
    const filtered = myFiles.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [myFiles, searchQuery]);
  
  

  var barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Files Breakdown',
      },
    },
  };
  const handleSearch = () => {
    // Logic to filter files based on searchQuery
    const filtered = myFiles.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
  };

  const handleFileSelection = (file) => {
    if (selectedFile && selectedFile.id === file.id) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };
  
  const handleDeleteFile = () => {
    if (selectedFile) {
      const newFiles = myFiles.filter((file) => file.id !== selectedFile.id);
      setMyFiles(newFiles);
      setSelectedFile(null);
    }
  };
  

  const handleRenameFile = () => {
    if (selectedFile) {
      const newName = prompt('Enter new name');
      if (newName) {
        const newFiles = myFiles.map((file) => {
          if (file.id === selectedFile.id) {
            return {
              ...file,
              name: newName,
            };
          }
          return file;
        });
        setMyFiles(newFiles);
      }
    }
  };

  const handleDownloadFile = () => {
    if (selectedFile) {
      window.open(selectedFile.path, '_blank');
    }
  };
  const sortFiles = () => {
    let sortedFiles = [...myFiles];
  
    switch (sortOption) {
      case 'name':
        sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'type':
        sortedFiles.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'size':
        sortedFiles.sort((a, b) => a.size - b.size);
        break;
      default:
        // No sorting option selected, do nothing
        break;
    }
  
    setMyFiles(sortedFiles);
  };
  
  
  const handleSortChange = (event) => {
    const selectedSortOption = event.target.value;
    setSortOption(selectedSortOption);
    sortFiles(); // Call sortFiles after setting the sortOption
  };
  
  
  const handleFilePreview = (file) => {
    // Logic to show a preview of the selected file
  };
  // Inside the App component

const handleFileUpload = (event) => {
  const uploadedFilesArray = [...uploadedFiles];
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const newFile = {
      id: Date.now() + i,
      name: file.name,
      type: getFileType(file),
      path: URL.createObjectURL(file),
    };
    uploadedFilesArray.push(newFile);
  }

  setUploadedFiles(uploadedFilesArray);
};

const getFileType = (file) => {
  // Implement logic to determine the file type based on the file's extension or MIME type
};


  return (
    <>
    {showChartModal && (
    <div style={styles.modal}>
     <div style={styles.modalContent}>
      <div style={styles.modalHeader}>
       <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
       <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
      </div>
      <div style={styles.modalBody}>
       <Pie
        data={{
         labels: ['Video', 'Audio', 'Document', 'Image'],
         datasets: [
          {
           label: 'Files Breakdown',
           data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
           backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
           ],
           borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
           ],
           borderWidth: 1,
          },
         ],
        }}
       />
       <Bar
        data={{
         labels: ['Video', 'Audio', 'Document', 'Image'],
         datasets: [
          {
           label: 'Files Breakdown',
           data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
           backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
           ],
           borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
           ],
           borderWidth: 1,
          },
         ],
        }}
        options={barChartOptions}
       />
      </div>
     </div>
    </div>
   )}
       <div className="App">
    <Header onSearch={handleSearch} onSortChange={handleSortChange} />

    <div style={styles.container}>
      <div style={{ padding: 10, paddingBottom: 0 }}>
        <p style={{ fontWeight: "bold" }}>My Files</p>
        <p>{selectedFile ? selectedFile.path : filePath}</p>
      </div>
      <div style={styles.controlTools}>
        <button onClick={handleDeleteFile}>Delete</button>
        <button onClick={handleRenameFile}>Rename</button>
        <button onClick={handleDownloadFile}>Download</button>
        <button onClick={() => setShowChartModal(true)}>Show Chart</button>
      </div>
      <div style={styles.fileContainer}>
        <div style={{ width: '50%', padding: 10 }}>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div
                style={styles.file}
                className={`files ${
                  selectedFile && selectedFile.id === file.id ? 'selected' : ''
                }`}
                key={file.id}
                onClick={() => handleFileSelection(file)}
              >
                <p>{file.name}</p>
              </div>
            ))
          ) : (
            <p>No files found.</p>
          )}
        </div>
       
        
<div style={styles.uploadedFiles}>
<input type="file" onChange={handleFileUpload} multiple />
  <p style={{ fontWeight: "bold" }}>Uploaded Files</p>
  {uploadedFiles.map((file) => (
    
    <div style={styles.file} className="files" key={file.id}>
      <p>{file.name}</p>
    </div>
  ))}
</div>
      {selectedFile && (
        <div style={styles.fileViewer}>
          {selectedFile.type === 'video' && (
            <VideoPlayer path={selectedFile.path} />
          )}
          {selectedFile.type === 'audio' && (
            <AudioPlayer path={selectedFile.path} />
          )}
          {selectedFile.type === 'document' && (
            <DocumentViewer path={selectedFile.path} />
          )}
          {selectedFile.type === 'image' && (
            <ImageViewer path={selectedFile.path} />
          )}
          <p style={{ fontWeight: "bold", marginTop: 10 }}>{selectedFile.name}</p>
          <p>path: <span style={{ fontStyle: "italic" }}>{selectedFile.path}</span></p>
          <p>file type: <span style={{ fontStyle: "italic" }}>{selectedFile.type}</span></p>
        </div>
      )}
    </div>
    <div style={styles.uploadedFiles}>
        <p style={{ fontWeight: "bold" }}>Uploaded Files</p>
        {uploadedFiles.map((file) => (
          <div style={styles.file} className="files" key={file.id}>
            <p>{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</>
  );
            }
const styles = {
  container: {
    backgroundColor: '#fff',
    color: '#000',
  },
  fileContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  file: {
    backgroundColor: '#eee',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    width: '100%',
  },
  fileViewer: {
    padding: '10px',
    margin: '10px',
    width: '30vw',
    height: '100vh',
    cursor: 'pointer',
    borderLeft: '1px solid #000',
  },
  controlTools: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexDirection: 'row',
  },
  uploadedFiles: {
    marginTop: '20px',
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
};