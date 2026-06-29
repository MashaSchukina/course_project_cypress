
import Ajv from 'ajv';

Cypress.Commands.add('send_Request', (request_method, endpoint, body = null) => { 
    cy.request ({
            method: request_method,
            url: endpoint,
            headers:{
                'Authorization': Cypress.env('token')
            },
            body: body,
            failOnStatusCode: false
        })
})

Cypress.Commands.add('send_Request_without_header_token', (request_method, endpoint, body = null) => { 
    cy.request ({
            method: request_method,
            url: endpoint,
            body: body,
            failOnStatusCode: false
        })
})

Cypress.Commands.add('send_Request_with_invalid_token', (request_method, endpoint, body = null) => { 
    cy.request ({
            method: request_method,
            url: endpoint,
            headers:{
                'Authorization': Cypress.env('invalidToken')
            },
            body: body,
            failOnStatusCode: false
        })
})



Cypress.Commands.add('validateSchema', (schema, data) => {
  // allErrors: true змушує AJV знаходити всі помилки у схемі, а не зупинятися на першій
  const ajv = new Ajv({ allErrors: true, verbose: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    // Форматуємо помилки у зрозумілий рядок для логів Cypress
    const errors = validate.errors
      .map(err => `Поле "${err.instancePath}" ${err.message}`)
      .join('\n');
      
    throw new Error(`Невідповідність JSON-схемі:\n${errors}`);
  }

  // Якщо все добре, додаємо зелений лог у таймлайн Cypress
  Cypress.log({
    name: 'validateSchema',
    message: 'Схема успішно пройшла валідацію! ✅',
  });
});
