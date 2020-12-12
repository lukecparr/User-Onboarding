import React, {useState, useEffect} from 'react';
import './Form.css';
import * as yup from 'yup';
import axios from 'axios'

const Form = () => {
	//state for form values
	const [formValues, setFormValues] = useState({
		name: '',
		email: '',
		password: '',
		terms: ''
	});

	//state for button disabling
	const [buttonDisabled, setButtonDisabled] = useState(true);

	//state for post
	const [post, setPost] = useState([])

	//onChange handler for input fields
	function inputChange(e) {
		e.persist(); // necessary because we're passing the event asyncronously and we need it to exist even after this function completes (which will complete before validateChange finishes)

		//changes state to field values
		setFormValues({...formValues, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value});

		//call validate change for input values
		validateChange(e);
	};

	//onSubmit function
	function formSubmit(e) {
		e.preventDefault();
		axios.post("https://reqres.in/api/users", formValues)
		.then((res) => {
			setPost(res.data);
			setFormValues({
				name: '',
				email: '',
				password: '',
				terms: ''
			})
		})
	};

	//set form schema for validation
	const formSchema = yup.object().shape({
		name: yup.string().required("Name is required"),
		email: yup.string().email(),
		password: yup.string().required("Please create a password"),
		terms: yup.boolean().oneOf([true]).required()
	});

	//state for inline error handling
	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
		terms: ''
	});

	//inline validation
	function validateChange(e) {
		yup.reach(formSchema, e.target.name)
		.validate(e.target.type === "checkbox" ? e.target.checked : e.target.value)
		.then((valid) => {setErrors({ ...errors, [e.target.name]: ""}); })
		.catch((err) => {setErrors({ ...errors, [e.target.name]: err.errors[0] }) });
	};

	useEffect(() => {
		formSchema.isValid(formValues).then((valid) => {
			setButtonDisabled(!valid)
		});
	}, [formValues])

	return (
		<form onSubmit={formSubmit}>
			<label htmlFor="name">
				Name
				<input type="text" id="name" name="name" placeholder="Name" value={formValues.name} onChange={inputChange} />
				{errors.name.length > 0 ? <p className='error'>{errors.name}</p> : null}
			</label>
			
			<label htmlFor="email">
				Email
				<input type="text" id="email" name="email" placeholder="Email" value={formValues.email} onChange={inputChange} />
				{errors.email.length > 0 ? <p className='error'>{errors.email}</p> : null}
			</label>
			
			<label htmlFor="password">
				Password
				<input type="text" id="password" name="password" placeholder="Password" value={formValues.password} onChange={inputChange} />
				{errors.password.length > 0 ? <p className='error'>{errors.password}</p> : null}
			</label>
			
			<label htmlFor="terms" className='terms'>
				<input type="checkbox" id="terms" name="terms" checked={formValues.terms} onChange={inputChange} />Terms & Conditions
				{errors.terms.length > 0 ? <p className='error'>{errors.terms}</p> : null}
			</label>

			<button type='submit' disabled={buttonDisabled}>Submit</button>
			<pre>{JSON.stringify(post, null, 2)}</pre>
		</form>
	)
};

export default Form;