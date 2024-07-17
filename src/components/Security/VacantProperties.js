import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Table, Card, ListGroup } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import Sidebar from './Sidebar';
import Header from './Header';
import './style/vacant.css'; // Assurez-vous d'importer vos styles CSS

const VacantProperties = () => {
  const [vacantProperties, setVacantProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [paidAmount, setPaidAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [installments, setInstallments] = useState([]);
  const receiptRef = useRef();

  useEffect(() => {
    fetchVacantProperties();
  }, []);

  const fetchVacantProperties = () => {
    fetch('http://localhost:8081/api/property-payments')
      .then((response) => response.json())
      .then((data) => setVacantProperties(data))
      .catch((error) =>
        console.error('Error fetching vacant properties:', error)
      );
  };

  const monthNamesArabicFull = [
    'جانفي',
    'فيفري',
    'مارس',
    'أفريل',
    'ماي',
    'جوان',
    'جويلية',
    'أوت',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setPaidAmount('');
    setSelectedPaymentMethod('');
    setInstallments([]);
  };

  const handlePaidAmountChange = (event) => {
    setPaidAmount(event.target.value);
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);

    let installmentCount = 0;
    let interval = 1;
    switch (method) {
      case 'monthly':
        installmentCount = 12;
        interval = 1;
        break;
      case 'semiAnnual':
        installmentCount = 2;
        interval = 6;
        break;
      case 'quarterly':
        installmentCount = 4;
        interval = 3;
        break;
      default:
        installmentCount = 12;
        interval = 1;
        break;
    }

    const remainingAmount =
      selectedProperty.rentalAmount - selectedProperty.paidAmount;
    const installmentAmount = remainingAmount / installmentCount;

    const payments = Array.from({ length: installmentCount }, (_, index) => ({
      period: monthNamesArabicFull[(index * interval) % 12],
      amount: installmentAmount.toFixed(2),
    }));
    setInstallments(payments);
  };

  const handleSavePayment = () => {
    if (!selectedProperty || !paidAmount || !selectedPaymentMethod) {
      alert(
        'Veuillez sélectionner un bien, saisir le montant payé et choisir un mode de paiement.'
      );
      return;
    }

    const updatedProperty = {
      ...selectedProperty,
      paidAmount: parseFloat(paidAmount),
      paymentMethod: selectedPaymentMethod,
    };

    fetch(
      `http://localhost:8081/api/property-payments/${selectedProperty.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProperty),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSelectedProperty(data);
        fetchVacantProperties();
      })
      .catch((error) =>
        console.error('Erreur lors de la mise à jour du bien:', error)
      );
  };

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  return (
    <div>
      <Sidebar />
      <header className="header">
        <Header />
      </header>
      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 order-md-2">
              <div ref={receiptRef} className="receipt-container">
                {selectedProperty && (
                  <Card>
                    <Card.Header>
                      <h2>تفاصيل العقار المختار</h2>
                    </Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          العقار: {selectedProperty.property}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          المبلغ: {selectedProperty.rentalAmount}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          المبلغ المدفوع: {selectedProperty.paidAmount}
                        </ListGroup.Item>
                      </ListGroup>

                      <Form>
                        <Form.Group controlId="paidAmount">
                          <Form.Label>المبلغ المدفوع:</Form.Label>
                          <Form.Control
                            type="number"
                            step="0.01"
                            value={paidAmount}
                            onChange={handlePaidAmountChange}
                          />
                        </Form.Group>

                        <Form.Group className="check-box">
                          <Form.Label>اختر طريقة الدفع:</Form.Label>
                          <Form.Check
                            type="radio"
                            label="شهري"
                            checked={selectedPaymentMethod === 'monthly'}
                            onChange={() =>
                              handlePaymentMethodChange('monthly')
                            }
                          />
                          <Form.Check
                            type="radio"
                            label="سداسي"
                            checked={selectedPaymentMethod === 'semiAnnual'}
                            onChange={() =>
                              handlePaymentMethodChange('semiAnnual')
                            }
                          />
                          <Form.Check
                            type="radio"
                            label="ثلاثي"
                            checked={selectedPaymentMethod === 'quarterly'}
                            onChange={() =>
                              handlePaymentMethodChange('quarterly')
                            }
                          />
                        </Form.Group>

                        <Button variant="primary" onClick={handleSavePayment}>
                          حفظ
                        </Button>
                        <Button variant="secondary" onClick={handlePrint}>
                          طباعة
                        </Button>
                      </Form>

                      {installments.length > 0 && (
                        <div className="installments-container">
                          <h2>الأقساط</h2>
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>الدفعة</th>
                                <th>المبلغ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {installments.map((installment, index) => (
                                <tr key={index}>
                                  <td>{installment.period}</td>
                                  <td>{installment.amount}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}
              </div>
            </div>
            <div className="col-md-6 order-md-1">
              <div className="properties-list">
                <h2>العقارات الشاغرة</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>العقار</th>
                      <th>المبلغ</th>
                      <th>المبلغ المدفوع</th>
                      <th>اختيار</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacantProperties.map((property) => (
                      <tr key={property.id}>
                        <td>{property.property}</td>
                        <td>{property.rentalAmount}</td>
                        <td>{property.paidAmount}</td>
                        <td>
                          <Button
                            variant="info"
                            onClick={() => handlePropertySelect(property)}
                          >
                            اختيار
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacantProperties;
