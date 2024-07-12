import React, { useState, useEffect } from 'react';
import './style/MaintenanceForm.css';
import Sidebar from './Sidebar';
import Header from './Header';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from './ActivityService'; // Assurez-vous d'importer correctement le chemin vers votre fichier d'API

const MaintenanceForm = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [upcomingSearchTerm, setUpcomingSearchTerm] = useState('');
  const [completedSearchTerm, setCompletedSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('jwtToken'); // Obtenez le token d'authentification à partir de votre authentification JWT
      const activitiesData = await getActivities(token);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newActivity = {
      description,
      date,
      duration: parseInt(duration),
    };

    try {
      const token = localStorage.getItem('jwtToken'); // Obtenez le token d'authentification à partir de votre authentification JWT
      if (isEditing && currentActivity) {
        await updateActivity(currentActivity.id, newActivity, token);
        setIsEditing(false);
        setCurrentActivity(null);
      } else {
        await createActivity(newActivity, token);
      }
      fetchActivities();
      setDescription('');
      setDate('');
      setDuration('');
      setShowModal(false);
    } catch (error) {
      console.error('Error creating/updating activity:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('jwtToken'); // Obtenez le token d'authentification à partir de votre authentification JWT
      await deleteActivity(id, token);
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleEdit = (activity) => {
    setDescription(activity.description);
    setDate(activity.date);
    setDuration(activity.duration);
    setIsEditing(true);
    setCurrentActivity(activity);
    setShowModal(true);
  };

  const filteredUpcomingActivities = activities.filter(
    (activity) =>
      !activity.completed &&
      new Date(activity.date) >= new Date() &&
      activity.description
        .toLowerCase()
        .includes(upcomingSearchTerm.toLowerCase())
  );

  const filteredCompletedActivities = activities.filter(
    (activity) =>
      activity.completed ||
      (new Date(activity.date) < new Date() &&
        activity.description
          .toLowerCase()
          .includes(completedSearchTerm.toLowerCase()))
  );

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  };

  return (
    <div>
      <Sidebar />
      <header className="header">
        <Header />
      </header>
      <div className="Form-container">
        <h2 className="title">الأنشطة المخططة</h2>
        <br></br>
        <div className="btn-add">
          {' '}
          <Button variant="primary" onClick={() => setShowModal(true)}>
            إضافة نشاط جديد
          </Button>
        </div>

        <div className="main-container">
          <Row>
            <Col>
              <div className="activities-list">
                <h3 className="title">الأنشطة القادمة</h3>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="ابحث عن نشاط"
                    aria-label="ابحث عن نشاط"
                    aria-describedby="basic-addon2"
                    value={upcomingSearchTerm}
                    onChange={(e) => setUpcomingSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <ul className="activities" style={{ listStyleType: 'none' }}>
                  {filteredUpcomingActivities.map((activity) => (
                    <li key={activity.id} className="activity-item">
                      <div>
                        <strong>{formatDate(activity.date)}</strong>:{' '}
                        {activity.description} ({activity.duration} ساعات)
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(activity)}
                        >
                          تعديل
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(activity.id)}
                        >
                          حذف
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
            <Col>
              <div className="completed-activities">
                <h3 className="title2">الأنشطة المكتملة</h3>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="ابحث عن نشاط"
                    aria-label="ابحث عن نشاط"
                    aria-describedby="basic-addon2"
                    value={completedSearchTerm}
                    onChange={(e) => setCompletedSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <ul className="activities" style={{ listStyleType: 'none' }}>
                  {filteredCompletedActivities.map((activity) => (
                    <li key={activity.id} className="activity-item">
                      <div>
                        <strong>{formatDate(activity.date)}</strong>:{' '}
                        {activity.description} ({activity.duration} ساعات)
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </div>

        {/* Modal pour ajouter une nouvelle activité */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? 'تعديل النشاط' : 'إضافة نشاط جديد'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formDescription">
                <Form.Label>وصف النشاط</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="أدخل وصف النشاط"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDate">
                <Form.Label>تاريخ النشاط</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDuration">
                <Form.Label>مدة النشاط (بالساعات)</Form.Label>
                <Form.Control
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {isEditing ? 'تعديل النشاط' : 'إضافة النشاط'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default MaintenanceForm;
