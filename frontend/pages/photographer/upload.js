import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/upload.module.css';

const PhotographerUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'landscape',
    tags: '',
    isPublic: true,
  });

  const categories = [
    'landscape',
    'portrait',
    'wildlife',
    'street',
    'macro',
    'architecture',
    'abstract',
    'other',
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isLessThan10MB = file.size < 10 * 1024 * 1024;
      return isImage && isLessThan10MB;
    });

    if (validFiles.length < files.length) {
      setError(
        'Some files were rejected. Please ensure all files are images and less than 10MB.'
      );
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setError(null);
  };

  const handleFileRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one image to upload.');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title for your photos.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const uploadPromises = selectedFiles.map((file, index) => {
        return uploadFile(file, index);
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((r) => r.success);

      if (successfulUploads.length > 0) {
        setUploadedImages((prev) => [...prev, ...successfulUploads]);
        setSelectedFiles([]);
        setFormData({
          title: '',
          description: '',
          category: 'landscape',
          tags: '',
          isPublic: true,
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(
        err.message || 'An error occurred during upload. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file, index) => {
    const fileFormData = new FormData();
    fileFormData.append('image', file);
    fileFormData.append('title', formData.title);
    fileFormData.append('description', formData.description);
    fileFormData.append('category', formData.category);
    fileFormData.append('tags', formData.tags);
    fileFormData.append('isPublic', formData.isPublic);

    try {
      const response = await axios.post('/api/photos/upload', fileFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress((prev) => ({
            ...prev,
            [index]: percentCompleted,
          }));
        },
      });

      return {
        success: true,
        file: file.name,
        id: response.data.photoId,
        url: response.data.url,
      };
    } catch (err) {
      console.error(`Error uploading ${file.name}:`, err);
      return {
        success: false,
        file: file.name,
        error: err.response?.data?.message || 'Upload failed',
      };
    }
  };

  const totalProgress =
    selectedFiles.length > 0
      ? Math.round(
          Object.values(uploadProgress).reduce((a, b) => a + b, 0) /
            selectedFiles.length
        )
      : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Upload Your Photos</h1>
        <p>Share your best photography with the community</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && (
        <div className={styles.success}>
          Photos uploaded successfully!
        </div>
      )}

      <div className={styles.uploadSection}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Photo Title *</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            placeholder="Enter title for your photos"
            maxLength="100"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="Describe your photos, camera settings, location, etc."
            rows="4"
            maxLength="500"
          />
        </div>

        <div className={styles.twoColumn}>
          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleFormChange}
              placeholder="e.g., sunset, mountains, nature (comma separated)"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleFormChange}
            />
            Make photos public
          </label>
          <p className={styles.helperText}>
            {formData.isPublic
              ? 'Your photos will be visible to all users'
              : 'Only you can view these photos'}
          </p>
        </div>
      </div>

      <div className={styles.dropZone}>
        <label htmlFor="fileInput" className={styles.dropZoneLabel}>
          <div className={styles.dropZoneContent}>
            <svg
              className={styles.uploadIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <h3>Drag and drop your images here</h3>
            <p>or click to select files from your computer</p>
            <p className={styles.fileHint}>
              Supported formats: JPG, PNG, GIF, WebP (Max 10MB per file)
            </p>
          </div>
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className={styles.filesSection}>
          <h3>Selected Files ({selectedFiles.length})</h3>
          <div className={styles.filesList}>
            {selectedFiles.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {uploadProgress[index] !== undefined && (
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progress}
                      style={{ width: `${uploadProgress[index]}%` }}
                    />
                    <span className={styles.progressText}>
                      {uploadProgress[index]}%
                    </span>
                  </div>
                )}
                {!uploadProgress[index] && (
                  <button
                    onClick={() => handleFileRemove(index)}
                    className={styles.removeBtn}
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {selectedFiles.length > 0 && (
            <div className={styles.uploadButtonContainer}>
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className={styles.uploadButton}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner} />
                    Uploading... {totalProgress}%
                  </>
                ) : (
                  `Upload ${selectedFiles.length} Photo${
                    selectedFiles.length !== 1 ? 's' : ''
                  }`
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className={styles.uploadedSection}>
          <h3>Recently Uploaded</h3>
          <div className={styles.uploadedGrid}>
            {uploadedImages.map((image, index) => (
              <div key={index} className={styles.uploadedItem}>
                <img src={image.url} alt={image.file} />
                <p className={styles.uploadedName}>{image.file}</p>
                <a href={`/gallery/${image.id}`} className={styles.viewLink}>
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotographerUpload;
