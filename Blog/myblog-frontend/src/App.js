import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, ListGroup, Alert } from 'react-bootstrap';
import axios from 'axios';

function App() {
    // Хранение токена для аутентификации
    const [token, setToken] = useState(localStorage.getItem('authToken') || null);
    // Логин и пароль для ввода в форме
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // Переключатель между регистрацией и логином
    const [isRegistered, setIsRegistered] = useState(true);
    // Массив событий
    const [events, setEvents] = useState([]);
    // Данные для нового события
    const [newEvent, setNewEvent] = useState({ title: '', description: '' });
    // Событие, которое редактируется в данный момент
    const [editingEvent, setEditingEvent] = useState(null);
    // Сообщение об ошибках (логин, регистрация, создание события)
    const [errorMessage, setErrorMessage] = useState('');

    // Загружаем события, если токен существует (пользователь авторизован)
    useEffect(() => {
        if (token) {
            fetchEvents();
        }
    }, [token]);

    // Функция для загрузки списка событий
    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/events/', {
                headers: { Authorization: `Token ${token}` }  // Отправляем токен в заголовке запроса
            });
            setEvents(response.data);  // Сохраняем события в состоянии
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    // Функция для входа в систему
    const handleLogin = async (e) => {
        e.preventDefault();  // Предотвращаем перезагрузку страницы
        try {
            const response = await axios.post('http://localhost:8000/api-auth/token/login/', { username, password });
            localStorage.setItem('authToken', response.data.auth_token);  // Сохраняем токен в localStorage
            setToken(response.data.auth_token);  // Обновляем токен в состоянии
            setErrorMessage('');  // Очищаем сообщение об ошибке
        } catch (error) {
            setErrorMessage('Invalid username or password');  // Сообщение об ошибке, если вход не удался
        }
    };

    // Функция для регистрации нового пользователя
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api-auth/users/', { username, password });
            localStorage.setItem('authToken', response.data.auth_token);  // Сохраняем токен в localStorage
            setToken(response.data.auth_token);  // Обновляем токен в состоянии
            setErrorMessage('');  // Очищаем сообщение об ошибке
        } catch (error) {
            setErrorMessage('Registration failed: please check your details');  // Сообщение об ошибке, если регистрация не удалась
        }
    };

    // Функция для выхода из системы
    const handleLogout = () => {
        setToken(null);  // Удаляем токен из состояния
        localStorage.removeItem('authToken');  // Удаляем токен из localStorage
        setEvents([]);  // Очищаем список событий
    };

    // Функция для создания нового события
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.description) {  // Проверяем наличие данных
            setErrorMessage('Title and Description are required.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/api/events/', {
                title: newEvent.title,
                description: newEvent.description,
            }, {
                headers: { Authorization: `Token ${token}` }  // Отправляем токен для аутентификации
            });
            setEvents([...events, response.data]);  // Добавляем новое событие в список событий
            setNewEvent({ title: '', description: '' });  // Очищаем форму
            setErrorMessage('');  // Очищаем сообщение об ошибке при успешном создании
        } catch (error) {
            console.error('Error creating event:', error.response ? error.response.data : error.message);
            setErrorMessage('Failed to create event. Please check your input.');
        }
    };

    // Функция для удаления события
    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`http://localhost:8000/api/events/${eventId}/`, {
                headers: { Authorization: `Token ${token}` }  // Отправляем токен для аутентификации
            });
            setEvents(events.filter(event => event.id !== eventId));  // Удаляем событие из списка
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    // Функция для начала редактирования события
    const startEditing = (event) => {
        setEditingEvent(event);  // Устанавливаем событие, которое редактируется
        setNewEvent({ title: event.title, description: event.description });  // Заполняем форму данными события
    };

    // Функция для сохранения изменений после редактирования
    const handleEditEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/api/events/${editingEvent.id}/`, newEvent, {
                headers: { Authorization: `Token ${token}` }  // Отправляем токен для аутентификации
            });
            setEvents(events.map(event => (event.id === editingEvent.id ? response.data : event)));  // Обновляем список событий
            setEditingEvent(null);  // Очищаем состояние редактирования
            setNewEvent({ title: '', description: '' });  // Очищаем форму
        } catch (error) {
            console.error('Error editing event:', error);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    {!token ? (
                        <>
                            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}  {/* Вывод сообщения об ошибке */}
                            <Form onSubmit={isRegistered ? handleLogin : handleRegister}>
                                <h2>{isRegistered ? "Login" : "Register"}</h2>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    {isRegistered ? "Login" : "Register"}
                                </Button>

                                <Button variant="link" className="w-100 mt-3" onClick={() => setIsRegistered(!isRegistered)}>
                                    {isRegistered ? "Don't have an account? Register" : "Already have an account? Login"}
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <>
                            <Row className="mb-3">
                                <Col>
                                    <h2>Blog</h2>
									<Button variant="secondary" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </Col>
                            </Row>

                            {/* Форма создания или редактирования события */}
                            <Form onSubmit={editingEvent ? handleEditEvent : handleCreateEvent}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        placeholder="Enter event title"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        placeholder="Enter event description"
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    {editingEvent ? "Save Changes" : "Create Event"}
                                </Button>
                            </Form>

                            {/* Список событий */}
                            {events.length === 0 ? (
                                <p>No events available. Please add some events.</p>
                            ) : (
                                <ListGroup className="mt-4">
                                    {events.map(event => (
                                        <ListGroup.Item key={event.id}>
                                            <h5>{event.title}</h5>
                                            <p>{event.description}</p>
                                            <Button variant="warning" className="me-2" onClick={() => startEditing(event)}>
                                                Edit
                                            </Button>
                                            <Button variant="danger" onClick={() => handleDeleteEvent(event.id)}>
                                                Delete
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default App;