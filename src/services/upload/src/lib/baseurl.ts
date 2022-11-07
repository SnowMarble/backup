export const baseurl =
  process.env.NODE_ENV === "production"
    ? "https://5gjwe7qbq8.apigw.gov-ntruss.com/sample/v1"
    : "http://localhost:3002"
