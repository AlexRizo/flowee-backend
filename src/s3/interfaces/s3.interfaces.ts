export interface S3UploadResult {
  key: string;
  url: string;
  originalName: string;
  message: string;
}

export interface S3UploadRejected {
  originalName: string;
  reason: string;
}
