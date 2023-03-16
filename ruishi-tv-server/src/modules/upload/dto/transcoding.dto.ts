export interface transcodingResult {
  Status: string;
  ProcedureTask: {
    TaskId: string;
    Status: string;
    FileUrl: string;
    MediaProcessResultSet: [
      {
        TranscodeTask: {
          Output: {
            Url: string;
            Duration: string;
          };
        };
      },
      {
        CoverBySnapshotTask: {
          Status: string;
          Message: string;
          Output: {
            CoverUrl: string;
          };
        };
      },
    ];
  };
}

export class MediaInfo {
  MediaInfoSet: [
    {
      BasicInfo: {
        CoverUrl: string;
        MediaUrl: string;
      };
      MetaData: {
        VideoDuration: string;
      };
    },
  ];
}
