// Broad image filters let the native Photos picker export its original format.
// The client and server still validate the actual file after selection.
export const PHOTO_ACCEPT = "image/*";
export const WORK_ACCEPT = `${PHOTO_ACCEPT},application/pdf,.pdf`;
export const UPLOAD_FORMAT_MESSAGE =
  "Choose a JPG, PNG, WebP, HEIC, or HEIF image, or a PDF. Other file types can’t be read yet.";

const TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
  "application/pdf",
]);
const EXTENSION_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  pdf: "application/pdf",
};

export function normalizeUploadFile(file: File): File {
  let type = file.type.toLowerCase();
  if (["", "application/octet-stream", "binary/octet-stream"].includes(type)) {
    const extension = file.name.match(/\.([^.]+)$/)?.[1].toLowerCase();
    type = (extension && EXTENSION_TYPES[extension]) || "";
  }
  if (!TYPES.has(type)) throw new Error(UPLOAD_FORMAT_MESSAGE);
  return type === file.type
    ? file
    : new File([file], file.name, { type, lastModified: file.lastModified });
}

export function isHeifFile(file: File): boolean {
  return /^image\/hei[cf](?:-sequence)?$/.test(file.type);
}
