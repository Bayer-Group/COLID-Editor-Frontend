export const environment = {
  Label: "Local",
  production: true,
  allowAnonymous: true,
  enableIndexSearch: true,
  baseUrl: "bayer.com",
  colidApiUrl: "http://localhost:51770/api/v3",
  appDataApiUrl: "http://localhost:51810/api",
  reportingApiUrl: "http://localhost:51910/api",
  searchApiUrl: "http://localhost:51800/api",
  loggingUrl: "http://localhost:51770/api/v3/log",
  releaseNotesUrl: "https://placeholder.org/",
  adalConfig: {
    authority: "yourdomain.onmicrosoft.com",
    clientId: "<editor client id>",
    redirectUri: "http://localhost:4201/logged-in",
    protectedResourceMap: {
      "http://localhost:51770": [
        "<registration service client id>/Resource.ReadWrite",
        "<registration service client id>/Resource.Read.All",
      ],
      "http://localhost:51810": [
        "<appdata service client id>/UserData.ReadWrite",
      ],
      "http://localhost:51910": [
        "<reporting service client id>/Resource.Statistics.Read.All",
      ],
      "http://localhost:51800": [
        "<search service client id>/Resource.Search.All",
      ],
      "https://placeholder.org/": [
        "<agent squirrel client id>/Read.All",
      ],
    },
    postLogoutRedirectUri: "http://localhost:4201/",
  },
  PidUriTemplate: {
    BaseUrl: "https://pid.bayer.com/",
  },
  appSupportFeedBack: {
    mailToLink: "mailTo:none",
    supportTicketLink: "http://placeholder.url/",
  },
  build: {
    ciJobId: "$BUILD_CIJOBID",
    ciPipelineId: "$BUILD_CIPIPELINEID",
    ciCommitSha: "$BUILD_CICOMMITSHA",
  },
  dmpUrl: "http://localhost:4300/",
  colidIconsUrl: "https://dataservices-icons.dev.colid.int.bayer.com/",
  rrmUrl: "http://localhost:4305/",
  deploymentInfoUrl:
    "https://info.dev.colid.int.bayer.com/current_deployment.json",
  agentStatisticsApi: "https://placeholder.org/",
};
