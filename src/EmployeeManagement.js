import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Card } from 'react-bootstrap';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([
    { name: "鈴木", store: "" },
    { name: "府間", store: "" },
    { name: "後郷", store: "" },
    { name: "工藤", store: "" },
    { name: "篠塚", store: "" },
    { name: "大野", store: "" },
    { name: "椎名", store: "" },
    { name: "増田", store: "" },
    { name: "岩田", store: "" },
    { name: "木村", store: "" },
    { name: "五十嵐", store: "" },
    { name: "林", store: "" },
    { name: "長島", store: "" },
    { name: "角田", store: "" }
  ]);
  const [employeeName, setEmployeeName] = useState('');
  const [selectedStore, setSelectedStore] = useState('');

  const [stores, setStores] = useState([
    "鹿嶋店",
    "旭店",
    "銚子店",
    "松尾店"
  ]);
  const [storeName, setStoreName] = useState('');

  // ローカルストレージから従業員と店舗を読み込む
  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    const storedEmployees = JSON.parse(localStorage.getItem('employees'));
    if (storedEmployees) {
      setEmployees(storedEmployees);
    }
    const storedStores = JSON.parse(localStorage.getItem('stores'));
    if (storedStores) {
      setStores(storedStores);
    }
    // ローカルストレージから読み込んだ後、または初期値設定後にselectedStoreを初期化
    if (stores.length > 0) {
      setSelectedStore(stores[0]); // 最初の店舗をデフォルトで選択
    }
  }, []);

  // 従業員と店舗が変更されたらローカルストレージに保存する
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('stores', JSON.stringify(stores));
  }, [stores]);

  // 従業員を追加する関数
  const handleAddEmployee = () => {
    if (employeeName.trim() !== '' && selectedStore !== '') {
      setEmployees([...employees, { name: employeeName.trim(), store: selectedStore }]);
      setEmployeeName('');
    }
  };

  // 従業員を削除する関数
  const handleDeleteEmployee = (index) => {
    const newEmployees = employees.filter((_, i) => i !== index);
    setEmployees(newEmployees);
  };

  // 店舗を追加する関数
  const handleAddStore = () => {
    if (storeName.trim() !== '') {
      setStores([...stores, storeName.trim()]);
      setStoreName('');
      if (selectedStore === '') { // まだ店舗が選択されていない場合、追加した店舗を選択
        setSelectedStore(storeName.trim());
      }
    }
  };

  // 店舗を削除する関数
  const handleDeleteStore = (index) => {
    const newStores = stores.filter((_, i) => i !== index);
    setStores(newStores);
    // 削除した店舗が選択されていた場合、選択をリセットまたは別の店舗を選択
    if (selectedStore === stores[index]) {
      setSelectedStore(newStores.length > 0 ? newStores[0] : '');
    }
    // 削除された店舗に紐づく従業員の店舗情報をクリア
    setEmployees(employees.map(emp => 
      emp.store === stores[index] ? { ...emp, store: '' } : emp
    ));
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={10}>
          <Card>
            <Card.Header as="h2" className="text-center">従業員・店舗管理</Card.Header>
            <Card.Body>
              {/* 店舗管理セクション */}
              <h3 className="mb-3">店舗管理</h3>
              <Form className="mb-3">
                <Form.Group className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="店舗名を入力"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddStore();
                      }
                    }}
                  />
                  <Button variant="success" onClick={handleAddStore} className="ms-2">
                    店舗追加
                  </Button>
                </Form.Group>
              </Form>
              <ListGroup className="mb-4">
                {stores.length === 0 ? (
                  <ListGroup.Item>店舗が登録されていません。</ListGroup.Item>
                ) : (
                  stores.map((store, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      {store}
                      <Button variant="danger" size="sm" onClick={() => handleDeleteStore(index)}>
                        削除
                      </Button>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>

              {/* 従業員管理セクション */}
              <h3 className="mb-3">従業員管理</h3>
              <Form className="mb-3">
                <Row>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="従業員名を入力"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEmployee();
                        }
                      }}
                    />
                  </Col>
                  <Col>
                    <Form.Select
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value)}
                      disabled={stores.length === 0} // 店舗がない場合は選択不可
                    >
                      {stores.length === 0 ? (
                        <option value="">店舗を登録してください</option>
                      ) : (
                        <>
                          <option value="">店舗を選択</option>
                          {stores.map((store, index) => (
                            <option key={index} value={store}>
                              {store}
                            </option>
                          ))}
                        </>
                      )}
                    </Form.Select>
                  </Col>
                  <Col xs="auto">
                    <Button variant="primary" onClick={handleAddEmployee} disabled={stores.length === 0}>
                      従業員追加
                    </Button>
                  </Col>
                </Row>
              </Form>
              <ListGroup>
                {employees.length === 0 ? (
                  <ListGroup.Item>スタッフが登録されていません。</ListGroup.Item>
                ) : (
                  employees.map((employee, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      {employee.name} ({employee.store || '未設定'})
                      <Button variant="danger" size="sm" onClick={() => handleDeleteEmployee(index)}>
                        削除
                      </Button>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EmployeeManagement;
