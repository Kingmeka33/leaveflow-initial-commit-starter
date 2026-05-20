package com.leaveflow.storage;

import com.leaveflow.common.ApiException;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3StorageService {
  private static final List<String> ALLOWED_TYPES = List.of("application/pdf", "image/jpeg", "image/png");

  private final S3Client s3Client;

  @Value("${aws.s3.bucket}")
  private String bucket;

  @Value("${aws.s3.public-base-url:}")
  private String publicBaseUrl;

  @Value("${app.upload.max-file-size-bytes}")
  private long maxFileSizeBytes;

  public S3StorageService(S3Client s3Client) {
    this.s3Client = s3Client;
  }

  public FileUploadResult uploadSupportingDocument(MultipartFile file, String employeeId) {
    if (file == null || file.isEmpty()) {
      return null;
    }

    String contentType = file.getContentType();

    if (!ALLOWED_TYPES.contains(contentType)) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Only PDF, JPG and PNG files are allowed");
    }

    if (file.getSize() > maxFileSizeBytes) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "File size exceeds the 5MB limit");
    }

    String originalName = file.getOriginalFilename() == null ? "document" : file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
    String key = "leave-documents/" + employeeId + "/" + UUID.randomUUID() + "-" + originalName;

    try {
      PutObjectRequest request = PutObjectRequest.builder()
          .bucket(bucket)
          .key(key)
          .contentType(contentType)
          .contentLength(file.getSize())
          .build();

      s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

      String url = publicBaseUrl == null || publicBaseUrl.isBlank()
          ? "https://" + bucket + ".s3.amazonaws.com/" + key
          : publicBaseUrl.replaceAll("/$", "") + "/" + key;

      return new FileUploadResult(url, originalName, contentType, file.getSize());
    } catch (IOException ex) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Could not read uploaded file");
    }
  }
}
