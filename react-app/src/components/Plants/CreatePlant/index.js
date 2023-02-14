import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { createPlantThunk } from "../../../store/plants";
import "./CreatePlant.css";

function CreatePlantModal() {
	const dispatch = useDispatch();
	const history = useHistory();
	const { closeModal } = useModal();
	const [errors, setErrors] = useState([]);

	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [details, setDetails] = useState("");
	const [preview_image_url, setPreview_image_url] = useState("");
    const user_id = useSelector((state) => state.session.user.id)

    let newPlantId;


	const handleSubmit = async(e) => {
		e.preventDefault();
		setErrors([]);
		const newPlant = {
			name,
            price,
            details,
            preview_image_url,
            user_id
		};


		const plant = await dispatch(createPlantThunk(newPlant))
			// .then((res) => {console.log("THIS IS THE FIRST ONE"); console.log(res); history.push(`/plants/${res.id}`)})

			// .then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.errors) setErrors(data.errors);
			});
            newPlantId = plant.id
            history.push(`/plants/${plant.id}`)
            closeModal()
	};

	return (
		<div className="add-spot-container">
			
			<div className="close-modal">
				<button onClick={closeModal}>
					<i className = "fa-solid fa-xmark" />
				</button>
			</div>

			<div className="add-spot-header">
				<h1>Create a plant</h1>
			</div>



			<form className="add-spot-form" onSubmit={handleSubmit}>
				<div className="add-spot-form-parts">
					<label className="add-spot-form-label">
						Name: 
						<input
						className = "add-spot-form-input"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</label>

					<label className="add-spot-form-label">
						Price: 
						<input
						className = "add-spot-form-input"
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
					</label>

					<label className="add-spot-form-label">
						Details: 
						<input
						className = "add-spot-form-input"
							type="text"
							value={details}
							onChange={(e) => setDetails(e.target.value)}
						/>
					</label>


					<label className="add-spot-form-label">
						Preview Image URL: 
						<input
						className = "add-spot-form-input"
							type="text"
							value={preview_image_url}
							onChange={(e) => setPreview_image_url(e.target.value)}
						/>
					</label>

			<div className="add-spot-errors">
				<ul className="errors">
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
			</div>
                    <div className = "submitBtn">
					<button type="submit">
						Create Plant
					</button>
                    </div>
				</div>
			</form>
		</div>
	);
}

export default CreatePlantModal;