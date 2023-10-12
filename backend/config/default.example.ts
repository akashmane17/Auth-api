export default {
  port: 5000,
  dbUri: "mongodb://localhost:27017/auth-api",
  origin: "http://localhost:3000",
  logLevel: "info",
  saltWorkFactor: 10,
  accessTokenTtl: "60m",
  refreshTokenTtl: "7d",
  smtp: {
    user: "smtp_email",
    pass: "smtp_pass",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
  },
  publicKey: `-----YOUR PUBLIC KEY------`,
  privateKey: `-----YOUR PRIVATE KEY-----`,
};
