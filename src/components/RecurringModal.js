import {
  Button,
  Col,
  Divider,
  Modal,
  Row,
  TimePicker,
  Form,
  Checkbox,
  Empty,
} from "antd";
import React, { useEffect, useState } from "react";
import Calendar from "rc-year-calendar";
import uniqid from "uniqid";
import moment from "moment";
import {
  DeleteFilled,
  DeleteOutlined,
  CopyOutlined,
  PlusOutlined,
  UndoOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import CopyTimeModal from "./CopyTimeModal";

const RecurringModal = ({
  isModalVisible,
  setIsModalVisible,
  currentLang,
  setCustomDates,
  customDates,
}) => {
  const [dateSource, setDataSource] = useState([]);
  const [test, setTest] = useState();
  const [dateArrayCal, setDateArrayCal] = useState(null);
  const [showAddTime, setShowAddTime] = useState(false);
  const [updateAllTime, setUpdateAllTime] = useState(false);
  const [copyModal, setCopyModal] = useState(false);
  const [selectedDateId, setSelectedDateId] = useState("-100");
  const [selectedCopyTime, setSelectedCopyTime] = useState();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const obj = {
      startTime: moment(values.startTimeCustom).format("hh:mm a"),
      endTime:
        values.endTimeCustom && moment(values.endTimeCustom).format("hh:mm a"),
      start: moment(values.startTimeCustom).format("HH:mm"),
      end: values.endTimeCustom && moment(values.endTimeCustom).format("HH:mm"),
    };

    if (updateAllTime) {
      setDataSource(dateSource.map((item) => ({ ...item, time: item.time?[...item.time, obj].sort((a,b)=>a.startTime.localeCompare(b.startTime)):[obj] })));
    } else
      setDataSource(
        dateSource.map((item) => {
          if (selectedDateId === item.id) {
            if (item.time) item.time = [...item.time, obj].sort((a,b)=>a.start.localeCompare(b.start));
            else item.time = [obj];
          }
          return item;
        })
      );
    form.resetFields();
    setShowAddTime(false);
    setSelectedDateId("-100");

    setUpdateAllTime(false);
  };

  useEffect(() => {
    const d = new Date();
    let name = d.getMonth();
    const el1 = document.querySelector(`[data-month-id="${name}"]`);
    if (el1) el1.scrollIntoView();
    setDataSource(customDates);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible]);

  const handleOk = () => {
    setCustomDates(dateSource);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setDataSource([]);
    setIsModalVisible(false);
  };

  // const selectDate = (e) => {
  //   console.log(e);
  //   const eventObj = {
  //     id: uniqid(),
  //     name: "test name",
  //     location: "test Location",
  //     startDate: new Date(
  //       moment(e.startDate.toLocaleDateString()).format("YYYY,M,D")
  //     ),
  //     endDate: new Date(
  //       moment(e.endDate.toLocaleDateString()).format("YYYY,M,DD")
  //     ),
  //   };
  //   setDataSource([...dateSource, eventObj]);
  // };

  useEffect(() => {
    if (test) {
      if (dateSource.find((item) => item.initDate === test.initDate))
      {setDataSource(
        dateSource.map((item) => {
          if (item.initDate === test.initDate) item.isDeleted?item.isDeleted = false: item.isDeleted = true;
          
          return item;
        })
      );
    }
      else setDataSource([...dateSource, test].sort((a, b) => b.startDate < a.startDate ? 1: -1));
      setTest(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test]);

  useEffect(() => {
    if(dateArrayCal)
    {
    if (dateArrayCal.length>1) {
      const checkDateExisting=dateSource.map(item=>item.initDate)
      const newCopyArray = dateArrayCal.filter((item) => 
         !checkDateExisting.includes(item.initDate)
        
      );
      
        const iterated=[...dateSource,[].concat.apply([], newCopyArray)];
      setDataSource([].concat.apply([], iterated).sort((a, b) => b.startDate < a.startDate ? 1: -1));
    }
    setDateArrayCal(null)
  }
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateArrayCal]);

  const deleteEvent = (event) => {
    setDataSource(
      dateSource.map((item) => {
        if (event.id === item.id) item.isDeleted = true;
        return item;
      })
    );
  };
  const deleteEventPermenent = (event) => {
    setDataSource(
      dateSource.filter((item) => event.id !== item.id)
    );
  };
  const redoEvent = (event) => {
    setDataSource(
      dateSource.map((item) => {
        if (event.id === item.id) item.isDeleted = false;
        return item;
      })
    );
  };

  const copyEvents = (event) => {
    setSelectedCopyTime(event);
    setCopyModal(true);
  };

  const onChangeCheckbox = (e) => {
    if (e.target.checked) setUpdateAllTime(true);
    else setUpdateAllTime(false);
  };

  const deleteTime = (event,start) => {
    setDataSource(
      dateSource.map((item) => {
        const obj={
          ...item,time:event.id === item.id?item.time.filter(eventTime=> eventTime.startTime !== start):item.time
        }
        
        return obj;
      })
    );
  };

  const getNumberOfDays = async (start, end) => {
    let date = [];

    for (var m = moment(start); m.isSameOrBefore(end); m.add(1, "days")) {
      date.push(m.format("DD/MM/YYYY"));
    }
    console.log(date)
    return date;
    
  };
  return (
    <Modal
      title="Custom Recurring Events"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="recurring-modal"
      okText="Done"
    >
      <Row>
        <Col>
          <Calendar
            className="recurring-cal"
            language="fr"
            minDate={new Date()}
            enableRangeSelection={true}
            //  onRangeSelected={e =>selectDate(e) }
            onRangeSelected={async(e) => {
             const dateLength=await getNumberOfDays( e.startDate,e.endDate)
             
             if(dateLength && dateLength.length>1)
              {
                const dateArray=dateLength.map(item=>{
                  const date = moment(item, 'DD/MM/YYYY')
                  console.log(new Date(date.format('YYYY,M,D')).toLocaleDateString(),
                  moment(new Date(date.format('YYYY,M,D')).toLocaleDateString()).format(
                    "MMM,DD,YYYY"
                  ))
                  const obj = {
                    id: uniqid(),
                    name: "test name",
                    location: "test Location",
                    startDate: new Date(date.format('YYYY,M,D')),
                    endDate: new Date(date.format('YYYY,M,D')),
                    initDate: moment(date).format("YYYY-MM-DD") ,
                    isDeleted: false,
                  };
                  return obj;
                })
                setDateArrayCal(dateArray)
              }
              else
              {
                const obj={
                  id: uniqid(),
                name: "test name",
                location: "test Location",
                startDate: e.startDate,
                endDate: e.endDate,
                initDate: moment(e.startDate).format("YYYY-MM-DD") ,
                isDeleted: false,
              };
              setTest(obj);
              }
            
            }}
            dataSource={dateSource.filter(item=>!item.isDeleted)}
          />
        </Col>
        <Col flex="auto" className="custom-date-column">
          <div className="custom-time-layout">
            <div className="custom-no-of-date">{dateSource.length} dates</div>
            <div>{dateSource.filter((item) => item.time).length} times</div>
          </div>
          <Divider />
          <div>
            {dateSource.map((item) => (
              <div key={item.id}>
                <div className="custom-time-layout">
                  <div
                    className={
                      item.isDeleted
                        ? "deleted-text custom-no-of-date"
                        : "custom-no-of-date"
                    }
                  >
                    {/* { moment(item.startDate).tz("Canada/Eastern").format("dddd")} */}
                    {moment(item.startDate).format(
                      "dddd DD MMM YYYY"
                    )}
                  </div>
                  <div className="crud-icons">
                    {item.isDeleted ? (
                      <UndoOutlined onClick={() => redoEvent(item)} />
                    ) : (
                      <CopyOutlined onClick={() => {if(item.time && item.time.length>0)copyEvents(item)}} />
                    )}
                    {item.isDeleted ? 
                    <DeleteFilled onClick={() => deleteEventPermenent(item)} />
                    :
                    <DeleteOutlined onClick={() => deleteEvent(item)} />}
                  </div>
                </div>

                {!item.isDeleted &&
                  item.time &&
                  item.time.map((customTime) => (
                    <div
                      className="custom-time-layout"
                      style={{ margin: "9px" }}
                    >
                      <div>
                        {customTime.startTime && customTime.startTime} {customTime.endTime?" - ":""}
                        {customTime.endTime && customTime.endTime}{" "}
                      </div>
                      <div>
                        <CloseOutlined
                          className="close-time"
                          onClick={() => deleteTime(item,customTime.startTime)}
                        />{" "}
                      </div>
                    </div>
                  ))}
                {!item.isDeleted && selectedDateId !== item.id && (
                  <div className="add-time-btn">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setShowAddTime(true);
                        setSelectedDateId(item.id);
                      }}
                    >
                      <PlusOutlined />
                      Add Time
                    </span>
                  </div>
                )}
                {!item.isDeleted && showAddTime && selectedDateId === item.id && (
                  <Form
                    form={form}
                    layout="vertical"
                    className="update-status-form"
                    data-testid="status-update-form"
                    onFinish={handleSubmit}
                  >
                    <div className="flex-align" style={{ marginTop: "15px" }}>
                      <div className="date-div">
                        <div className="update-select-title">
                          {t("StartTime", { lng: currentLang })}
                        </div>
                        <Form.Item
                          name="startTimeCustom"
                          className="status-comment-item"
                          rules={[
                            { required: true, message: "Start time required" },
                          ]}
                        >
                          <TimePicker
                            format="HH:mm"
                            popupClassName="recurring-time-picker"
                            // onSelect={(value) => {
                            //   form.setFieldsValue({
                            //     startTimeCustom: value,
                            //   });
                            // }}
                          />
                        </Form.Item>
                      </div>
                      <div className="date-div">
                        <div className="update-select-title ">
                          {t("EndTime", { lng: currentLang })}
                        </div>
                        <Form.Item
                          name="endTimeCustom"
                          className="status-comment-item"
                          rules={[
                            { required: false, message: "End time required" },
                          ]}
                        >
                          <TimePicker
                            format="HH:mm"
                            popupClassName="recurring-time-picker"
                            // onSelect={(value) => {
                            //   form.setFieldsValue({
                            //     endTimeCustom: value,
                            //   });
                            // }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="flex-align">
                      <Checkbox
                        onChange={onChangeCheckbox}
                        className="check-time"
                        checked={updateAllTime}
                      >
                        Add this time to all dates
                      </Checkbox>
                      <div>
                        <Form.Item className="add-time-items">
                          <Button
                            size="large"
                            onClick={() => {
                              form.resetFields();
                              setShowAddTime(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="primary" htmlType="submit" size="large">
                            Add
                          </Button>
                        </Form.Item>
                      </div>
                    </div>
                  </Form>
                )}
                <Divider />
              </div>
            ))}
            {dateSource.length === 0 && (
              <Empty description={"No date selected"} />
            )}
          </div>
        </Col>
      </Row>
      <CopyTimeModal
        isModalVisible={copyModal}
        setIsModalVisible={setCopyModal}
        currentLang={currentLang}
        recurringEvents={dateSource}
        copyTime={selectedCopyTime}
        updateTime={setDataSource}
      />
    </Modal>
  );
};

export default RecurringModal;
