import { useRef, useState } from 'react';
import Avatar from './Avatar';
import Button from './Button';
import { removeProfilePhoto, uploadProfilePhoto, validateProfilePhoto } from '../services/profilePhotoService';

export default function ProfilePhotoUpload({ userId, avatarPath, avatarUrl, name, onUpdated }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const inputId = `foto-perfil-${userId}`;

  const handleFileChange = (event) => {
    setError('');
    setNotice('');
    const selectedFile = event.currentTarget.files?.[0] ?? null;
    if (!selectedFile) return;

    try {
      validateProfilePhoto(selectedFile);
      setFile(selectedFile);
    } catch (validationError) {
      setFile(null);
      event.currentTarget.value = '';
      setError(validationError.message);
    }
  };

  const handleUpload = async () => {
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const result = await uploadProfilePhoto({ userId, file, previousPath: avatarPath });
      await onUpdated();
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      setNotice(result.warning || 'Foto de perfil actualizada.');
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const result = await removeProfilePhoto({ userId, path: avatarPath });
      await onUpdated();
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      setNotice(result.warning || 'Foto de perfil eliminada.');
    } catch (removeError) {
      setError(removeError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby={`${inputId}-title`} className="mt-6 border-t border-border pt-5">
      <h3 id={`${inputId}-title`} className="text-label font-semibold text-text">Foto de perfil</h3>
      <div className="mt-3 flex items-center gap-3">
        <Avatar src={avatarUrl} alt={`Foto de ${name || 'tu perfil'}`} className="size-12" />
        <div className="min-w-0">
          <label htmlFor={inputId} className="text-small font-medium text-text">Selecciona una foto</label>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={busy}
            aria-describedby={`${inputId}-help`}
            className="mt-1 block w-full min-w-0 text-small text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface-muted file:px-3 file:py-2 file:font-semibold file:text-text"
          />
        </div>
      </div>
      <p id={`${inputId}-help`} className="mt-2 text-caption text-text-muted">
        JPG, PNG o WebP; máximo 5 MB. Se mostrará en tu perfil y valoraciones mediante enlaces temporales.
      </p>
      {file && <p className="mt-2 truncate text-caption text-text-muted">Seleccionada: {file.name}</p>}
      {error && <p role="alert" className="mt-3 text-small text-danger">{error}</p>}
      {notice && <p role="status" className="mt-3 text-small text-success">{notice}</p>}
      <div className="mt-3 flex flex-wrap gap-3">
        <Button type="button" variant="secondary" disabled={!file || busy} onClick={handleUpload}>
          {busy ? 'Guardando...' : 'Subir foto'}
        </Button>
        {avatarPath && (
          <Button type="button" variant="danger" disabled={busy} onClick={handleRemove}>
            Quitar foto
          </Button>
        )}
      </div>
    </section>
  );
}
