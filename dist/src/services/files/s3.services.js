"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getSignedDownloadUrl = exports.getSignedUploadUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const log_error_1 = require("../../error/log-error");
const config = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: "eu-central-1",
};
const client = new client_s3_1.S3Client(config);
const getSignedUploadUrl = async (file_id, file_type, expiresIn) => {
    try {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `USER_MEDIA/${file_type}/${file_id}`,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(client, command, { expiresIn });
    }
    catch (error) {
        log_error_1.rollbar.error(error);
        throw new Error("Couldn't get signed upload url");
    }
};
exports.getSignedUploadUrl = getSignedUploadUrl;
const getSignedDownloadUrl = async (fileName, expiresIn = 86400) => {
    try {
        let signingDate = new Date();
        signingDate.setUTCHours(0, 0, 0, 0);
        signingDate.setUTCDate(signingDate.getUTCDate());
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(client, command, {
            expiresIn: expiresIn,
            signingDate: signingDate,
        });
    }
    catch (error) {
        log_error_1.rollbar.error(error);
        throw new Error("Couldn't create download url");
    }
};
exports.getSignedDownloadUrl = getSignedDownloadUrl;
const deleteFile = async (file_id, file_type) => {
    try {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `USER_MEDIA/${file_type}/${file_id}`,
        });
        const data = await client.send(command);
        return data;
    }
    catch (error) {
        log_error_1.rollbar.error(error);
        throw new Error("Couldn't delete file, please try again later");
    }
};
exports.deleteFile = deleteFile;
//# sourceMappingURL=s3.services.js.map