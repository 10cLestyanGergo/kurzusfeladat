const apiUrl = "https://vvri.pythonanywhere.com/api/courses";
const studentApiUrl = "https://vvri.pythonanywhere.com/api/students";

function toggleSection(sectionType) {
    document.getElementById('courses').className = sectionType === 'courses' ? 'visible' : 'hidden';
    document.getElementById('students').className = sectionType === 'students' ? 'visible' : 'hidden';
}

function displayCourseForm() {
    document.getElementById('courseForm').innerHTML = `
        <input type="text" id="courseInputName" placeholder="Kurzus név">
        <button onclick="addCourse()">Létrehozás</button>
    `;
    document.getElementById('courseForm').className = 'visible';
}

function displayStudentForm() {
    document.getElementById('studentForm').innerHTML = `
        <input type="text" id="studentInputName" placeholder="Diák név">
        <button onclick="addStudent()">Létrehozás</button>
    `;
    document.getElementById('studentForm').className = 'visible';
}

function addCourse() {
    const courseName = document.getElementById('courseInputName').value;
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: courseName })
    })
    .then(response => response.json())
    .then(() => {
        fetchCourses();
        document.getElementById('courseForm').className = 'hidden';
        document.getElementById('courseInputName').value = '';
    });
}

function addStudent() {
    const studentName = document.getElementById('studentInputName').value;
    fetch(studentApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: studentName })
    })
    .then(response => response.json())
    .then(() => {
        fetchStudents();
        document.getElementById('studentForm').className = 'hidden';
        document.getElementById('studentInputName').value = '';
    });
}

function fetchCourses() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const courseContainer = document.getElementById('courseList');
            courseContainer.innerHTML = data.map(course => `
                <div>
                    <h3>${course.name}</h3>
                    <button onclick="editCourseForm('${course.id}', '${course.name}')">Szerkesztés</button>
                    <button onclick="removeCourse('${course.id}')">Törlés</button>
                </div>
            `).join('');
        });
}

function fetchStudents() {
    fetch(studentApiUrl)
        .then(response => response.json())
        .then(data => {
            const studentContainer = document.getElementById('studentList');
            studentContainer.innerHTML = data.map(student => `
                <div>
                    <h3>${student.name}</h3>
                    <button onclick="editStudentForm('${student.id}', '${student.name}')">Szerkesztés</button>
                    <button onclick="removeStudent('${student.id}')">Törlés</button>
                </div>
            `).join('');
        });
}

function editCourseForm(id, name) {
    document.getElementById('courseForm').innerHTML = `
        <input type="text" id="updateCourseName" value="${name}">
        <button onclick="updateCourse('${id}')">Mentés</button>
    `;
    document.getElementById('courseForm').className = 'visible';
}

function editStudentForm(id, name) {
    document.getElementById('studentForm').innerHTML = `
        <input type="text" id="updateStudentName" value="${name}">
        <button onclick="updateStudent('${id}')">Mentés</button>
    `;
    document.getElementById('studentForm').className = 'visible';
}

function updateCourse(id) {
    const updatedCourseName = document.getElementById('updateCourseName').value;
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedCourseName })
    })
    .then(response => response.json())
    .then(() => {
        fetchCourses();
        document.getElementById('courseForm').className = 'hidden';
        document.getElementById('updateCourseName').value = '';
    });
}

function updateStudent(id) {
    const updatedStudentName = document.getElementById('updateStudentName').value;
    fetch(`${studentApiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedStudentName })
    })
    .then(response => response.json())
    .then(() => {
        fetchStudents();
        document.getElementById('studentForm').className = 'hidden';
        document.getElementById('updateStudentName').value = '';
    });
}

function removeCourse(id) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(() => fetchCourses());
}

function removeStudent(id) {
    fetch(`${studentApiUrl}/${id}`, { method: 'DELETE' })
        .then(() => fetchStudents());
}

// Betöltjük a kezdeti adatokat
window.onload = () => {
    fetchCourses();
    fetchStudents();
};
