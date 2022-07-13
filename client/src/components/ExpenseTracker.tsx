import React, { FormEvent, useRef, useEffect, useState } from "react";
import IItems from "../models/IItems";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getItems, addItem } from "../services/Items";
import { Button, Container, Modal, Form } from "react-bootstrap";
const ExpenseTracker = () => {
  const [items, setItems] = useState<IItems[]>([] as IItems[]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getItems();
        setItems(items);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const totalPayee = (payeeName: string) => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].payeeName === payeeName) {
        total += items[i].price;
      }
    }
    return total;
  };

  const payeeNameRef = useRef<HTMLSelectElement>(null);
  const productRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const addExpense = async (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    const expense = {
      payeeName: payeeNameRef?.current?.value as string,
      product: productRef?.current?.value as string,
      price: parseFloat(priceRef?.current?.value as string) as number,
      setDate: new Date().toISOString().substring(0, 10) as string,
    } as Omit<IItems, "id">;

    const updateItem = await addItem(expense);
    setItems([...items, updateItem]);
    console.log(expense);

    handleClose();
  };
  const monthRef = useRef<HTMLSelectElement>(null);
  const handleSelectChange = () => {
    setSelectedMonth(monthRef?.current?.value as string);
    console.log(selectedMonth);
  };

  return (
    <Container className="my-4">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add an expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addExpense}>
            <Form.Group className="mb-3" controlId="payeeName">
              <Form.Label>Who paid?</Form.Label>
              <Form.Control
                as="select"
                required
                aria-label="Payee name"
                ref={payeeNameRef}
              >
                <option value="">-- Select payee --</option>
                <option value="Rahul">Rahul</option>
                <option value="Ramesh">Ramesh</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="product">
              <Form.Label>For what?</Form.Label>
              <Form.Control ref={productRef} type="text" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="price">
              <Form.Label>How much?</Form.Label>
              <Form.Control ref={priceRef} type="number" min="0" required />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Add expense
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <div>
        <Row>
          <Col xs={{ order: "first" }}>
            <h1>Expense Tracker</h1>
          </Col>
          {/* <Col xs={{ order: "last" }}>
            <Form.Group className="mb-3" controlId="payeeName">
              <Form.Control
                as="select"
                required
                aria-label="Payee name"
                ref={monthRef}
                value={selectedMonth}
                onChange={handleSelectChange}
              >
                <option value="">-- Select Month --</option>
                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
              </Form.Control>
            </Form.Group>
          </Col> */}
          <Col xs={{ order: "last" }}>
            <Button
              variant="primary"
              className="float-end"
              onClick={handleShow}
            >
              Add Expense
            </Button>
          </Col>
        </Row>
        {/* <h1>
          Expense Tracker
          <Button variant="primary" className="float-end" onClick={handleShow}>
            Add Expense
          </Button>
        </h1> */}
      </div>

      <hr></hr>
      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}

      {!loading && error && <Alert variant="danger">{error.message}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Product</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.payeeName}</td>
                <td>{item.product}</td>
                <td>{item.price}</td>
                <td>{item.setDate}</td>
              </tr>
            ))}

            <tr>
              <td colSpan={4} className="text-end">
                Rahul Paid
              </td>
              <td className="font-monospace text-end">{totalPayee("Rahul")}</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-end">
                Ramesh Paid
              </td>
              <td className="font-monospace text-end">
                {totalPayee("Ramesh")}
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ExpenseTracker;
