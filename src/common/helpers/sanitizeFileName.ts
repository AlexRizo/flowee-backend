export const sanitizeFileName = (fileName: string) => {
  // Separar el nombre del archivo de su extensión
  const lastDotIndex = fileName.lastIndexOf('.');
  const name =
    lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

  // Sanitizar solo el nombre del archivo, preservando la extensión
  const sanitizedName = name
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return sanitizedName;
};
