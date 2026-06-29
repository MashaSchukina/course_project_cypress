/// <reference types="cypress" />
const {
    UpdateUserId,
    CreateTestList,
    DeleteTestList,
    CreateListComment,
    GetListComments,
    UpdateComment,
    DeleteComment,
} = require('../../modules/comment_method');

describe('Tests for List Comments API for ClickUp', () => {

    let listId;

    it('Prepare environment', () => {
        UpdateUserId();
        CreateTestList().then((listResponse) => {
            listId = listResponse.body.id;
        });
    });

    it('Get List Comments with valid authorization header', () => {
        CreateListComment(listId).then(() => {
            cy.fixture('get_list_comments_schema').then((commentsSchema) => {
                GetListComments(listId).then((getResponse) => {
                    expect(getResponse.status).to.eq(200);
                    expect(getResponse.body).to.not.be.empty;
                    expect(getResponse.headers['content-type']).to.include('application/json');
                    cy.validateSchema(commentsSchema, getResponse.body);
                    expect(getResponse.body.comments).to.be.an('array').that.is.not.empty;
                });
            });
        });
    });



    it('Create List Comment with valid authorization header and valid body', () => {
        cy.fixture('create_list_comment_schema').then((commentSchema) => {
            CreateListComment(listId).then((createResponse) => {
                expect(createResponse.status).to.eq(200);
                expect(createResponse.body).to.not.be.empty;
                expect(createResponse.headers['content-type']).to.include('application/json');
                cy.validateSchema(commentSchema, createResponse.body);

                const commentId = createResponse.body.id;
                expect(createResponse.body.version.deleted).to.eq(false);
                expect(createResponse.body.version.data.context.user_id).to.eq(Cypress.env('userID'));
                
                const currentTimestampMs = Date.now(); 
                expect(createResponse.body.date).to.be.closeTo(currentTimestampMs, 30000);

                cy.get('@AliasCommentText').then((commentText) => {
                    GetListComments(listId).then((getResponse) => {
                        const createdComment = getResponse.body.comments.find(
                            (comment) => String(comment.id) === String(commentId)
                        );
                        expect(createdComment).to.exist;
                        expect(createdComment.comment_text).to.eq(commentText);
                        expect(createdComment.user.id).to.eq(Cypress.env('userID'));
                        expect(String(createdComment.date)).to.eq(String(createResponse.body.date));

                        DeleteComment(commentId);
                    });
                });
            });
        });
    });



    it('Update Comment with valid authorization header and valid body', () => {
        CreateListComment(listId).then((createResponse) => {
            const commentId = String(createResponse.body.id);

            UpdateComment(commentId).then((updateResponse) => {
                expect(updateResponse.status).to.eq(200);

                cy.get('@CommentRequestPayload').then((payload) => {
                    GetListComments(listId).then((getResponse) => {
                        const updatedComment = getResponse.body.comments.find(
                            (comment) => String(comment.id) === commentId
                        );
                        expect(updatedComment).to.exist;
                        expect(updatedComment.comment_text).to.eq(payload.comment_text);
                        expect(String(updatedComment.assignee.id)).to.eq(payload.assignee);
                        expect(updatedComment.resolved).to.eq(payload.resolved);
                        

                        DeleteComment(commentId);
                    });
                });
            });
        });
    });


    it('Delete Comment with valid authorization header', () => {
        CreateListComment(listId).then((createResponse) => {
            const commentId = String(createResponse.body.id);

            DeleteComment(commentId).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(200);

                DeleteComment(commentId).then((secondDeleteResponse) => {
                    expect(secondDeleteResponse.status).to.eq(200); 
                    expect(secondDeleteResponse.body).to.be.empty;

                    GetListComments(listId).then((getResponse) => {
                    const deletedComment = getResponse.body.comments.find(
                        (comment) => String(comment.id) === commentId
                    );
                    expect(deletedComment).to.be.undefined;
                        });
                });
            });
        });
    });

    it('Clean environment', () => {
        DeleteTestList(listId);
    });

});
