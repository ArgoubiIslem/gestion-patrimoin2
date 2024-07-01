import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import Sidebar from './Sidebar';
import Header from './Header';
import './style/biens.css';
export default function Gestiondebien() {
  const [biens, setBiens] = useState([]);
  const [idBien, setIdBien] = useState('');
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [dateAcquisition, setDateAcquisition] = useState('');
  const [valeur, setValeur] = useState('');
  const [etat, setEtat] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fonction pour charger les biens existants lors du chargement initial
  useEffect(() => {
    chargerBiens();
  }, []);

  const chargerBiens = () => {
    // Exemple fictif de données de biens
    const biensRecuperes = [
      {
        id: 1,
        nom: 'Bien A',
        description: 'Description A',
        localisation: 'Localisation A',
        dateAcquisition: '2024-06-30',
        valeur: 100000,
        etat: 'Bon',
      },
      {
        id: 2,
        nom: 'Bien B',
        description: 'Description B',
        localisation: 'Localisation B',
        dateAcquisition: '2024-06-25',
        valeur: 80000,
        etat: 'À rénover',
      },
    ];
    // Inverser l'ordre des biens récupérés
    setBiens(biensRecuperes.reverse());
  };

  const handleEnregistrer = () => {
    // Appeler votre service pour enregistrer un nouveau bien
    const nouveauBien = {
      nom,
      description,
      localisation,
      dateAcquisition,
      valeur,
      etat,
    };
    // Implémentation du service ici
    // Réinitialiser les champs après l'enregistrement
    handleCloseModal();
  };

  const handleModifier = () => {
    // Appeler votre service pour modifier un bien existant
    const bienModifie = {
      id: idBien,
      nom,
      description,
      localisation,
      dateAcquisition,
      valeur,
      etat,
    };
    // Implémentation du service ici
    // Réinitialiser les champs après la modification
    handleCloseModal();
  };

  const handleSupprimer = (id) => {
    // Appeler votre service pour supprimer un bien
    // Implémentation du service ici
  };

  const handleShowModal = (bien) => {
    setIdBien(bien.id || '');
    setNom(bien.nom || '');
    setDescription(bien.description || '');
    setLocalisation(bien.localisation || '');
    setDateAcquisition(bien.dateAcquisition || '');
    setValeur(bien.valeur || '');
    setEtat(bien.etat || '');
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
    setShowModal(false);
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
        </div>
        <br></br>
        <Table striped bordered hover className='table-aff'>
          <thead>
            <tr>
              <th>إجراءات</th>
              <th>الحالة</th>
              <th>القيمة</th>
              <th>تاريخ الاقتناء</th>
              <th>الموقع</th>
              <th>الوصف</th>
              <th>اسم العقار</th>
            </tr>
          </thead>
          <tbody>
            {biens
              .slice() // Créer une copie pour éviter de modifier l'ordre dans biens original
              .reverse() // Inverser l'ordre des éléments
              .map((bien) => (
                <tr key={bien.id}>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => handleShowModal(bien)}
                    >
                      تعديل
                    </Button>{' '}
                    <Button
                      variant="danger"
                      onClick={() => handleSupprimer(bien.id)}
                    >
                      حذف
                    </Button>
                  </td>
                  <td>{bien.etat}</td>
                  <td>{bien.valeur}</td>
                  <td>{bien.dateAcquisition}</td>
                  <td>{bien.localisation}</td>
                  <td>{bien.description}</td>
                  <td>{bien.nom}</td>
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
                  placeholder="ادخل الموقع الجغرافي"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  style={{ textAlign: 'right' }}
                />
              </Form.Group>
              <Form.Group controlId="formDateAcquisition">
                <Form.Label>تاريخ الاقتناء</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="YYYY-MM-DD"
                  value={dateAcquisition}
                  onChange={(e) => setDateAcquisition(e.target.value)}
                  style={{ textAlign: 'right' }}
                />
              </Form.Group>
              <Form.Group controlId="formValeur">
                <Form.Label>القيمة</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ادخل القيمة المالية"
                  value={valeur}
                  onChange={(e) => setValeur(e.target.value)}
                  style={{ textAlign: 'right' }}
                />
              </Form.Group>
              <Form.Group controlId="formEtat">
                <Form.Label>الحالة</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ادخل الحالة الحالية للعقار"
                  value={etat}
                  onChange={(e) => setEtat(e.target.value)}
                  style={{ textAlign: 'right' }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              إغلاق
            </Button>
            {idBien ? (
              <Button variant="primary" onClick={handleModifier}>
                حفظ التعديلات
              </Button>
            ) : (
              <Button variant="primary" onClick={handleEnregistrer}>
                إضافة عقار
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
