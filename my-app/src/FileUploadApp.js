import React, { useState, useEffect } from 'react';
import { Delete, Edit, Save, Refresh } from '@mui/icons-material';
import { Container, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Snackbar, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Alert } from '@mui/material';
import { uploadFile, fetchAllFiles, updateFile, deleteFile } from './apiService';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your backend URL

const FileUploadApp = () => {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    car_make: '',
    car_model: '',
    vin: '',
    manufactureDate: '',
    age_of_vehicle: '', 
  });
  const [selectedAge, setSelectedAge] = useState('');
  const [snackbarMessages, setSnackbarMessages] = useState([]);

  useEffect(() => {
    fetchAllFiles().then(response => setFiles(response.data)).catch(error => console.error(error));

    socket.on('batchComplete', (message) => {
      setSnackbarMessages((prevMessages) => [
        ...prevMessages,
        { message, severity: 'success', key: new Date().getTime() },
      ]);
    });

    return () => {
      socket.off('batchComplete'); // Clean up listener on unmount
    };
  }, []);

  const handleFileUpload = (event) => {
    const newFile = event.target.files[0];
    if (newFile) {
      uploadFile(newFile)
        .then(() => {
          setSnackbarMessages((prevMessages) => [
            ...prevMessages,
            { message: 'File uploaded successfully!', severity: 'success', key: new Date().getTime() },
          ]);
          fetchAllFiles().then(response => setFiles(response.data)).catch(error => console.error(error));
        })
        .catch(() => {
          setSnackbarMessages((prevMessages) => [
            ...prevMessages,
            { message: 'Failed to upload file.', severity: 'error', key: new Date().getTime() },
          ]);
        });
    }
  };

  const handleUpdate = () => {
    updateFile(formData.id, formData)
      .then(() => {
        setSnackbarMessages((prevMessages) => [
          ...prevMessages,
          { message: 'File updated successfully!', severity: 'success', key: new Date().getTime() },
        ]);
        fetchAllFiles().then(response => setFiles(response.data)).catch(error => console.error(error));
      })
      .catch(() => {
        setSnackbarMessages((prevMessages) => [
          ...prevMessages,
          { message: 'Failed to update file.', severity: 'error', key: new Date().getTime() },
        ]);
      });
    setEditIndex(null);
  };

  const handleDelete = (id) => {
    deleteFile(id)
      .then(() => {
        setSnackbarMessages((prevMessages) => [
          ...prevMessages,
          { message: 'File deleted successfully!', severity: 'success', key: new Date().getTime() },
        ]);
        fetchAllFiles().then(response => setFiles(response.data)).catch(error => console.error(error));
      })
      .catch(() => {
        setSnackbarMessages((prevMessages) => [
          ...prevMessages,
          { message: 'Failed to delete file.', severity: 'error', key: new Date().getTime() },
        ]);
      });
  };

  const handleGetAll = () => {
    fetchAllFiles()
      .then(response => setFiles(response.data))
      .catch(error => console.error(error));
  };

  const handleCloseSnackbar = (key) => {
    setSnackbarMessages((prevMessages) =>
      prevMessages.filter((message) => message.key !== key)
    );
  };

  const calculateCarAge = (manufactureDate) => {
    const currentYear = new Date().getFullYear();
    const manufactureYear = new Date(manufactureDate).getFullYear();
    return currentYear - manufactureYear;
  };

  const filteredFiles = files
    .filter(file => {
      const carAge = calculateCarAge(file.manufactureDate);
      return !selectedAge || carAge > selectedAge;
    })
    .filter(file => file.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    file.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    file.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    file.car_make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    file.car_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    file.manufactureDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (typeof file.age_of_vehicle === 'string' && file.age_of_vehicle.toLowerCase().includes(searchQuery.toLowerCase()))
                    //file.age_of_vehicle.toLowerCase().includes(searchQuery.toLowerCase())
                  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(files[index]);
  };

  return (
    <Container>
      <h1>File Management</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input
          accept="file/*"
          style={{ display: 'none' }}
          id="upload-file"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="upload-file">
          <Button variant="contained" component="span">Upload File</Button>
        </label>
        <Button variant="contained" onClick={handleGetAll} startIcon={<Refresh />}>
          Get All
        </Button>
        <TextField
          label="Search files"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControl>
          <InputLabel>Car Age</InputLabel>
          <Select
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            style={{ width: '150px' }}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value={1}>Older than 1 year</MenuItem>
            <MenuItem value={3}>Older than 3 years</MenuItem>
            <MenuItem value={5}>Older than 5 years</MenuItem>
            <MenuItem value={7}>Older than 7 years</MenuItem>
            <MenuItem value={10}>Older than 10 years</MenuItem>
            <MenuItem value={15}>Older than 15 years</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Car Make</TableCell>
            <TableCell>Car Model</TableCell>
            <TableCell>VIN</TableCell>
            <TableCell>Manufacture Date</TableCell>
            <TableCell>Age of Vehicle</TableCell> {/* New column */}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredFiles.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.id}</TableCell>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  row.first_name
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  row.last_name
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  row.email
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    name="car_make"
                    value={formData.car_make}
                    onChange={handleInputChange}
                  />
                ) : (
                  row.car_make
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    name="car_model"
                    value={formData.car_model}
                    onChange={handleInputChange}
                  />
                ) : (
                  row.car_model
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                  />
                ) : (
                  row.vin
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    name="manufactureDate"
                    value={formData.manufactureDate}
                    onChange={handleInputChange}
                  />
                ) : (
                  row.manufactureDate
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    name="age_of_vehicle"
                    value={formData.age_of_vehicle}
                    onChange={handleInputChange}
                  />
                ) : (
                  row.age_of_vehicle
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <IconButton onClick={handleUpdate}>
                    <Save />
                  </IconButton>
                ) : (
                  <>
                    <IconButton onClick={() => handleEdit(index)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Render multiple snackbars */}
      {snackbarMessages.map((snackbar) => (
        <Snackbar
          key={snackbar.key}
          open
          autoHideDuration={10000}
          onClose={() => handleCloseSnackbar(snackbar.key)}
        >
          <Alert severity={snackbar.severity} onClose={() => handleCloseSnackbar(snackbar.key)}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      ))}
    </Container>
  );
};

export default FileUploadApp;