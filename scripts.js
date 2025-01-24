const apiBaseUrl = 'https://vvri.pythonanywhere.com/api';

async function fetchData(type) {
  const response = await fetch(`${apiBaseUrl}/${type}`);
  return await response.json();
}

async function showCourses() {
  const courses = await fetchData('courses');
  let htmlContent = `
    <h2>Kurzusok</h2>
    <button onclick="showAddModal('course')">Új kurzus hozzáadása</button>
  `;
  courses.forEach(course => {
    htmlContent += `
      <div class="course">
        <span>${course.name}</span>
        <div>
          <button class="edit" onclick="editItem('course', ${course.id}, '${course.name}')">Szerkesztés</button>
          <button class="delete" onclick="deleteItem('course', ${course.id})">Törlés</button>
        </div>
      </div>
    `;
  });
  document.getElementById('content').innerHTML = htmlContent;
}

async function showStudents() {
  const students = await fetchData('students');
  let htmlContent = `
    <h2>Diákok</h2>
    <button onclick="showAddModal('student')">Új diák hozzáadása</button>
  `;
  students.forEach(student => {
    htmlContent += `
      <div class="student">
        <span>${student.name}</span>
        <div>
          <button class="edit" onclick="editItem('student', ${student.id}, '${student.name}')">Szerkesztés</button>
          <button class="delete" onclick="deleteItem('student', ${student.id})">Törlés</button>
        </div>
      </div>
    `;
  });
  document.getElementById('content').innerHTML = htmlContent;
}

function showAddModal(type) {
  const modal = document.getElementById('modalContext');
  modal.innerHTML = `
    <div id="addModal">
      <h3>${type === 'course' ? 'Új kurzus' : 'Új diák'} hozzáadása</h3>
      <form onsubmit="addItem(event, '${type}')">
        <label for="name">Név</label>
        <input type="text" id="name" required />
        <button type="submit">Mentés</button>
        <button type="button" onclick="closeModal()">Bezárás</button>
      </form>
    </div>
  `;
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('modalContext').style.display = 'none';
}

async function addItem(event, type) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const response = await fetch(`${apiBaseUrl}/${type}s`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (response.ok) {
    closeModal();
    type === 'course' ? showCourses() : showStudents();
  }
}

function editItem(type, id, name) {
  const modal = document.getElementById('modalContext');
  modal.innerHTML = `
    <div id="editModal">
      <h3>${type === 'course' ? 'Kurzus' : 'Diák'} szerkesztése</h3>
      <form onsubmit="updateItem(event, '${type}', ${id})">
        <input type="text" id="name" value="${name}" required />
        <button type="submit">Mentés</button>
        <button type="button" onclick="closeModal()">Bezárás</button>
      </form>
    </div>
  `;
  modal.style.display = 'flex';
}

async function updateItem(event, type, id) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const response = await fetch(`${apiBaseUrl}/${type}s/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (response.ok) {
    closeModal();
    type === 'course' ? showCourses() : showStudents();
  }
}

async function deleteItem(type, id) {
  const response = await fetch(`${apiBaseUrl}/${type}s/${id}`, { method: 'DELETE' });
  if (response.ok) {
    type === 'course' ? showCourses() : showStudents();
  }
}
async function addItem(event, type) {
    event.preventDefault();
    const name = document.getElementById('name').value;
  
    // Ellenőrizzük, hogy a név mező nem üres
    if (!name) {
      alert("A név mező nem lehet üres!");
      return;
    }
  
    try {
      const response = await fetch(`${apiBaseUrl}/${type}s`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }) // JSON formátumban küldjük
      });
  
      if (response.ok) {
        closeModal();
        type === 'course' ? showCourses() : showStudents();
      } else {
        const errorText = await response.text();
        alert(`Hiba történt: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Hiba a kérés során:', error);
      alert('Hiba történt a diák hozzáadása közben!');
    }
  }
  