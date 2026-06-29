const { faker } = require('@faker-js/faker');

export function GetUserId() {
    return Cypress.env('userID');
}

export function UpdateUserId() {
    return cy.send_Request('GET', 'user').then((response) => {
        Cypress.env('userID', response.body.user.id);
        return response.body.user.id;
    });
}

export function CreateTestList() {
    const listName = faker.person.lastName();
    const folderId = Cypress.env('folderID');
    return cy.send_Request('POST', `folder/${folderId}/list`, { name: listName });
}

export function DeleteTestList(listId) {
    return cy.send_Request('DELETE', `list/${listId}`);
}



export function CreateListComment(listId) {
    
      const commentText = faker.lorem.sentence();
    

    cy.wrap(commentText).as('AliasCommentText');

    return cy.send_Request('POST', `list/${listId}/comment`, {
        comment_text: commentText,
        notify_all: false,
    });
}




export function GetListComments(listId) {
    return cy.send_Request('GET', `list/${listId}/comment`);
}

export function UpdateComment(commentId) {
    const commentText = faker.lorem.sentence();
    const assigneeId = Cypress.env('assigneeID');

    const requestPayload = {
        comment_text: commentText,
        assignee: assigneeId,
        resolved: true,
    };
    cy.wrap(requestPayload).as('CommentRequestPayload');
    return cy.send_Request('PUT', `comment/${commentId}`, requestPayload);
}

export function DeleteComment(commentId) {
    return cy.send_Request('DELETE', `comment/${commentId}`);
}

export function GetListCommentsWithoutHeaderToken(listId) {
    return cy.send_Request_without_header_token('GET', `list/${listId}/comment`);
}

export function GetListCommentsWithInvalidToken(listId) {
    return cy.send_Request_with_invalid_token('GET', `list/${listId}/comment`);
}

export function CreateListCommentWithoutHeaderToken(listId) {
    return cy.send_Request_without_header_token('POST', `list/${listId}/comment`, {
        comment_text: faker.lorem.sentence(),
        notify_all: true,
    });
}

export function CreateListCommentWithInvalidToken(listId) {
    return cy.send_Request_with_invalid_token('POST', `list/${listId}/comment`, {
        comment_text: faker.lorem.sentence(),
        notify_all: true,
    });
}

export function CreateListCommentWithoutCommentText(listId) {
    return cy.send_Request('POST', `list/${listId}/comment`, {
        notify_all: false,
    })
}

export function UpdateCommentWithoutHeaderToken(commentId) {
    return cy.send_Request_without_header_token('PUT', `comment/${commentId}`, {
        comment_text: faker.lorem.sentence(),
    });
}

export function UpdateCommentWithInvalidToken(commentId) {
    return cy.send_Request_with_invalid_token('PUT', `comment/${commentId}`, {
        comment_text: faker.lorem.sentence(),
    });
}

export function DeleteCommentWithoutHeaderToken(commentId) {
    return cy.send_Request_without_header_token('DELETE', `comment/${commentId}`);
}

export function DeleteCommentWithInvalidToken(commentId) {
    return cy.send_Request_with_invalid_token('DELETE', `comment/${commentId}`);
}
