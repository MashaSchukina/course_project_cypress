/// <reference types="cypress" />
const {
    UpdateUserId,
    CreateTestList,
    DeleteTestList,
    CreateListComment,
    GetListComments,
    UpdateComment,
    DeleteComment,
    GetListCommentsWithoutHeaderToken,
    GetListCommentsWithInvalidToken,
    CreateListCommentWithoutHeaderToken,
    CreateListCommentWithInvalidToken,
    CreateListCommentWithoutCommentText,
    UpdateCommentWithoutHeaderToken,
    UpdateCommentWithInvalidToken,
    DeleteCommentWithoutHeaderToken,
    DeleteCommentWithInvalidToken,
} = require('../../modules/comment_method');




describe('Tests for List Comments API for ClickUp', () => {

    it('Prepare environment variables', () => {
        UpdateUserId();
    });


    it('Update Comment with valid authorization header and valid body', () => {
        CreateTestList().then((listResponse) => {
            const listId = listResponse.body.id;

            CreateListComment(listId).then((createResponse) => {
                const commentId = String(createResponse.body.id);

                UpdateComment(commentId).then((updateResponse) => {
                    expect(updateResponse.status).to.eq(200);
                    

                    cy.get('@AliasUpdatedCommentText').then((updatedText) => {
                        GetListComments(listId).then((getResponse) => {
                            const updatedComment = getResponse.body.comments.find(
                                (comment) => String(comment.id) === commentId
                            );
                            expect(updatedComment).to.exist;
                            expect(updatedComment.comment_text).to.eq(updatedText);
                            

                            DeleteComment(commentId);
                            DeleteTestList(listId);
                        });
                    });
                });
            });
        });
    })
})