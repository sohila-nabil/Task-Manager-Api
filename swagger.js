import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Task Manager API",
    description: "Simple API documentation",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./server.js"]; // or your routes file

swaggerAutogen()(outputFile, endpointsFiles, doc);
