import { FileType } from "@prisma/client";
export declare const getSignedUploadUrl: (file_id: string, file_type: FileType, expiresIn: number) => Promise<string>;
export declare const getSignedDownloadUrl: (fileName: string, expiresIn?: number) => Promise<string>;
export declare const deleteFile: (file_id: string, file_type: FileType) => Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
