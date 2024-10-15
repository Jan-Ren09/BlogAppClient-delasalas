import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faComments } from "@fortawesome/free-regular-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";
import { Notyf } from "notyf";
import 'notyf/notyf.min.css'; // Import Notyf CSS

export default function BlogCard({ post, onDelete, onEdit }) {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [newTitle, setNewTitle] = useState(post.title);
    const [newContent, setNewContent] = useState(post.content);
    const notyf = new Notyf();
    console.log(comments)
    const handleShowComments = () => {
        setShowCommentModal(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}blog/${post._id}`)
            .then(response => {
                if (!response) {
                    
                    throw new Error('Failed to fetch comments');
                }
                return response.json();
            })
            .then(data => {
                setComments(data.comments || []);
            })
            .catch(error => {
                console.error("Error fetching comments:", error);
                notyf.error('Failed to load comments');
            });
    };

    // Handle adding a comment
    const handleAddComment = () => {
        if (!newComment) return notyf.error('Comment cannot be empty');
        
        fetch(`${process.env.REACT_APP_API_BASE_URL}blog/${post._id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ comment: newComment }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add comment');
                }
                return response.json();
            })
            .then(data => {
                setComments(data.updatedBlog.comments);
                setNewComment("");
                notyf.success('Comment added successfully');
            })
            .catch(error => {
                console.error("Error adding comment:", error);
                notyf.error('Failed to add comment');
            });
    };

    // Handle deleting a comment
    const handleDeleteComment = (commentId) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}blog/comments/${commentId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if(data.message === "You are not authorized to delete this comment"){
                    notyf.error('You are not authorized to delete this comment');
                }
                setComments(data.updatedBlog.comments);
                notyf.success('Comment deleted successfully');
            })
            .catch(error => {
                console.error("Error deleting comment:", error);
            });
    };

    const handleEditBlog = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}blog/${post._id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                title: newTitle,
                content: newContent
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.message === 'Actiion invalid, You are not the author of this Blog'){
                notyf.error('Actiion invalid, You are not the author of this Blog')
            }else{
            notyf.success('Blog updated successfully');
            setEditMode(false);
            onEdit(post._id, { title: newTitle, content: newContent })
            }
        })
        .catch(error => {
            console.error("Error updating blog:", error);
            notyf.error(error.message || 'Failed to update blog'); // Use the error message or a fallback
        });
    };
    

    // Handle delete blog
    const handleDeleteBlog = () => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}blog/${post._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(response =>
                response.json())
            .then(data => {
                console.log(data);
                // Check the message from the response data
                if (data.message === "Blog deleted successfully") {
                    onDelete(post._id); // Call the parent function to remove the blog
                    notyf.success('Blog deleted successfully');
                } else if (data.message === 'You are not authorized to delete this blog') {
                    notyf.error('You are not authorized to delete this blog');
                } else {
                    notyf.error('Unexpected response: ' + data.message);
                }
            })
            .catch(error => {
                console.error("Error deleting blog:", error);
                notyf.error('Failed to delete blog');
            });
        }
    };
    

    return (
        <div className='container px-5 py-2 border rounded-4 shadow m-3 d-flex flex-column' style={{ position: 'relative' }}>
            {editMode ? (
                <>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={newTitle} 
                            onChange={(e) => setNewTitle(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={newContent} 
                            onChange={(e) => setNewContent(e.target.value)} 
                        />
                    </Form.Group>
                    <div className="container">
                        <div className="row justify-content-center">
                            <Button onClick={handleEditBlog} className="col-2 mx-2">Save</Button>
                            <Button variant="secondary" onClick={() => setEditMode(false)} className="col-2 mx-2">Cancel</Button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='p-2' style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{post.title}</div>
                    <div className='p-2' style={{ fontSize: '1rem', color: 'gray' }}>{post.author || 'Unknown Author'}</div>
                    <div className='p-4' style={{ fontSize: '1.5rem', flexGrow: 1 }}>{post.content}</div>
                </>
            )}
            <div className="position-absolute bottom-0 end-0 p-2 d-flex" style={{ margin: '10px' }}>
                    <>
                        <div className="me-3" onClick={() => setEditMode(true)} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </div>
                        <div className="me-3" onClick={handleDeleteBlog} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </div>
                        <div onClick={handleShowComments} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faComments} />
                        </div>
                    </>
            </div>

            {/* Comments Modal */}
            <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        comments.map(comment => (
                            <div key={comment._id} className="mb-2">
                                <strong>{comment.commentor}:</strong> {comment.comment}
                                <Button variant="link" onClick={() => handleDeleteComment(comment._id)} className="text-danger">
                                    Delete
                                </Button>
                            </div>
                        ))
                    )}
                    <Form.Group className="mt-3">
                        <Form.Label>Add a comment:</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCommentModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddComment}>Add Comment</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
