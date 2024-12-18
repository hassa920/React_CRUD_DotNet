import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { ToastContainer, ToastContentProps, toast } from 'react-toastify';

export function Crud() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [isActive, setIsActive] = useState(0);
    
    const [editId, setEditId] = useState("");
    const [editName, setEditName] = useState("");
    const [editAge, setEditAge] = useState("");
    const [EditIsActive, setEditIsActive] = useState(0);
    
    // const empData = [
    //     { id: 1, name: "mark", age: 30, isActive: 1 },
    //     { id: 2, name: "Bob", age: 90, isActive: 0 },
    //     { id: 3, name: "Peter", age: 38, isActive: 1 }
    // ];

    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const handleEdit = (id) => {
        const selectedEmp = data.find(emp => emp.id === id);
        setEditId(selectedEmp.id);
        setEditName(selectedEmp.name);
        setEditAge(selectedEmp.age);
        setEditIsActive(selectedEmp.isActive);
        handleShow();
    };

    const delClick = (id) => {
        if (window.confirm("Are you sure you want to delete?")==true) {
            axios.delete(`https://localhost:7267/api/Employee/${id}`).then((result)=>{
                if(result.status==200)
                {
                    toast.success("Employee has been deleted");
                    getData();
                }
            })
        }
    };

    const getData=()=>{
        axios.get("https://localhost:7267/api/Employee")
        .then((response)=>{
            setData(response.data)
            console.log(response.data)
        }).catch((error)=>{
         console.log(error)
        })
    }

    const handlePost=()=>{
        const data={
            "name":name,
             "age":age,
             "isActive":isActive
        }
        axios.post("https://localhost:7267/api/Employee",data).then((result)=>{
             getData();
             clear();
             toast.success("Employee has been added");
        })
    }

    const clear=()=>{
        setName('');
        setAge('');
        setIsActive(0);
        setEditName('');
        setEditAge('');
        setEditIsActive(0);
        
    }
    const handleIsActive=(e)=>{
        if (e.target.checked)
        {
          setIsActive(1)
        }
        else
        {
            setIsActive(0)
        }
    }

    const handleEditIsActive=(e)=>{
        if (e.target.checked)
        {
          setIsActive(1)
        }
        else
        {
            setIsActive(0)
        }
    }

    const HandleUpdate=()=>{
        const data={
            "id":editId,
            "name":editName,
            "age":editAge,
            "isActive":EditIsActive
        }
        axios.put(`https://localhost:7267/api/Employee/${editId}`,data).then((result)=>{
            getData();
            clear();
            toast.success("Employe has been updated");

        })
    }
    return (
        <>
        <ToastContainer/>
            <Container>
                <Row style={{marginTop:"40px"}}>
                    <Col><input type='text' value={name} placeholder='Enter Name' className='form control' onChange={(e) => setName(e.target.value)} /></Col>
                    <Col><input type='text' onChange={(e) => setAge(e.target.value)} value={age} placeholder='Enter Age' className='form control' /></Col>
                    <Col>
                        <input type='checkbox' checked={isActive === 1 ? true : false} onChange={(e) => handleIsActive(e)} />
                        <label>isActive</label>
                    </Col>
                    <Col><button className='btn btn-primary' type='submit' onClick={()=>{handlePost()}}>Submit</button></Col>
                </Row>
            </Container>

            <Table style={{marginLeft:"30px"}}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>IsActive</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ? data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.age}</td>
                                <td>{item.isActive}</td>
                                <td style={{ display: "flex", gap: "10px" }}>
                                    <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Edit</button>
                                    <button className='btn btn-danger' onClick={() => delClick(item.id)}>Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4">Loading...</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col><input type='text' value={editName} placeholder='Enter Name' className='form control' onChange={(e) => setEditName(e.target.value)} /></Col>
                        <Col><input type='text' onChange={(e) => setEditAge(e.target.value)} value={editAge} placeholder='Enter Age' className='form control' /></Col>
                        <Col>
                            <input type='checkbox' checked={EditIsActive === 1 ? true : false} onChange={(e) => handleEditIsActive(e)} />
                            <label>isActive</label>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={()=>HandleUpdate()}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
