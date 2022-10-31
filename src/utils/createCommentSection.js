const fs = require("fs");

function createCommentSection(comments, commentForm, parent_id = null) {
  let commentBody = "";

  const commentCard = fs.readFileSync(
    "src/views/post/commentCard.html",
    "utf-8"
  );
  const commentModal = fs.readFileSync(
    "src/views/post/commentModal.html",
    "utf-8"
  );
  comments
    .filter(c => c.parent_id === parent_id)
    .map(c => {
      let card = commentCard.replace("{username}", c.username);
      card = card.replace("{userId}", c.user_id);
      card = card.replace(
        "{timestamp}",
        new Date(c.created_at).toLocaleDateString()
      );
      card = card.replace("{content}", c.content);
      const replyForm = commentForm.replace("{commentId}", c.id);
      const modal = commentModal.replace("{commentModal}", replyForm);
      card = card.replace("{replyBtn}", modal);
      card = card.replace(
        "{replySection}",
        createCommentSection(comments, commentForm, c.id)
      );
      commentBody += card;
    });
  return commentBody;
}

module.exports = createCommentSection;
