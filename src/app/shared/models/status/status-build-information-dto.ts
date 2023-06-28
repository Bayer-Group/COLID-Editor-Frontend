export interface StatusBuildInformationDto {
  versionNumber: string;
  jobId: string;
  imageTags: string[];
  latestReleaseDate: Date;
}
