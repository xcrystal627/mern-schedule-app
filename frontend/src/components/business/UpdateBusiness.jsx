import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateBusiness, deleteBusiness } from '../../features/business/businessSlice';
import { Modal } from '../';


const UpdateBusiness = ({ business }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [updatedBusiness, setUpdatedBusiness] = useState(business);
    const dispatch = useDispatch();

    const onChange = (e) => {
        setUpdatedBusiness({
            ...updatedBusiness,
            [e.target.name]: e.target.value
        });
    }

    const onSubmit = () => {
        if(updatedBusiness.name && updatedBusiness.address && updatedBusiness.city && updatedBusiness.state && updatedBusiness.zip && updatedBusiness.type) {
            dispatch(updateBusiness(updatedBusiness));
            setIsModalOpen(false);
        } else {
            toast.error('Please fill out all fields');
        }
    }

    const onSubmitDelete = () => {
        dispatch(deleteBusiness(updatedBusiness._id));
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
    }

    return (
        <>
        <Modal
            setModalIsOpen={setIsModalOpen}
            modalIsOpen={isModalOpen}
            actionBtnText="Update"
            contentLabel={`Update ${business.name}`}
            onSubmit={onSubmit}
            actionDangerBtnText="Delete"
            onSubmitDanger={() => setIsDeleteModalOpen(true)}
        > 
            <div className="form-group-row">
                <div className="form-group">
                    <label>Name *</label>
                    <input
                        type="text"
                        placeholder="Name of business"
                        name="name"
                        value={updatedBusiness.name}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label>Type *</label>
                    <input
                        type="text"
                        placeholder="Type of business"
                        name="type"
                        value={updatedBusiness.type}
                        onChange={onChange}
                    />
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-group">
                    <label>Address *</label>
                    <input
                        type="text"
                        placeholder="Address"
                        name="address"
                        value={updatedBusiness.address}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label>City *</label>
                    <input
                        type="text"
                        placeholder="City"
                        name="city"
                        value={updatedBusiness.city}
                        onChange={onChange}
                    />
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-group">
                    <label>State *</label>
                    <input
                        type="text"
                        placeholder="State"
                        name="state"
                        value={updatedBusiness.state}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label>Zip *</label>
                    <input
                        type="text"
                        placeholder="Zip code"
                        name="zip"
                        value={updatedBusiness.zip}
                        onChange={onChange}
                    />
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        placeholder="Phone number"
                        name="phoneNumber"
                        value={updatedBusiness.phoneNumber}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label>Work Hours</label>
                    <input
                        type="text"
                        placeholder="07:00 - 17:00"
                        name="workHours"
                        value={updatedBusiness.workHours}
                        onChange={onChange}
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Position</label>
                <input
                    type="text"
                    placeholder="Enter comma separated positions (e.g. CEO, Manager, Barista, etc.)"
                    name="position"
                    value={updatedBusiness.positions.join(', ')}
                    onChange={(e) => {
                        setUpdatedBusiness({
                            ...updatedBusiness,
                            positions: e.target.value.split(', ')
                        })}
                    }
                />
            </div>
        </Modal>
        <Modal
            setModalIsOpen={setIsDeleteModalOpen}
            modalIsOpen={isDeleteModalOpen}
            contentLabel={`Are you sure, you want to delete ${business.name}?`}
        >
            <div className="form-group-row">
                <div className="form-group">
                    <div
                        className="btn btn-primary"
                        onClick={() => setIsDeleteModalOpen(false)}
                    >Cancel</div>
                </div>
                <div className="form-group">
                    <div 
                        className="btn btn-danger"
                        onClick={onSubmitDelete}
                    >Delete</div>
                </div>
            </div>
        </Modal>
        <div 
            className="btn-icon"
            onClick={() => setIsModalOpen(true)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
        </div>
        </>
    )
}

export default UpdateBusiness