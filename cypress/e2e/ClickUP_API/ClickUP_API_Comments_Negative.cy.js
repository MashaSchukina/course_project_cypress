/// <reference types="cypress" />
const {
    CreateTestList,
    DeleteTestList,
    CreateListComment,
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

    let listId;

    it('Prepare environment', () => {

        CreateTestList().then((listResponse) => {
            listId = listResponse.body.id;
        });
    });



    it('Get List Comments without authorization header', () => {
        GetListCommentsWithoutHeaderToken(listId).then((getResponse) => {
            expect(getResponse.status).to.eq(400);
            expect(getResponse.body).to.deep.equal({
                err: 'Authorization header required',
                ECODE: 'OAUTH_017',
            });
        });
    });

    it('Get List Comments with invalid authorization header', () => {
        GetListCommentsWithInvalidToken(listId).then((getResponse) => {
            expect(getResponse.status).to.eq(401);
            expect(getResponse.body).to.deep.equal({
                err: 'Token invalid',
                ECODE: 'OAUTH_025',
            });
        });
    });


    it('Create List Comment without authorization header', () => {
        CreateListCommentWithoutHeaderToken(listId).then((createResponse) => {
            expect(createResponse.status).to.eq(400);
            expect(createResponse.body).to.deep.equal({
                err: 'Authorization header required',
                ECODE: 'OAUTH_017'
            });
        });
    });

    it('Create List Comment with invalid authorization header', () => {
        CreateListCommentWithInvalidToken(listId).then((createResponse) => {
            expect(createResponse.status).to.eq(401);
            expect(createResponse.body).to.deep.equal({
                err: 'Token invalid',
                ECODE: 'OAUTH_025',
            });
        });
    });

    it('Create List Comment without required comment_text', () => {
        CreateListCommentWithoutCommentText(listId).then((createResponse) => {
            expect(createResponse.status).to.eq(400);
            expect(createResponse.body.err).to.not.be.empty;
        });
    });

    it('Update Comment without authorization header', () => {
        CreateListComment(listId).then((createResponse) => {
            const commentId = String(createResponse.body.id);

            UpdateCommentWithoutHeaderToken(commentId).then((updateResponse) => {
                expect(updateResponse.status).to.eq(400);
                expect(updateResponse.body).to.deep.equal({
                    err: 'Authorization header required',
                    ECODE: 'OAUTH_017',
                });
            });

            DeleteComment(commentId);
        });
    });

    it('Update Comment with invalid authorization header', () => {
        CreateListComment(listId).then((createResponse) => {
            const commentId = String(createResponse.body.id);

            UpdateCommentWithInvalidToken(commentId).then((updateResponse) => {
                expect(updateResponse.status).to.eq(401);
                expect(updateResponse.body).to.deep.equal({
                    err: 'Token invalid',
                    ECODE: 'OAUTH_025',
                });
            });

            DeleteComment(commentId);
        });
    });



    it('Delete Comment without authorization header', () => {
        CreateListComment(listId).then((createResponse) => {
            const commentId = String(createResponse.body.id);

            DeleteCommentWithoutHeaderToken(commentId).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(400);
                expect(deleteResponse.body).to.deep.equal({
                    err: 'Authorization header required',
                    ECODE: 'OAUTH_017',
                });
            });

            DeleteComment(commentId);
        });
    });

    it('Delete Comment with invalid authorization header', () => {
        CreateListComment(listId).then((createResponse) => {
            const commentId = String(createResponse.body.id);

            DeleteCommentWithInvalidToken(commentId).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(401);
                expect(deleteResponse.body).to.deep.equal({
                    err: 'Token invalid',
                    ECODE: 'OAUTH_025',
                });
            });

            DeleteComment(commentId);
        });
    });

    it('Clean environment', () => {
        DeleteTestList(listId);
    });

});
