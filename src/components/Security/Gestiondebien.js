import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import Sidebar from './Sidebar';
import Header from './Header';
import './style/biens.css';
import { Navigate } from 'react-router-dom';
import { getBiens, createBien, updateBien, deleteBien } from './bienService';

export default function Gestiondebien() {
  const [biens, setBiens] = useState([]);
  const [filteredBiens, setFilteredBiens] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [idBien, setIdBien] = useState('');
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [dateAcquisition, setDateAcquisition] = useState('');
  const [valeur, setValeur] = useState('');
  const [etat, setEtat] = useState('');
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [modificationHistory, setModificationHistory] = useState({});
  const [error, setError] = useState(null);
  const isAuthenticated = !!localStorage.getItem('token');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchBiensData = async () => {
      try {
        const data = await getBiens(token);
        setBiens(data);
        setFilteredBiens(data);
      } catch (error) {
        console.error('Error fetching biens:', error);
      }
    };

    fetchBiensData();
  }, [token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredBiens(biens);
    } else {
      setFilteredBiens(
        biens.filter((bien) =>
          bien.nom.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };

  const handleEnregistrer = async () => {
    try {
      const newBien = {
        nom,
        description,
        localisation,
        dateAcquisition,
        valeur,
        etat,
        image,
      };

      const response = await createBien(newBien, token);

      // Vérifier si la réponse contient un bien avec un id valide
      if (response.data && response.data.id) {
        // Mettre à jour la liste des biens localement
        setBiens([...biens, response.data]);

        handleCloseModal();

        // Réinitialiser les champs du formulaire
        setIdBien('');
        setNom('');
        setDescription('');
        setLocalisation('');
        setDateAcquisition('');
        setValeur('');
        setEtat('');
        setImage(null);

        // Enregistrer l'historique de modification
        enregistrerHistoriqueModification(response.data);
      } else {
        console.error('Error adding bien: Invalid response data');
        // Gérer l'erreur ou afficher un message à l'utilisateur
      }
    } catch (error) {
      console.error('Error adding bien:', error);
      // Gérer l'erreur ou afficher un message à l'utilisateur
    }
  };

  const handleModifier = async () => {
    try {
      const updatedBien = {
        id: idBien,
        nom: nom || '',
        description: description || '',
        localisation: localisation || '',
        dateAcquisition: dateAcquisition || '',
        valeur: valeur || '',
        etat: etat || '',
        image: image || null,
      };

      const response = await updateBien(updatedBien, token);

      // Vérifier si la réponse contient un bien avec un id valide
      if (response.data && response.data.id) {
        // Mettre à jour localement la liste des biens avec le bien mis à jour
        const updatedBiens = biens.map((bien) =>
          bien.id === response.data.id ? response.data : bien
        );
        setBiens(updatedBiens);

        // Enregistrer l'historique de modification
        enregistrerHistoriqueModification(response.data);

        handleCloseModal();
        // Réinitialiser les champs du formulaire
        setIdBien('');
        setNom('');
        setDescription('');
        setLocalisation('');
        setDateAcquisition('');
        setValeur('');
        setEtat('');
        setImage(null);
      } else {
        console.error('Error updating bien: Invalid response data');
        // Gérer l'erreur ou afficher un message à l'utilisateur
      }
    } catch (error) {
      console.error('Error updating bien:', error);
      // Gérer l'erreur ou afficher un message à l'utilisateur
    }
  };

  const handleSupprimer = async (id) => {
    try {
      await deleteBien(id, token);

      // Mettre à jour localement la liste des biens en retirant le bien supprimé
      const updatedBiens = biens.filter((bien) => bien.id !== id);
      setBiens(updatedBiens);
    } catch (error) {
      console.error('Error deleting bien:', error);
    }
  };

  const handleShowModal = (bien) => {
    setIdBien(bien.id || '');
    setNom(bien.nom || '');
    setDescription(bien.description || '');
    setLocalisation(bien.localisation || '');
    setDateAcquisition(bien.dateAcquisition || '');
    setValeur(bien.valeur || '');
    setEtat(bien.etat || '');
    setImage(bien.image || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setIdBien('');
    setNom('');
    setDescription('');
    setLocalisation('');
    setDateAcquisition('');
    setValeur('');
    setEtat('');
    setImage(null);
    setShowModal(false);
  };

  const headers = [
    { label: 'اسم العقار', key: 'nom' },
    { label: 'الوصف', key: 'description' },
    { label: 'الموقع', key: 'localisation' },
    { label: 'تاريخ الاقتناء', key: 'dateAcquisition' },
    { label: 'القيمة', key: 'valeur' },
    { label: 'الحالة', key: 'etat' },
  ];

  const enregistrerHistoriqueModification = (bien) => {
    setModificationHistory((prevHistory) => ({
      ...prevHistory,
      [bien.id]: [
        ...(prevHistory[bien.id] || []),
        { ...bien, date: new Date().toISOString() },
      ],
    }));
  };

  const handleShowHistoryModal = (bien) => {
    setIdBien(bien.id);
    setShowHistoryModal(true);
  };

  const handleCloseHistoryModal = () => {
    setIdBien('');
    setShowHistoryModal(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div>
      <Sidebar />
      <header className="header">
        <Header />
      </header>
      <div className="Form-container">
        <h2 className="title">إدارة الأملاك البلدية</h2>

        <div className="btn-add">
          <Button variant="primary" onClick={() => handleShowModal({})}>
            إضافة عقار جديد
          </Button>

          <CSVLink
            data={biens}
            headers={headers}
            filename={'biens.csv'}
            className="btn btn-success"
            target="_blank"
          >
            تصدير CSV
          </CSVLink>
        </div>
        <Form.Control
          type="text"
          placeholder="ابحث عن عقار"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            marginTop: '10px',
            textAlign: 'right',
            width: '20%',
            marginLeft: '2%',
          }}
        />

        <br />
        <Table striped bordered hover className="table-aff">
          <thead>
            <tr>
              <th>إجراءات</th>
              <th>الحالة</th>
              <th>القيمة</th>
              <th>تاريخ الاقتناء</th>
              <th>الموقع</th>
              <th>الوصف</th>
              <th>اسم العقار</th>
              <th>الصورة</th>
            </tr>
          </thead>
          <tbody>
            {filteredBiens.map((bien) => (
              <tr key={bien.id}>
                <td>
                  <Button variant="info" onClick={() => handleShowModal(bien)}>
                    تعديل
                  </Button>{' '}
                  <Button
                    variant="danger"
                    onClick={() => handleSupprimer(bien.id)}
                  >
                    حذف
                  </Button>{' '}
                  <Button
                    variant="secondary"
                    onClick={() => handleShowHistoryModal(bien)}
                  >
                    عرض التاريخ
                  </Button>
                </td>
                <td>{bien.etat}</td>
                <td>{bien.valeur}</td>
                <td>
                  {new Date(bien.dateAcquisition).toLocaleDateString('ar-EG')}
                </td>
                <td>{bien.localisation}</td>
                <td>{bien.description}</td>
                <td>{bien.nom}</td>
                <td>
                  {bien.image && (
                    <img
                      src={bien.image}
                      alt={bien.nom}
                      style={{ width: '100px', height: '100px' }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal} dir="rtl">
          <Modal.Header closeButton>
            <Modal.Title>
              {idBien ? 'تعديل العقار' : 'إضافة عقار جديد'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNom">
                <Form.Label>اسم العقار</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ادخل اسم العقار"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  style={{ textAlign: 'right' }}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>الوصف</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="ادخل وصف العقار"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ textAlign: 'right' }}
                />
              </Form.Group>
              <Form.Group controlId="formLocalisation">
                <Form.Label>الموقع</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ادخل الموقع"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  style={{ textAlign: 'right' }}
                />
              </Form.Group>
              <Form.Group controlId="formDateAcquisition">
                <Form.Label>تاريخ الاقتناء</Form.Label>
                <Form.Control
                  type="date"
                  value={dateAcquisition}
                  onChange={(e) => setDateAcquisition(e.target.value)}
                  style={{ textAlign: 'right' }}
                />
              </Form.Group>
              <Form.Group controlId="formValeur">
                <Form.Label>القيمة</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ادخل القيمة"
                  value={valeur}
                  onChange={(e) => setValeur(e.target.value)}
                  style={{ textAlign: 'right' }}
                />
              </Form.Group>
              <Form.Group controlId="formEtat">
                <Form.Label>الحالة</Form.Label>
                <Form.Control
                  as="select"
                  value={etat}
                  onChange={(e) => setEtat(e.target.value)}
                  style={{ textAlign: 'right' }}
                >
                  <option>ممتاز</option>
                  <option>جيد</option>
                  <option>متوسط</option>
                  <option>سيء</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formImage">
                <Form.Label>صورة العقار</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageChange}
                  style={{ textAlign: 'right' }}
                />
                {image && (
                  <img
                    src={image}
                    alt="Selected property"
                    style={{
                      width: '100px',
                      height: '100px',
                      marginTop: '10px',
                    }}
                  />
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              إلغاء
            </Button>
            <Button
              variant={idBien ? 'info' : 'primary'}
              onClick={idBien ? handleModifier : handleEnregistrer}
            >
              {idBien ? 'تعديل' : 'إضافة'}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showHistoryModal}
          onHide={handleCloseHistoryModal}
          dir="rtl"
        >
          <Modal.Header closeButton>
            <Modal.Title>تاريخ التعديلات على العقار</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modificationHistory[idBien] &&
            modificationHistory[idBien].length > 0 ? (
              <ul>
                {modificationHistory[idBien].map((history, index) => (
                  <li key={index}>
                    <strong>التاريخ:</strong>{' '}
                    {new Date(history.date).toLocaleString()} <br />
                    <strong>الاسم:</strong> {history.nom} <br />
                    <strong>الوصف:</strong> {history.description} <br />
                    <strong>الموقع:</strong> {history.localisation} <br />
                    <strong>تاريخ الاقتناء:</strong> {history.dateAcquisition}{' '}
                    <br />
                    <strong>القيمة:</strong> {history.valeur} <br />
                    <strong>الحالة:</strong> {history.etat}
                  </li>
                ))}
              </ul>
            ) : (
              <p>لا توجد تعديلات لهذا العقار حتى الآن.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseHistoryModal}>
              إغلاق
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
