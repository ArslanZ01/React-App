import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

const DashBoard = () => {
    const[id, setId] = useState('');
    const[name, setName] = useState('');
    const[location, setLocation] = useState('');
    const[type, setType] = useState('local');
    const[locations, setLocations] = useState({});
    const[isLoading, setIsLoading] = useState(false);
    const[error, setError] = useState(null);

    let navigate = useNavigate ();

    const getAuthentication = () => {
        axios.get('http://localhost:3030/Authenticate-User', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
            .then(r => {
                if (!r.data.role)
                    navigate('/Log-In');
            })
            .catch(e => {
                console.log(e);
            })
    }

    const getLocations = () => {
        axios.get('http://localhost:3030/Get-Locations', {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
            .then(r => {
                if (r.data.error)
                    throw Error(r.data.message);
                if (r.statusText != 'OK')
                    throw Error(r.statusText);
                setLocations(r.data.locations);
            })
            .catch(e => {
                console.log(e);
            })
    }

    const openModal = (operation, i, n, l, t, e) => {
        setError(null);
        if (operation == 'add') {
            setId('');
            setName('');
            setLocation('');
            setType('local');
        }
        else if (operation == 'update') {
            setId(i);
            setName(n);
            setLocation(l);
            setType(t);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        let manage_url = '';
        if (id == '')
            manage_url = 'http://localhost:3030/Add-Location'+'?name='+name+'&location='+location+'&type='+type;
        else
            manage_url = 'http://localhost:3030/Update-Location'+'?_id='+id+'&name='+name+'&location='+location+'&type='+type;
        setTimeout(() => {
            axios.get(manage_url, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
                .then((r) => {
                    console.log(r);
                    setIsLoading(false);
                    if (r.data.error)
                        throw Error(r.data.message);
                    if (r.statusText != 'OK')
                        throw Error(r.statusText);
                })
                .catch((e) => {
                    setError(e.message);
                    setIsLoading(false);
                });
        }, 1);
    }

    const deleteLocation = (i, e) => {
        setTimeout(() => {
            axios.get('http://localhost:3030/Delete-Location'+'?_id='+i, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
                .then((r) => {
                    console.log(r);
                })
                .catch((e) => {
                    console.log(e);
                });
        }, 1);
    }

    const goToDebug = (l, e) => {
        setTimeout(() => {
            axios.get(l)
                .then((r) => {
                    navigate('/Debug', {state: {data: r.data}})
                })
                .catch((e) => {
                    console.log(e);
                });
        }, 1);
    }

    useEffect(() => {
        getAuthentication();
        getLocations();
    });

    return (
        <React.Fragment>
            <div className="modal fade" id="manageLocationModal" tabIndex="-1" aria-labelledby="manageLocationLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form method="get" action="http://localhost:3030/Manage-Location" onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="manageLocationLabel">Modal title</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
                            </div>
                            <div className="modal-body">
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="url-name">Name</span>
                                    <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="url-location">Location</span>
                                    <input type="text" className="form-control" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="url-type">Type</span>
                                    <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                                        <option value="local">Local</option>
                                        <option value="live">Live</option>
                                    </select>
                                </div>
                                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                {isLoading &&
                                    <button type="button" className="btn btn-dark" disabled>Loading</button>
                                }
                                {!isLoading &&
                                    <button type="submit" className="btn btn-dark">Save</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="content data-table">
                <h1>DashBoard</h1>
                <div className="container">
                    <div className="table-responsive custom-table-responsive mt-5">
                        <table className="table custom-table">
                            <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Location</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td colSpan="2">Locations</td>
                                <td>
                                    <button type="button" className="btn btn-dark" onClick={(e) => openModal('add', null, null, null, e)} data-bs-toggle="modal" data-bs-target="#manageLocationModal">Add Location</button>
                                </td>
                            </tr>
                            {locations.length > 0 && locations.map((location) => (
                                <tr key={location._id}>
                                    <td>{location.name}</td>
                                    <td>{location.location}</td>
                                    <td>
                                        <button className="btn btn-dark" onClick={(e) => deleteLocation(location._id, e )}>
                                            <i className="fas fa-trash"/>
                                        </button>
                                        <button className="btn btn-dark" onClick={(e) => openModal('update', location._id, location.name, location.location, e )} data-bs-toggle="modal" data-bs-target="#manageLocationModal">
                                            <i className="fas fa-edit"/>
                                        </button>
                                        <button className="btn btn-dark" onClick={(e) => goToDebug(location.location, e )}>
                                            <i className="fas fa-arrow-right"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default DashBoard;