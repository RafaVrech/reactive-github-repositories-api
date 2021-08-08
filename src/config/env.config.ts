export class EnvironmentConfig {
  static mapping = () => ({
    app: {
      port: parseInt(process.env.PORT, 10) || 8080,
      basePath: process.env.BASE_PATH,
    },
    clients: {
      gitHubApi: process.env.GITHUB_API_BASE_PATH,
    },
  });

  'app.port': number;
  'app.basePath': string;
  'clients.gitHubApi': string;
}
