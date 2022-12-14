import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import AuthorItem from './components/AuthorItem/AuthorItem';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import getCourseDuration from '../../helpers/getCourseDuration';
// import { mockedAuthorsList, mockedCoursesList } from '../../constants'; // using authorsList and courses instead
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthors, getCourses } from '../../selectors';
import { addAuthorsAction } from '../../store/authors/actions';
import { addCoursesAction } from '../../store/courses/actions';
import useFetch from './../../helpers/useFetch';

import { AUTHORADD, COURSEADD } from '../../constants';
import { GetAllAuthors } from './../../store/authors/thunk';

const dayjs = require('dayjs');
var duration = require('dayjs/plugin/duration');
dayjs.extend(duration);
function CourseForm({
	authorList,
	setAuthorsList,
	addNewCourseClick,
	setCourseList,
	// courseList,
}) {
	const courses = useSelector(getCourses);
	const authorsList = useSelector(getAuthors);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [title, setTitle] = Input({
		labelText: 'Title',
		id: 'title123',
		placeholder: 'Enter Title...',
		labelClass: 'd-block pb-1',
		class: 'd-block border-warning',
		name: 'title',
	});
	let [authorname, setAuthorName, setValue] = Input({
		labelText: 'Author Name',
		id: 'authorname123',
		placeholder: 'Enter Author Name...',
		labelClass: 'd-block pb-1 text-start',
		class: 'd-block border-warning w-100 mb-3',
		name: 'addauthor',
		min: 2,
	});
	const [duration, setDurationValue] = Input({
		labelText: 'Duration',
		id: 'duration123',
		placeholder: 'Enter duration in minutes...',
		labelClass: 'd-block pb-1',
		class: 'd-block border-warning w-100 mb-3',
		type: 'number',
		name: 'duration',
	});
	const [addAuthorsList, updateaddAuthorsList] = useState([]);
	const [courseAuthorsList, updatecourseAuthorsList] = useState([]);
	const [description, setDescription] = useState('');
	const [courseList, updateCourseList] = useState(courses);
	const { request, data, error } = useFetch();
	let token = localStorage.getItem('token');

	useEffect(() => {
		dispatch(GetAllAuthors());
	}, []);

	useEffect(() => {
		updateaddAuthorsList([...authorsList]);
	}, [authorsList]);

	function randomStr(list) {
		let id = uuidv4();
		let findId = list.findIndex((x) => x.id.toString() === id);
		if (findId === -1) {
			return id;
		} else {
			randomStr(list);
		}
	}

	function CreateAuthor(val) {
		const newAuthor = {
			name: val,
			id: randomStr(addAuthorsList),
		};
		// updateaddAuthorsList((oldArray) => [newAuthor, ...oldArray]);
		// setAuthorsList(newAuthor);
		setValue('');
		// mockedAuthorsList.unshift(newAuthor);
		// dispatch(addAuthorsAction(newAuthor));
		request
			.post(AUTHORADD, newAuthor, token)
			.then((res) => {
				dispatch(GetAllAuthors());
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function createNewCourse() {
		let newCourse = {
			id: randomStr(courseList),
			title: title,
			description: description,
			creationDate: dayjs().format('DD/MM/YYYY'),
			duration: Number(duration),
			authors: courseAuthorsList.map((x) => x.id),
		};
		// updateCourseList((oldArray) => [newCourse, ...oldArray]);
		// updateaddAuthorsList(authorList);
		// addNewCourseClick();
		// mockedCoursesList.unshift(newCourse);
		// dispatch(addCoursesAction(newCourse));
		request
			.post(COURSEADD, newCourse, token)
			.then((res) => {
				navigate('/courses');
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function updateAuthorList(val, type) {
		if (type === 1) {
			// add to course list
			updateList(
				val,
				addAuthorsList,
				updatecourseAuthorsList,
				updateaddAuthorsList
			);
		} else {
			// delete from course author list
			updateList(
				val,
				courseAuthorsList,
				updateaddAuthorsList,
				updatecourseAuthorsList
			);
		}
	}

	function updateList(val, list, addToState, deleteFromState) {
		let findIndex = list.findIndex((x) => x.id.toString() === val.id);
		let splicedObject;
		if (findIndex !== -1) {
			splicedObject = list.splice(findIndex, 1);
			addToState((oldArray) => [splicedObject[0], ...oldArray]);
			deleteFromState(list);
		} else {
			addToState((oldArray) => [val, ...oldArray]);
		}
	}

	function checkAllFields() {
		return (
			!title ||
			!duration ||
			courseAuthorsList.length === 0 ||
			description.length < 2
		);
	}

	return (
		<div>
			{/* <Input
				labelText='Title'
				id='title123'
				placeholder='Enter Title...'
				labelClass='d-block pb-1'
				class='d-block border-warning'
				name='title'
			/> */}
			{setTitle}
			<label className='d-block pt-2 pb-1'>Description</label>
			<textarea
				className='w-100 border-warning'
				minLength='2'
				placeholder='Enter Description'
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			></textarea>
			<Button
				name='Create Course'
				class='btn btn-info bg-transparent position-absolute create-course-btn'
				click={() => createNewCourse()}
				disabled={checkAllFields()}
			></Button>
			<section className='author-section border border-dark rounded mt-2'>
				<div className='row'>
					<div className='col'>
						<div className='create-author-sec p-3 text-center'>
							<h4 className='pb-2'>Add Author</h4>
							{/* <Input
						labelText='Author Name'
						id='authorname123'
						placeholder='Enter Author Name...'
						labelClass='d-block pb-1 text-start'
						class='d-block border-warning w-100 mb-3'
						name='addauthor'
						value={authorname}
						onChange={(e) => setAuthorName(e.target.value)}
					/> */}
							{setAuthorName}
							<Button
								name='Create Author'
								class='btn btn-info bg-transparent create-course-btn'
								click={() => CreateAuthor(authorname)}
								disabled={authorname.length < 2}
							></Button>
						</div>
						<div className='duration-sec p-3'>
							<h4 className='text-center pb-2'>Duration</h4>
							{/* <Input
						labelText='Duration'
						id='duration123'
						placeholder='Enter duration in minutes...'
						labelClass='d-block pb-1'
						class='d-block border-warning w-100 mb-3'
						type='number'
						name='duration'
						value={duration}
						onChange={(e) => setDurationValue(e.target.value)}
					/> */}
							{setDurationValue}
							<span className='fs-25'>
								Duration:{' '}
								<span className='bold fs-40'>
									{getCourseDuration(duration).hr}:
									{getCourseDuration(duration).min}
								</span>{' '}
								{getCourseDuration(duration).hrLabel}
							</span>
						</div>
					</div>
					<div className='col'>
						{/* <div className='author-list'> */}
						<AuthorItem
							title='Authors'
							authorList={addAuthorsList}
							updateAuthorList={(e) => updateAuthorList(e, 1)}
							buttonTitle='Add Author'
						></AuthorItem>
						{/* </div> */}
						{/* <div className='course-author-sec'> */}
						<AuthorItem
							title='Course Authors'
							authorList={courseAuthorsList}
							updateAuthorList={(e) => updateAuthorList(e, 2)}
							buttonTitle='Delete Author'
						></AuthorItem>
						{/* </div> */}
					</div>
				</div>
			</section>
		</div>
	);
}

export default CourseForm;
