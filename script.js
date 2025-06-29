function flipCard(card) {
    card.querySelector('.flip-card-inner').classList.toggle('flipped');
  }

  // --- Contadores ---
  let submitted = 0;
  let inProgress = 0;
  let deleted = 0;
  let completed = 0;

  function updateCounters() {
    document.getElementById("submittedCount").textContent = submitted;
    document.getElementById("inProgressCount").textContent = inProgress;
    document.getElementById("deletedCount").textContent = deleted;
    document.getElementById("completedCount").textContent = completed;
  }

  // --- Glow selection ---
  function toggleGlow(element) {
    document.querySelectorAll('.glow-card').forEach(card => card.classList.remove('active-glow'));
    element.classList.add('active-glow');

    const serviceName = element.closest('.service-card').querySelector('.service-label').textContent;
    document.getElementById('serviceName').textContent = serviceName;

    const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
    modal.show();
  }

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.glow-card')) {
      document.querySelectorAll('.glow-card').forEach(card => card.classList.remove('active-glow'));
    }
  });

  // --- Formulario servicio ---
  function submitServiceRequest() {
    const form = document.getElementById('serviceForm');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const service = document.getElementById("serviceName").textContent;
    const hours = document.getElementById("hours").value;
    const rate = document.getElementById("rate").value;
    const people = document.getElementById("people").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    let container = document.getElementById("tableContainer");
    let table = container.querySelector("table");

    if (!table) {
      table = document.createElement("table");
      table.className = "table table-bordered mt-3";
      table.innerHTML = `
        <thead class="table-light">
          <tr>
            <th>Service</th>
            <th>Hours</th>
            <th>Rate</th>
            <th>People</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
            <th></th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      container.appendChild(table);
    }

    const row = table.querySelector("tbody").insertRow();
    row.innerHTML = `
      <td>${service}</td>
      <td>${hours}</td>
      <td>$${parseFloat(rate).toFixed(2)}</td>
      <td>${people}</td>
      <td>${startDate}</td>
      <td>${endDate || '-'}</td>
      <td>
        <button class="btn btn-sm btn-primary me-1" onclick="editRow(this)">Edit</button>
        <button class="btn btn-sm btn-success me-1" onclick="sendRow(this)">Send</button>
        <button class="btn btn-sm btn-danger" onclick="deleteRow(this)">Delete</button>
      </td>
      <td></td>
    `;

    submitted++;
    updateCounters();

    const modal = bootstrap.Modal.getInstance(document.getElementById('serviceModal'));
    modal.hide();
    form.reset();
  }

  // --- Funciones para botones ---
  let rowToDelete = null;

function deleteRow(button) {
  rowToDelete = button.closest("tr");

  const cells = rowToDelete.querySelectorAll("td");
  const list = document.getElementById("deleteRowData");
  list.innerHTML = "";

  const labels = ["Service", "Hours", "Rate", "People", "Start Date", "End Date"];

  for (let i = 0; i < 6 && i < cells.length; i++) {
    const label = labels[i];
    const value = cells[i].textContent;
    const li = document.createElement("li");
    li.textContent = `${label}: ${value}`;
    list.appendChild(li);
  }

  const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
  modal.show();
}

function confirmDelete() {
  if (rowToDelete) {
    rowToDelete.remove();
    deleted++;
    updateCounters();
    rowToDelete = null;

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
    modal.hide();
  }
}

  function editRow(button) {
    alert("Edit function not implemented yet.");
  }

  function sendRow(button) {
    alert("Send function not implemented yet.");
  }

  

   

  document.getElementById("loginBtn").addEventListener("click", function () {
    const btn = this;
    const spinner = document.getElementById("loginSpinner");
    const text = document.getElementById("loginText");

    // Mostrar spinner
    spinner.classList.remove("d-none");
    text.textContent = "Logging in...";

    // Deshabilitar botón para evitar múltiples clics
    btn.disabled = true;

    // Espera 1.5 segundos y luego redirige
    setTimeout(() => {
      window.location.href = './MyBabco.html';
    }, 1500);
  });
  


 
  document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
      name: document.getElementById('regName').value,
      propertyManager: document.getElementById('regProperty').value,
      email: document.getElementById('regEmail').value,
      phone: document.getElementById('regPhone').value,
      
    };

    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('User registered successfully!');
      document.getElementById('registerForm').reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
      modal.hide();
    } else {
      const result = await response.json();
      alert('Error: ' + result.message);
    }
  });


   