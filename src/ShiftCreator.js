import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';

function ShiftCreator() {
  const [employees, setEmployees] = useState([]);
  const [stores, setStores] = useState([
    "鹿嶋店",
    "旭店",
    "銚子店",
    "松尾店"
  ]);
  const [shifts, setShifts] = useState({}); // { 'YYYY-MM-DD': { 'employeeName': 'shiftType' } }
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyHolidays, setMonthlyHolidays] = useState({}); // { 'YYYY-MM': count } 各月の休日数を保存

  // シフトタイプの略称と正式名称の対応マップ
  const shiftTypeAbbreviations = {
    "鹿嶋店": "鹿",
    "旭店": "旭",
    "銚子店": "銚",
    "松尾店": "松",
    "佐原店": "佐",
    "休み": "休",
    "有給": "有",
  };

  // ローカルストレージから従業員、店舗、シフト、月別休日を読み込む
  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees'));
    if (storedEmployees) {
      setEmployees(storedEmployees);
    }
    const storedStores = JSON.parse(localStorage.getItem('stores'));
    if (storedStores) {
      setStores(storedStores);
    }
    const storedShifts = JSON.parse(localStorage.getItem('shifts'));
    if (storedShifts) {
      setShifts(storedShifts);
    }
    const storedMonthlyHolidays = JSON.parse(localStorage.getItem('monthlyHolidays'));
    if (storedMonthlyHolidays) {
      setMonthlyHolidays(storedMonthlyHolidays);
    }
  }, []);

  // シフトと月別休日が変更されたらローカルストレージに保存する
  useEffect(() => {
    localStorage.setItem('shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('monthlyHolidays', JSON.stringify(monthlyHolidays));
  }, [monthlyHolidays]);

  // 月の日数を取得
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // 日付のフォーマット
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // シフトタイプ（店舗、休み、有給）のリスト
  const shiftTypes = [...stores, '休み', '有給'];

  // シフトを更新する関数
  const handleShiftChange = (employeeName, date, shiftType) => {
    const dateKey = formatDate(date);
    setShifts(prevShifts => ({
      ...prevShifts,
      [dateKey]: {
        ...(prevShifts[dateKey] || {}),
        [employeeName]: shiftType
      }
    }));
  };

  // 年の変更ハンドラ
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1));
  };

  // 月の変更ハンドラ
  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value) - 1; // 月は0から始まるため-1
    setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth, 1));
  };

  // 月別休日の変更ハンドラ
  const handleMonthlyHolidaysChange = (e) => {
    const monthKey = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
    const value = parseInt(e.target.value) || 0; // 数値に変換、NaNの場合は0
    setMonthlyHolidays(prev => ({
      ...prev,
      [monthKey]: value
    }));
  };

  // 年の選択肢を生成 (例: 現在の年から前後5年)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const daysInMonth = getDaysInMonth(currentMonth);
  const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1));

  // 各従業員の累計シフトを計算する関数
  const calculateEmployeeTotals = (employeeName) => {
    const totals = {};
    shiftTypes.forEach(type => totals[type] = 0);

    dates.forEach(date => {
      const dateKey = formatDate(date);
      const assignedShift = shifts[dateKey]?.[employeeName];
      if (assignedShift && shiftTypes.includes(assignedShift)) {
        totals[assignedShift]++;
      }
    });
    return totals;
  };

  // 各日の店舗別合計人数を計算する関数
  const calculateDailyStoreTotals = (date) => {
    const dateKey = formatDate(date);
    const dailyTotals = {};
    stores.forEach(store => dailyTotals[store] = 0);

    employees.forEach(employee => {
      const assignedShift = shifts[dateKey]?.[employee.name];
      if (assignedShift && stores.includes(assignedShift)) {
        dailyTotals[assignedShift]++;
      }
    });
    return dailyTotals;
  };

  // 現在の月の休日数を取得
  const currentMonthKey = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
  const currentMonthHolidayCount = monthlyHolidays[currentMonthKey] || 0;

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={12}>
          <Card>
            <Card.Header as="h2" className="text-center">シフト作成</Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <Form.Select value={currentMonth.getFullYear()} onChange={handleYearChange} className="w-auto me-2">
                  {years.map(year => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </Form.Select>
                <Form.Select value={currentMonth.getMonth() + 1} onChange={handleMonthChange} className="w-auto me-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>{month}月</option>
                  ))}
                </Form.Select>
                <Form.Group className="d-flex align-items-center ms-3">
                  <Form.Label className="me-2 mb-0">{currentMonth.getMonth() + 1}月休日:</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={currentMonthHolidayCount}
                    onChange={handleMonthlyHolidaysChange}
                    className="w-auto"
                    style={{ width: '80px' }} // 幅を調整
                  />
                </Form.Group>
              </div>

              <Table bordered responsive className="shift-table">
                <thead>
                  <tr>
                    <th>氏名</th>
                    {dates.map(date => (
                      <th key={formatDate(date)} className={`text-center ${date.getDay() === 0 ? 'sunday' : date.getDay() === 6 ? 'saturday' : ''}`}>
                        {date.getDate()}<br/>
                        {['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}
                      </th>
                    ))}
                    {shiftTypes.map(type => (
                      <th key={type} className="text-center">{shiftTypeAbbreviations[type] || type}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => {
                    const employeeTotals = calculateEmployeeTotals(employee.name);
                    return (
                      <tr key={employee.name} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                        <td>{employee.name}</td>
                        {dates.map(date => {
                          const dateKey = formatDate(date);
                          const currentShift = shifts[dateKey]?.[employee.name] || '';
                          const isSunday = date.getDay() === 0;
                          const isSaturday = date.getDay() === 6;
                          return (
                            <td key={`${employee.name}-${dateKey}`} className={isSunday ? 'sunday' : isSaturday ? 'saturday' : ''}>
                              <Form.Select
                                size="sm"
                                value={currentShift}
                                onChange={(e) => handleShiftChange(employee.name, date, e.target.value)}
                                disabled={isSunday} // 日曜日は選択不可
                              >
                                <option value="">-</option>
                                {shiftTypes.map(type => (
                                  <option key={type} value={type}>
                                    {shiftTypeAbbreviations[type] || type}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                          );
                        })}
                        {shiftTypes.map(type => (
                          <td key={`${employee.name}-total-${type}`} className="text-center">
                            {employeeTotals[type] || 0}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  {stores.filter(store => store !== '佐原店').map(store => (
                    <tr key={`total-${store}`}>
                      <td className="text-end pe-3">{shiftTypeAbbreviations[store] || store}合計:</td>
                      {dates.map(date => {
                        const dailyTotals = calculateDailyStoreTotals(date);
                        const isSunday = date.getDay() === 0;
                        const isSaturday = date.getDay() === 6;
                        return (
                          <td key={`total-${store}-${formatDate(date)}`} className={isSunday ? 'sunday' : isSaturday ? 'saturday' : ''}>
                            {dailyTotals[store] || 0}
                          </td>
                        );
                      })}
                      {/* 累計列と休日列のcolspanを調整 */}
                      <td colSpan={shiftTypes.length}></td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={1 + daysInMonth + shiftTypes.length - 1} className="text-end pe-3">{currentMonth.getMonth() + 1}月休日:</td>
                    <td className="text-center">{currentMonthHolidayCount}</td>
                  </tr>
                </tfoot>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ShiftCreator;
