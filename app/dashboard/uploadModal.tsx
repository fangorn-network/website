// ============================================
// UPLOAD MODAL
// ============================================

import { useCallback, useRef, useState } from "react";
import { formatFileSize } from "./utils";

export interface UploadConfig {
  title: string;
  description: string;
  price: string;
  maxSupply: string;
  royalty: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, config: UploadConfig) => void;
  isDeploying: boolean;
  deployStatus: string;
}

export const UploadModal = ({ isOpen, onClose, onSubmit, isDeploying, deployStatus }: UploadModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [config, setConfig] = useState<UploadConfig>({
    title: '',
    description: '',
    price: '',
    maxSupply: '',
    royalty: '10',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      setSelectedFile(files[0]);
      if (!config.title) {
        setConfig(c => ({
          ...c,
          title: files[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }));
      }
    }
  }, [config.title]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      setSelectedFile(files[0]);
      if (!config.title) {
        setConfig(c => ({
          ...c,
          title: files[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }));
      }
    }
  };

  const handleSubmit = () => {
    if (selectedFile && config.title && config.price) {
      onSubmit(selectedFile, config);
    }
  };

  const resetAndClose = () => {
    if (isDeploying) return;
    setSelectedFile(null);
    setConfig({ title: '', description: '', price: '', maxSupply: '', royalty: '10' });
    onClose();
  };

  const isValid = selectedFile && config.title.trim() && config.price.trim() && config.royalty.trim();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={resetAndClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isDeploying ? 'Deploying...' : 'Upload Content'}</h2>
          {!isDeploying && (
            <button className="modal-close" onClick={resetAndClose}>&times;</button>
          )}
        </div>

        <div className="modal-body">
          {isDeploying ? (
            <div className="deploy-progress">
              <div className="deploy-spinner" />
              <div className="deploy-status">{deployStatus}</div>
            </div>
          ) : (
            <>
              <div
                className={`upload-zone ${isDragging ? 'dragover' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                {selectedFile ? (
                  <div className="selected-file">
                    <div className="file-icon">📄</div>
                    <div className="file-details">
                      <div className="file-name">{selectedFile.name}</div>
                      <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                    </div>
                    <button
                      className="btn-change"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">↑</div>
                    <div className="upload-text">Drop file or directory here</div>
                    <div className="upload-hint">PDF, images, audio, video, or folders</div>
                  </>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="My Creative Work"
                  value={config.title}
                  onChange={e => setConfig(c => ({ ...c, title: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="A brief description..."
                  value={config.description}
                  onChange={e => setConfig(c => ({ ...c, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (ETH) *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="0.05"
                    value={config.price}
                    onChange={e => setConfig(c => ({ ...c, price: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Supply</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Unlimited"
                    value={config.maxSupply}
                    onChange={e => setConfig(c => ({ ...c, maxSupply: e.target.value }))}
                  />
                  <div className="form-hint">Leave empty for unlimited</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Royalty % *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="10"
                  value={config.royalty}
                  onChange={e => setConfig(c => ({ ...c, royalty: e.target.value }))}
                />
                <div className="form-hint">Percentage earned on secondary sales (ERC-2981)</div>
              </div>
            </>
          )}
        </div>

        {!isDeploying && (
          <div className="modal-footer">
            <button className="btn-secondary" onClick={resetAndClose}>Cancel</button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              Encrypt & Deploy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};