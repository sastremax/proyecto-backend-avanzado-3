import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del proyecto Backend III',
            description: 'API con endpoints de usuarios, productos, carritos y más.',
        },
    },
    apis: ['./src/swagger/docs/**/*.yaml'],
}

export const specs = swaggerJSDoc(swaggerOptions)
export const swaggerUi = swaggerUiExpress