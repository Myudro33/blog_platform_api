import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Production API",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
      {
        url: "https://blog-platform-api-97bab037251a.herokuapp.com/api",
        description: "Production server",
      },
      {
        url: "https://blog-platform-api-gal8.onrender.com/api",
        description: "Production server Render",
      },
    ],
  },
  apis: ["./swagger/*.js"],
};

const specs = swaggerJSDoc(options);

export default specs;
