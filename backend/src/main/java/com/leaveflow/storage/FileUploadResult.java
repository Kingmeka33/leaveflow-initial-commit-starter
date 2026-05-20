package com.leaveflow.storage;

public record FileUploadResult(
    String url,
    String fileName,
    String contentType,
    long sizeBytes
) {}
