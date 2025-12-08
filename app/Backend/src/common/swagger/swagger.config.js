import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Tutor Support System API",
        version: "1.0",
        description: "Cinema"
    },

    servers: [
        {
            url: "http://localhost:3069",
        }
    ],

    tags: [
        {
            name: "Auth",
            description: "Các APIs liên quan đến người dùng"
        },
        {
            name: "Admin",
            description: "Các APIs dành cho quản trị hệ thống"
        }

    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },

    // Global security - áp dụng cho tất cả endpoints
    security: [
        {
            bearerAuth: []
        }
    ]
}

const options = {
    definition: swaggerDefinition,
    apis: ["../../routers/*.js", "./src/controllers/*.js"] // which contain Swagger comment
}

const swaggerSpec = swaggerJSDoc(options)

// Custom Swagger UI plugin để inject token từ localStorage
const swaggerUIOptions = {
    swaggerOptions: {
        persistAuthorization: true, // Giữ token sau khi refresh
    },
    onComplete: function() {
        // Tự động inject token từ localStorage khi Swagger load
        setTimeout(() => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const authorizeBtn = document.querySelector('[data-testid="auth-btn-authorize"]');
                    const input = document.querySelector('[data-testid="auth-bearer-value"]');
                    if (input) {
                        input.value = token;
                        if (authorizeBtn) authorizeBtn.click();
                    }
                } catch (e) {
                    console.warn('Cannot auto-authorize in Swagger:', e.message);
                }
            }
        }, 500);
    }
}

export function setupSwagger(app){
    app.use("/swagger/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUIOptions))
}