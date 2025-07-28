import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image, File, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FileUpload = ({
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  value,
  onChange,
  onError,
  label,
  description,
  required = false,
  className
}) => {
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setUploadError('');

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      let errorMessage = 'File upload failed';
      
      switch (error.code) {
        case 'file-too-large':
          errorMessage = `File too large. Maximum size is ${(maxSize / (1024 * 1024)).toFixed(1)}MB`;
          break;
        case 'file-invalid-type':
          errorMessage = 'Invalid file type. Please upload an image file';
          break;
        default:
          errorMessage = error.message;
      }
      
      setUploadError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    if (acceptedFiles.length === 0) return;

    setIsUploading(true);

    try {
      // For now, create object URLs for preview
      // In production, you'd upload to a cloud service here
      const filePromises = acceptedFiles.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              file,
              url: reader.result,
              name: file.name,
              size: file.size,
              type: file.type
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const processedFiles = await Promise.all(filePromises);
      
      if (multiple) {
        onChange?.(value ? [...value, ...processedFiles] : processedFiles);
      } else {
        onChange?.(processedFiles[0]);
      }
    } catch (error) {
      const errorMessage = 'Failed to process file';
      setUploadError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [maxSize, multiple, value, onChange, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled: isUploading
  });

  const removeFile = (indexToRemove) => {
    if (multiple && Array.isArray(value)) {
      onChange?.(value.filter((_, index) => index !== indexToRemove));
    } else {
      onChange?.(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreview = (fileData, index) => {
    const isImage = fileData.type?.startsWith('image/');
    
    return (
      <div key={index} className="relative group">
        <div className="w-20 h-20 border-2 border-border rounded-lg overflow-hidden bg-accent flex items-center justify-center">
          {isImage ? (
            <img 
              src={fileData.url} 
              alt={fileData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <File className="h-8 w-8 text-foreground/50" />
          )}
        </div>
        
        <button
          type="button"
          onClick={() => removeFile(index)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
        
        <p className="mt-1 text-xs text-foreground/60 truncate w-20" title={fileData.name}>
          {fileData.name}
        </p>
        <p className="text-xs text-foreground/40">
          {formatFileSize(fileData.size)}
        </p>
      </div>
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-foreground/60">{description}</p>
      )}

      {/* Upload area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-accent/50",
          isUploading && "opacity-50 cursor-not-allowed",
          uploadError && "border-red-500 bg-red-50 dark:bg-red-900/10"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-2">
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          ) : (
            <Upload className={cn(
              "h-8 w-8",
              isDragActive ? "text-primary" : "text-foreground/50"
            )} />
          )}
          
          <div className="space-y-1">
            {isUploading ? (
              <p className="text-sm text-foreground/70">Uploading...</p>
            ) : isDragActive ? (
              <p className="text-sm text-primary font-medium">Drop files here</p>
            ) : (
              <>
                <p className="text-sm text-foreground/70">
                  <span className="font-medium text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-foreground/50">
                  {Object.keys(accept).join(', ')} up to {(maxSize / (1024 * 1024)).toFixed(1)}MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
        </div>
      )}

      {/* File previews */}
      {value && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            {multiple ? 'Uploaded Files' : 'Uploaded File'}
          </p>
          <div className="flex flex-wrap gap-3">
            {multiple && Array.isArray(value) 
              ? value.map((file, index) => renderPreview(file, index))
              : renderPreview(value, 0)
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 