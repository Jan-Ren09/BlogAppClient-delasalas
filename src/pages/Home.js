import {useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap"; // Import only what's necessary
import BlogCard from "../components/BlogCard";
import {Notyf} from "notyf"; 
import 'notyf/notyf.min.css';

export default function Home() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const notyf = new Notyf(); 

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}blog/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                title,
                content
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to create post');
            }
            return res.json();
        })
        .then(data => {
            setPosts(prevPosts => [data, ...prevPosts]);
            setTitle('');
            setContent('');
            notyf.success("Post created successfully");
        })
        .catch(error => {
            console.error("Error creating post:", error);
        });
    };

    useEffect(() => {
        const fetchPosts = () => {
            fetch(`${process.env.REACT_APP_API_BASE_URL}blog/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch posts');
                    }
                    return response.json();
                })
                .then(data => {
                    setPosts(data);
                })
                .catch(error => {
                    console.error("Error fetching posts:", error);
                    throw new Error ('Failed to load posts');
                })
                .finally(() => {
                    setLoading(false); 
                });
        };

        fetchPosts();
    }, [token]);

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center my-3 ">
            <Container className="my-3 border rounded shadow p-3">
                <h3>You post it, We Roast it!</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter the title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Write your post content here"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Align the button to the right */}
                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="primary" type="submit">
                            Post
                        </Button>
                    </div>
                </Form>
            </Container>
            {loading ? (
                <p>Loading...</p>
            ) : (
                posts.map(post => (
                    <BlogCard key={post._id} post={post} onDelete={(id) => setPosts(prev => prev.filter(p => p._id !== id))}  
                    onEdit={(id, updatedData) => {
                        setPosts(prevPosts =>
                            prevPosts.map(p => (p._id === id ? { ...p, ...updatedData } : p))
                        );
                    }}/>
                ))
            )}
        </Container>
    );
}
